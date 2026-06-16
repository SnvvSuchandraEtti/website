import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, ExternalLink, BookOpen, Trash2, Globe,
  Mic, MicOff, Volume2, VolumeX, Square, Loader2, Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import JdMatchSheet from '@/components/ai/JdMatchSheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { enhancedChatCompletion } from '@/services/enhanced-chat-service';
import { annotateCitations, type Citation, type WebSource } from '@/services/openai-service';
import { useIsMobile } from '@/hooks/use-mobile';
import suchandraMainAsset from '@/assets/profile/suchandra-main.png.asset.json';

const TTS_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-cartesia`;
const TTS_AUTH = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const PORTRAIT = suchandraMainAsset.url;

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citations?: Citation[];
  webSources?: WebSource[];
  timestamp: Date;
}

const STORAGE_KEY = 'suchandra-chat-v2';
const VOICE_KEY = 'suchandra-chat-voice';
const MAX_PERSISTED = 20;
// Bound the prompt sent to the model so cost/latency stay flat as history grows.
const MAX_HISTORY_TURNS = 8;
// Smooth-scroll only when the user is within this distance of the bottom.
const NEAR_BOTTOM_PX = 80;

const INITIAL_MESSAGE: Message = {
  id: '1',
  sender: 'bot',
  text: "Hey, I'm Suchandra 👋 Ask me about my projects, the stacks I work in, or what I'm building next.",
  timestamp: new Date(),
};

const suggestionButtons = [
  "Walk me through your strongest project.",
  "What's your experience with Flutter and React?",
  "Are you open to internships or full-time roles?",
  "What have you shipped to real users?",
];

// --- Citation routing ------------------------------------------------------
// Maps source IDs from the chat function (P1..P7, S*, E*, C*, A*, X*) to
// in-app routes so users can drill into the section that backs a claim.
const PROJECT_ID_MAP: Record<string, string> = {
  P1: 'hoot-edtech',
  P2: 'aclub-management',
  P3: 's-track',
  P4: 'ai-bg-remover',
  P5: 'viggiemart-marketplace',
  P6: 'shopnest-ecommerce',
  P7: 'leez-marketplace',
};

function internalHref(c: Citation): string | null {
  if (c.category === 'project') {
    const slug = PROJECT_ID_MAP[c.id];
    return slug ? `/projects/${slug}` : '/projects';
  }
  if (c.category === 'skill') return '/skills';
  if (c.category === 'experience') return '/experience';
  if (c.category === 'certification') return '/certificates';
  if (c.category === 'achievement') return '/about';
  if (c.category === 'personal') return '/contact';
  return null;
}

function citationTarget(c: Citation): { href: string; external: boolean } {
  if (c.url) return { href: c.url, external: true };
  const internal = internalHref(c);
  return internal ? { href: internal, external: false } : { href: '#', external: false };
}

// Validate a single persisted message — drop anything malformed.
function isValidMessage(m: unknown): m is Message {
  if (!m || typeof m !== 'object') return false;
  const x = m as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    (x.sender === 'user' || x.sender === 'bot') &&
    typeof x.text === 'string'
  );
}

function loadPersisted(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [INITIAL_MESSAGE];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [INITIAL_MESSAGE];
    const safe = parsed.filter(isValidMessage).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp ?? Date.now()),
    }));
    return safe.length > 0 ? safe : [INITIAL_MESSAGE];
  } catch {
    return [INITIAL_MESSAGE];
  }
}


function stripForSpeech(text: string): string {
  return text
    .replace(/\[[A-Z]\d{1,2}\]/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const BotAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    className="flex-shrink-0 rounded-full overflow-hidden bg-primary/20 border border-border/40 flex items-center justify-center text-[10px] font-semibold text-primary"
    style={{ width: size, height: size }}
  >
    <img
      src={PORTRAIT}
      alt=""
      aria-hidden="true"
      className="w-full h-full object-cover"
      onError={(e) => { (e.currentTarget.style.display = 'none'); }}
    />
  </div>
);

function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((ev: unknown) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jdOpen, setJdOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>(loadPersisted);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingSpeechId, setLoadingSpeechId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState(false);
  const [usingBackupVoice, setUsingBackupVoice] = useState(false);
  const backupNoticeShownRef = useRef(false);
  const [voiceOn, setVoiceOn] = useState<boolean>(() => {
    try { return localStorage.getItem(VOICE_KEY) === '1'; } catch { return false; }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const wasOpenRef = useRef(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const sttSupported = !!getSpeechRecognition();
  const ttsSupported = true; // Cartesia-backed; always available when network works

  const toggleChat = () => setIsOpen((v) => !v);

  // Persist conversation (last MAX_PERSISTED messages)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation.slice(-MAX_PERSISTED)));
    } catch { /* noop */ }

  }, [conversation]);

  const stopSpeaking = useCallback(() => {
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    }
    setIsSpeaking(false);
    setLoadingSpeechId(null);
  }, []);

  // Browser speechSynthesis fallback when every Cartesia slot is exhausted.
  const speakWithBrowserTTS = useCallback((cleaned: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    try {
      const utter = new SpeechSynthesisUtterance(cleaned);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => /en[-_](IN|GB|US)/i.test(v.lang) && /male|google|natural/i.test(v.name))
        ?? voices.find((v) => /^en/i.test(v.lang))
        ?? voices[0];
      if (preferred) utter.voice = preferred;
      utter.rate = 1;
      utter.pitch = 1;
      utter.onstart = () => { setIsSpeaking(true); setLoadingSpeechId(null); };
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => { setIsSpeaking(false); setLoadingSpeechId(null); };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Persist voice toggle; muting cancels in-flight playback
  useEffect(() => {
    try { localStorage.setItem(VOICE_KEY, voiceOn ? '1' : '0'); } catch { /* noop */ }
    if (!voiceOn) stopSpeaking();
  }, [voiceOn, stopSpeaking]);

  // Smart scroll: only smooth-scroll when user is already near the bottom; otherwise jump.
  useEffect(() => {
    const end = messagesEndRef.current;
    const container = messagesContainerRef.current;
    if (!end) return;
    if (!container) {
      end.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
    end.scrollIntoView({ behavior: distance < NEAR_BOTTOM_PX ? 'smooth' : 'auto' });
  }, [conversation, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Sync conversation across tabs (storage events fire on *other* tabs).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (!Array.isArray(parsed)) return;
        const safe = parsed.filter(isValidMessage).map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp ?? Date.now()),
        }));
        if (safe.length > 0) setConversation(safe);
      } catch { /* noop */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      recognitionRef.current?.abort();
      setIsListening(false);
      setInterimTranscript('');
      // Restore focus to the trigger button when the panel closes (a11y).
      if (wasOpenRef.current) triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, stopSpeaking]);


  useEffect(() => () => {
    stopSpeaking();
    recognitionRef.current?.abort();
  }, [stopSpeaking]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const speak = useCallback(async (text: string, messageId?: string) => {
    const cleaned = stripForSpeech(text);
    if (!cleaned) return;
    stopSpeaking();

    const controller = new AbortController();
    ttsAbortRef.current = controller;
    setLoadingSpeechId(messageId ?? '__inline__');
    setVoiceError(false);

    const fallbackToBrowser = (reason: string) => {
      console.warn(`Cartesia TTS unavailable (${reason}); using browser speechSynthesis.`);
      const ok = speakWithBrowserTTS(cleaned);
      if (ok) {
        setUsingBackupVoice(true);
        if (!backupNoticeShownRef.current) backupNoticeShownRef.current = true;
      } else {
        setVoiceError(true);
        setLoadingSpeechId(null);
        setIsSpeaking(false);
      }
    };

    try {
      const res = await fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(TTS_AUTH ? { Authorization: `Bearer ${TTS_AUTH}`, apikey: TTS_AUTH } : {}),
        },
        body: JSON.stringify({ text: cleaned }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        // 503 = all Cartesia slots exhausted; any other non-OK → also fall back gracefully.
        fallbackToBrowser(`http ${res.status}`);
        return;
      }
      const blob = await res.blob();
      if (controller.signal.aborted) return;
      setUsingBackupVoice(false);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => { setIsSpeaking(true); setLoadingSpeechId(null); };
      audio.onended = () => {
        setIsSpeaking(false);
        if (audioUrlRef.current === url) { URL.revokeObjectURL(url); audioUrlRef.current = null; }
      };
      audio.onerror = () => fallbackToBrowser('audio element error');
      await audio.play();
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      fallbackToBrowser((err as Error).message || 'network');
    }
  }, [stopSpeaking, speakWithBrowserTTS]);

  const handleSubmitMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Cap history to last MAX_HISTORY_TURNS turns to bound cost and latency.
      const trimmed = conversation.slice(-MAX_HISTORY_TURNS * 2);
      const response = await enhancedChatCompletion([
        ...trimmed.map((msg) => ({
          role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.text,
        })),
        { role: 'user' as const, content: messageText },
      ]);


      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.message,
        citations: response.citations,
        webSources: response.webSources,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, botMessage]);
      if (voiceOn) void speak(response.message, botMessage.id);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setConversation((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Sorry — I hit a snag answering that. Mind trying again?",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setShowSuggestions(false);
    handleSubmitMessage(s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitMessage(message);
  };

  const handleClearChat = () => {
    stopSpeaking();
    setConversation([INITIAL_MESSAGE]);
    setShowSuggestions(true);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  };

  const toggleMic = useCallback(() => {
    if (!sttSupported) return;
    if (isListening) { stopListening(); return; }
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (ev) => {
      let transcript = '';
      for (let i = 0; i < ev.results.length; i++) transcript += ev.results[i][0].transcript;
      setMessage(transcript);
      setInterimTranscript(transcript);
    };
    rec.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      recognitionRef.current = null;
      inputRef.current?.focus();
    };
    rec.onerror = () => {
      setIsListening(false);
      setInterimTranscript('');
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    setIsListening(true);
    try { rec.start(); } catch { setIsListening(false); }
  }, [sttSupported, isListening, stopListening]);

  const toggleVoice = useCallback(() => setVoiceOn((v) => !v), []);

  // Keyboard controls scoped to the open chat:
  //   Esc      → cancel mic / TTS / close
  //   Alt+M    → toggle mic
  //   Alt+V    → toggle voice replies
  //   Alt+S    → stop speaking
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isListening) { stopListening(); return; }
        if (isSpeaking) { stopSpeaking(); return; }
        setIsOpen(false);
        return;
      }
      if (!e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'm' && sttSupported) { e.preventDefault(); toggleMic(); }
      else if (k === 'v' && ttsSupported) { e.preventDefault(); toggleVoice(); }
      else if (k === 's' && ttsSupported) { e.preventDefault(); stopSpeaking(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isListening, isSpeaking, sttSupported, ttsSupported, toggleMic, toggleVoice, stopSpeaking, stopListening]);

  const hasUserMessage = conversation.some((m) => m.sender === 'user');

  // ---- Citation chip renderer for inline `[N]` tokens in markdown -----------
  const renderInlineCode = (ordered: Citation[]) =>
    ({ children }: { children?: React.ReactNode }) => {
      const raw = String(children ?? '');
      const m = raw.match(/^\[(\d+)\]$/);
      if (!m) return <code>{children}</code>;
      const idx = parseInt(m[1], 10) - 1;
      const c = ordered[idx];
      if (!c) return <code>{children}</code>;
      const { href, external } = citationTarget(c);
      const label = `Source ${idx + 1}: ${c.label}`;
      const className = 'inline-flex items-center align-baseline mx-0.5 px-1.5 py-0 rounded-full bg-primary/15 text-primary text-[0.7rem] font-semibold hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors no-underline';
      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label} className={className}>
            [{idx + 1}]
          </a>
        );
      }
      return (
        <button
          type="button"
          title={label}
          aria-label={label}
          onClick={() => { setIsOpen(false); navigate(href); }}
          className={className}
        >
          [{idx + 1}]
        </button>
      );
    };

  return (
    <>
      {/* Live region for voice state announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {isListening && (interimTranscript ? `Listening: ${interimTranscript}` : 'Listening')}
        {!isListening && isSpeaking && 'Suchandra is speaking'}
      </div>

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn('fixed z-50', isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8')}
      >
        <Button
          ref={triggerRef}
          onClick={toggleChat}

          aria-label={isOpen ? 'Close chat with Suchandra' : 'Chat with Suchandra'}
          aria-expanded={isOpen}
          className={cn(
            'rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300',
            isMobile ? 'h-12 w-12' : 'h-14 w-14',
          )}
        >
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isOpen
              ? <X className={cn('text-primary-foreground', isMobile ? 'h-5 w-5' : 'h-6 w-6')} />
              : <MessageCircle className={cn('text-primary-foreground', isMobile ? 'h-5 w-5' : 'h-6 w-6')} />}
          </motion.div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-background/60 backdrop-blur-md"
              aria-hidden="true"
            />
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Chat with Suchandra"
              className={cn(
                'fixed z-40 rounded-2xl overflow-hidden shadow-2xl bg-background/95 backdrop-blur-lg border border-border/50 flex flex-col',
                isMobile
                  ? 'bottom-20 left-4 right-4 top-4 max-h-[calc(100vh-6rem)]'
                  : 'bottom-20 right-8 w-[26rem] h-[640px]',
              )}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <BotAvatar size={36} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">Chat with Suchandra</h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Ask me about my projects, experience, and what I'm building.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => setJdOpen(true)}
                    aria-label="Paste a job description for a tailored pitch"
                    title="Paste a JD"
                    className="h-7 px-2 hover:bg-muted/50 text-primary text-[11px] font-medium gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Paste JD
                  </Button>
                  {ttsSupported && isSpeaking && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={stopSpeaking}
                      aria-label="Stop voice playback (Alt+S)"
                      title="Stop voice playback (Alt+S)"
                      className="h-7 w-7 p-0 hover:bg-muted/50 text-primary"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </Button>
                  )}
                  {ttsSupported && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={toggleVoice}
                      aria-label={voiceOn ? 'Mute voice replies (Alt+V)' : 'Unmute voice replies (Alt+V)'}
                      aria-pressed={voiceOn}
                      title={voiceOn ? 'Mute voice replies (Alt+V)' : 'Unmute voice replies (Alt+V)'}
                      className="h-7 w-7 p-0 hover:bg-muted/50"
                    >
                      {voiceOn ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost" size="sm" onClick={handleClearChat}
                    aria-label="Clear chat history" title="Clear chat"
                    className="h-7 w-7 p-0 hover:bg-muted/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="sm" onClick={toggleChat}
                    aria-label="Close chat (Esc)"
                    className="h-7 w-7 p-0 hover:bg-muted/50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex gap-2 max-w-[85%]', msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto')}
                  >
                    {msg.sender === 'user' ? (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-semibold" aria-hidden="true">You</div>
                    ) : (
                      <BotAvatar />
                    )}
                    <div className={cn(
                      'px-3 py-2 rounded-2xl text-sm leading-relaxed',
                      msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md',
                    )}>
                      {msg.sender === 'bot' ? (() => {
                        const { text, ordered } = annotateCitations(msg.text, msg.citations ?? []);
                        return (
                          <>
                            <div className="prose prose-sm prose-invert max-w-none break-words [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_a]:text-primary">
                              <ReactMarkdown
                                components={{ code: renderInlineCode(ordered) }}
                              >
                                {text}
                              </ReactMarkdown>
                            </div>
                            {ordered.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/40 space-y-1.5">
                                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                                  <BookOpen className="h-3 w-3" /> Sources
                                </div>
                                <ol className="space-y-1">
                                  {ordered.map((c, i) => {
                                    const { href, external } = citationTarget(c);
                                    const labelEl = (
                                      <span className="font-medium text-primary hover:underline inline-flex items-center gap-1">
                                        {c.label}
                                        <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                                      </span>
                                    );
                                    return (
                                      <li key={c.id} className="text-xs flex gap-1.5 items-start">
                                        <span className="text-primary font-semibold shrink-0">[{i + 1}]</span>
                                        <div className="min-w-0">
                                          {external ? (
                                            <a
                                              href={href}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              aria-label={`Open ${c.label} in a new tab`}
                                              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                                            >
                                              {labelEl}
                                            </a>
                                          ) : (
                                            <Link
                                              to={href}
                                              onClick={() => setIsOpen(false)}
                                              aria-label={`Go to ${c.label}`}
                                              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                                            >
                                              {labelEl}
                                            </Link>
                                          )}
                                          <p className="text-muted-foreground leading-snug">{c.snippet}</p>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ol>
                              </div>
                            )}
                            {msg.webSources && msg.webSources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/40 space-y-1.5">
                                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                                  <Globe className="h-3 w-3" /> Web sources
                                </div>
                                <ol className="space-y-1">
                                  {msg.webSources.map((w, i) => (
                                    <li key={`${w.url}-${i}`} className="text-xs flex gap-1.5 items-start">
                                      <span className="text-primary font-semibold shrink-0">[{i + 1}]</span>
                                      <div className="min-w-0">
                                        <a
                                          href={w.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          aria-label={`Open ${w.title} in a new tab`}
                                          className="font-medium text-primary hover:underline inline-flex items-center gap-1 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                                        >
                                          {w.title} <ExternalLink className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                                        </a>
                                        {w.snippet && <p className="text-muted-foreground leading-snug">{w.snippet}</p>}
                                      </div>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p className="text-[10px] opacity-60">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {ttsSupported && (
                                <button
                                  type="button"
                                  onClick={() => void speak(msg.text, msg.id)}
                                  disabled={loadingSpeechId === msg.id}
                                  aria-label={loadingSpeechId === msg.id ? 'Generating voice…' : 'Play this reply in my voice'}
                                  title={loadingSpeechId === msg.id ? 'Generating voice…' : 'Play this reply in my voice'}
                                  className="opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary/50 rounded p-0.5 disabled:opacity-50"
                                >
                                  {loadingSpeechId === msg.id
                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                    : <Volume2 className="h-3 w-3" />}
                                </button>
                              )}
                            </div>
                          </>
                        );
                      })() : (
                        <>
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <p className="text-[10px] opacity-60 mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {showSuggestions && !hasUserMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-wrap gap-2 max-w-[90%] mr-auto"
                  >
                    {suggestionButtons.map((s, i) => (
                      <Button
                        key={i} variant="outline" size="sm"
                        onClick={() => handleSuggestionClick(s)}
                        className="text-xs h-8 px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {s}
                      </Button>
                    ))}
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 max-w-[85%] mr-auto">
                    <BotAvatar />
                    <div className="px-3 py-2 rounded-2xl bg-muted rounded-bl-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1" aria-hidden="true">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-100" />
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-200" />
                        </div>
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Voice status caption — visible to all users, not just SR */}
              {(isListening || isSpeaking || loadingSpeechId || voiceError) && (
                <div
                  className="px-3 py-1.5 border-t border-border/30 bg-primary/10 text-[11px] text-foreground/90 flex items-center gap-2"
                  aria-hidden="true"
                >
                  {isListening ? (
                    <>
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                      <span className="truncate">
                        Listening… {interimTranscript && <span className="italic opacity-80">"{interimTranscript}"</span>}
                      </span>
                    </>
                  ) : loadingSpeechId ? (
                    <>
                      <Loader2 className="h-3 w-3 text-primary flex-shrink-0 animate-spin" />
                      <span className="flex-1 truncate">Generating my voice…</span>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="underline text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
                        aria-label="Cancel voice generation"
                      >
                        Cancel
                      </button>
                    </>
                  ) : isSpeaking ? (
                    <>
                      <Volume2 className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="flex-1 truncate">
                        {usingBackupVoice ? 'Suchandra is speaking (backup voice)…' : 'Suchandra is speaking…'}
                      </span>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="underline text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
                        aria-label="Stop voice playback (Alt+S)"
                      >
                        Stop
                      </button>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate text-muted-foreground">Voice is unavailable right now — text reply is shown above.</span>
                      <button
                        type="button"
                        onClick={() => setVoiceError(false)}
                        className="underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
                        aria-label="Dismiss voice error"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-border/30 bg-background/50">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                  {sttSupported && (
                    <Button
                      type="button"
                      onClick={toggleMic}
                      size="sm"
                      variant={isListening ? 'default' : 'outline'}
                      aria-label={isListening ? 'Stop voice input (Esc or Alt+M)' : 'Start voice input (Alt+M)'}
                      aria-pressed={isListening}
                      title={isListening ? 'Stop voice input (Esc)' : 'Start voice input (Alt+M)'}
                      className={cn(
                        'h-9 w-9 p-0 flex-shrink-0',
                        isListening && 'animate-pulse bg-primary text-primary-foreground',
                      )}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  )}
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isListening ? 'Listening…' : 'Ask me anything about my work…'}
                    disabled={isLoading}
                    aria-label="Message Suchandra"
                    className="border-border/30 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/30 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit" size="sm"
                    disabled={!message.trim() || isLoading}
                    aria-label="Send message"
                    className="h-9 w-9 p-0 flex-shrink-0 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-2 text-[10px] text-muted-foreground/70 text-center">
                  Digital version of me — answers may be imperfect.
                  {(sttSupported || ttsSupported) && (
                    <>
                      {' '}Shortcuts:
                      {sttSupported && ' Alt+M mic ·'}
                      {ttsSupported && ' Alt+V mute · Alt+S stop ·'}
                      {' '}Esc close
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <JdMatchSheet open={jdOpen} onClose={() => setJdOpen(false)} />
    </>
  );
};

export default EnhancedChatbot;

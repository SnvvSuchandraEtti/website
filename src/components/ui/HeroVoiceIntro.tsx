import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';

const INTRO_TEXT =
  "Hi, I'm Suchandra Etti, a full-stack and mobile developer from India. I build apps used by 18,000 plus users. Welcome to my portfolio.";

/**
 * Plays a short voice intro via the browser's built-in Web Speech API.
 * Free, no API keys, works offline. Falls back gracefully if unsupported.
 */
const HeroVoiceIntro: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const pickFriendlyVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    // Prefer natural English female voices
    const preferred =
      voices.find((v) => /Samantha|Google US English|Microsoft Aria|Jenny|Zira/i.test(v.name)) ||
      voices.find((v) => v.lang?.startsWith('en') && /female|woman|aria|jenny/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang?.startsWith('en'));
    return preferred ?? voices[0];
  };

  const handleToggle = () => {
    if (!supported) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const speak = () => {
      const u = new SpeechSynthesisUtterance(INTRO_TEXT);
      const voice = pickFriendlyVoice();
      if (voice) u.voice = voice;
      u.rate = 1;
      u.pitch = 1.05;
      u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      utterRef.current = u;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      setPlaying(true);
    };
    // Voices load asynchronously on some browsers
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={playing}
      aria-label={playing ? 'Stop voice intro' : 'Play voice intro'}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-effect text-foreground font-semibold transition-all border border-primary/30 hover:bg-primary/10"
    >
      {playing ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      <span>{playing ? 'Stop intro' : 'Hear my intro'}</span>
      <span className="flex items-end gap-[2px] h-4 ml-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-sm bg-primary ${playing ? 'animate-waveform' : 'h-1 opacity-50'}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
    </motion.button>
  );
};

export default HeroVoiceIntro;

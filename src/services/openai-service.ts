// Calls the secure backend `chat` Edge Function. No API keys live in the browser.
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Citation {
  id: string;
  category: 'project' | 'skill' | 'experience' | 'certification' | 'achievement' | 'personal';
  label: string;
  snippet: string;
  url?: string;
}

export interface WebSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatResult {
  content: string;
  citations: Citation[];
  webSources: WebSource[];
  provider?: string;
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<ChatResult> {
  try {
    const { data, error } = await supabase.functions.invoke('chat', { body: { messages } });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return {
      content: data?.message?.content ?? '',
      citations: data?.citations ?? [],
      webSources: data?.webSources ?? [],
      provider: data?.provider,
    };
  } catch (error) {
    console.error('Error in chat completion:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: `I'm sorry — I couldn't reach the AI service. ${msg.includes('429') ? 'Please try again in a moment.' : 'Please try again later.'}`,
      citations: [],
      webSources: [],
    };
  }
}

// Pure helper exported for tests
export function annotateCitations(text: string, citations: Citation[]) {
  if (!citations.length) return { text, ordered: [] as Citation[] };
  const order: string[] = [];
  const re = /\s?\[([A-Z]\d{1,2})\]/g;
  const rendered = text.replace(re, (_, id: string) => {
    if (!citations.find((c) => c.id === id)) return '';
    let idx = order.indexOf(id);
    if (idx === -1) { order.push(id); idx = order.length - 1; }
    return ` \`[${idx + 1}]\``;
  });
  const ordered = order.map((id) => citations.find((c) => c.id === id)!).filter(Boolean);
  return { text: rendered, ordered };
}

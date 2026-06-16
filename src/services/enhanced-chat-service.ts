// Enhanced chat service that connects to secure backend
import { getChatCompletion, type Citation, type WebSource } from './openai-service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: string;
  citations: Citation[];
  webSources: WebSource[];
  type: 'text';
  tokens: number;
  confidence: number;
}

export async function enhancedChatCompletion(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await getChatCompletion(messages);
  return {
    message: response.content,
    citations: response.citations,
    webSources: response.webSources,
    type: 'text',
    tokens: 0,
    confidence: 1.0,
  };
}

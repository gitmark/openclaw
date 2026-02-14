// TypeScript: Shared type definitions used across client and server

export interface Message {
  id: number;
  content: string;
  aiEnhanced: boolean;
  aiResponse?: string;
  createdAt: string;
}

export interface CreateMessageRequest {
  content: string;
  useAI?: boolean;
}

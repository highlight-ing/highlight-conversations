// src/types/types.ts

export interface GeneratedPrompt {
    text: string;
    index: number;
  }
  
  export interface LLMMessage {
    content: string;
    role: "system" | "user";
  }

  export type CopyState = 'idle' | 'copying' | 'copied' | 'hiding';
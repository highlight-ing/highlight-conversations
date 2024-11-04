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

  export type TranscriptButtonType = 'Copy' | 'Share' | 'Save' | 'SendFeedback'

export type TranscriptButtonStatus = 'idle' | 'success'

export type TranscriptButtonConfig = {
  type: TranscriptButtonType
  onClick: () => void
  status: TranscriptButtonStatus
}
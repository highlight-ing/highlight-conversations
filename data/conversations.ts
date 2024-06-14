// data/conversations.ts
//TODO: Temporary skeleton data

// types/conversation.ts
export interface ConversationData {
  id: string; // UUID
  summary: string;
  timestamp: string; // e.g., "June 12, 2024 03:28pm"
  topic: string;
  transcript: string;
}

// Initialize with empty array or some mock data if needed
export const conversations: ConversationData[] = [];
// data/conversations.ts
import { v4 as uuidv4 } from "uuid"

export interface ConversationData {
  id: string // UUID
  summary: string
  timestamp: Date
  topic: string
  transcript: string
  summarized: boolean
}

export const createConversation = (transcript: string): ConversationData => {
  let uuid = uuidv4();
  return {
    id: uuid,
    summary: '',
    topic: '',
    transcript: transcript,
    timestamp: new Date(),
    summarized: false,
  }
}


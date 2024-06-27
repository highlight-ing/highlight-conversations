// data/conversations.ts
import { v4 as uuidv4 } from "uuid"

export interface ConversationData {
  id: string // UUID
  summary: string
  timestamp: Date
  topic: string
  transcript: string
}

export const createConversation = (transcript: string): ConversationData => {
  let uuid = uuidv4();
  return {
    id: uuid,
    summary: transcript.slice(0, 50),
    topic: uuid.slice(0, 4),
    transcript: transcript,
    timestamp: new Date(),
  }
}
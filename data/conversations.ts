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

export type FormatType = "CardTranscript" | "DialogueTranscript"

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
//TODO: FormatType might be redudant now they use the same formatting, but keeping temporary in case we want some differences other places
export const formatTranscript = (transcript: string, formatType: FormatType): string => {
  const regex = /(\d{1,2}:\d{2}:\d{2} [AP]M) - ([^:]+):/g;
  let isFirstOccurrence = true;
  
  return transcript.replace(regex, (match, time, speaker) => {
    if (isFirstOccurrence) {
      isFirstOccurrence = false;
      return `${time} - ${speaker}:`;
    }
    switch (formatType) {
      case "CardTranscript":
        return `\n\n${time} - ${speaker}:`;
      case "DialogueTranscript":
        return `\n\n${time} - ${speaker}:`;
      default:
        return `\n${time} - ${speaker}:`; // Default to single newline
    }
  });
};
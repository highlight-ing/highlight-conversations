// data/conversations.ts
import { v4 as uuidv4 } from "uuid"
export interface ConversationData {
  id: string // UUID
  title: string
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
    title: '',
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

export const defaultConversation: ConversationData = {
  id: uuidv4(),
  title: 'Example Conversation',
  transcript: `9:58:02 AM - self: Hey, are you joining the standup? It's about to start. 9:58:10 AM - other: Standup? I thought we were having a sit-down meeting. 9:58:18 AM - self: No, it's a standup. You know, our daily agile meeting? 9:58:26 AM - other: Oh, right. So should I stand up at my desk or...? 9:58:35 AM - self: No, no. You can sit. It's just called a standup because it's meant to be quick. 9:58:44 AM - other: Got it. So what's on the agenda? Are we discussing that new Python script? 9:58:53 AM - self: Python? I thought we were working with JavaScript for this project. 9:59:01 AM - other: JavaScript? But the ticket mentioned a snake-related bug. 9:59:10 AM - self: That's just the name of the bug. It's not about actual snakes or Python. 9:59:18 AM - other: Oh, I see. Well, at least we're not dealing with any Cobols. 9:59:26 AM - self: Cobols? Do you mean COBOL? 9:59:34 AM - other: No, I mean Cobols. You know, the venomous snakes? 9:59:42 AM - self: Those are Cobras! Look, let's just join the meeting and sort this out. 9:59:50 AM - other: Alright, I'm ready. Should I turn my camera on or is this a slither-call? 9:59:58 AM - self: It's a video call! Just... never mind. See you in the meeting.`,
  summary: "",
  timestamp: new Date(),
  topic: "",
  summarized: false
};
// data/conversations.ts
import { v4 as uuidv4 } from "uuid"
export interface ConversationData {
  id: string
  title: string
  summary: string
  startedAt: Date
  endedAt: Date
  timestamp: Date
  topic: string
  transcript: string
  summarized: boolean
  shareLink: string
  userId: string
}

export type FormatType = "CardTranscript" | "DialogueTranscript"

export const createConversation = (transcript: string, startedAt: Date, endedAt: Date): ConversationData => {
  return {
    id: uuidv4(),
    title: '',
    summary: '',
    topic: '',
    transcript,
    startedAt,
    endedAt,
    timestamp: new Date(),
    summarized: false,
    shareLink: '',
    userId: '',
  }
}

const cleanTranscript = (text: string): string => {
  const lines = text.split('\n');
  return lines
    .filter(line => {
      const match = line.match(/^(\d{2}:\d{2}:\d{2} [AP]M) - ([^:]+): (.*)$/);
      if (!match) return true; // Keep lines that don't match the expected format

      const [, , , content] = match;
      const trimmedContent = content.trim();

      // Remove lines with only empty brackets (including multiple brackets and whitespace)
      if (/^(\[[\s]*\][\s]*)+$/.test(trimmedContent)) return false;

      // Remove lines with single-word responses
      if (trimmedContent.split(/\s+/).length === 1) return false;

      return true;
    })
    .join('\n');
};

const removeDuplicateLines = (text: string): string => {
  const lines = text.split('\n');
  const seenLines = new Map<string, Set<string>>();

  return lines.filter((line) => {
    const match = line.match(/^(\d{2}:\d{2}:\d{2} [AP]M) - ([^:]+): (.*)$/);
    if (!match) return true; // Keep lines that don't match the expected format

    const [, timestamp, speaker, content] = match;
    const key = `${timestamp}-${speaker}`;

    if (!seenLines.has(key)) {
      seenLines.set(key, new Set());
    }

    const contentSet = seenLines.get(key)!;
    if (contentSet.has(content)) {
      return false; // Duplicate found, remove this line
    } else {
      contentSet.add(content);
      return true; // New content for this timestamp-speaker combination, keep the line
    }
  }).join('\n');
};

const removeThankYouLines = (text: string): string => {
  const lines = text.split('\n');
  return lines
    .filter(line => {
      const match = line.match(/^(\d{2}:\d{2}:\d{2} [AP]M) - ([^:]+): (.*)$/);
      if (!match) return true; // Keep lines that don't match the expected format

      const [, , , content] = match;
      const trimmedContent = content.trim().toLowerCase();

      // Remove lines with only "Thank you" or "Thank you." (case-insensitive)
      if (trimmedContent === 'thank you' || trimmedContent === 'thank you.') return false;

      return true;
    })
    .join('\n');
};

export const formatTranscript = (transcript: string, formatType: FormatType): string => {
  // Step 1: Remove extra newlines and spaces
  let formattedTranscript = transcript.replace(/\s+/g, ' ').trim();

  // Step 2: Add newlines after each timestamp
  const regex = /(\d{2}:\d{2}:\d{2} [AP]M - [^:]+:)/g;
  formattedTranscript = formattedTranscript.replace(regex, '\n$1');

  // Step 3: Remove leading newline if present
  formattedTranscript = formattedTranscript.replace(/^\n/, '');

  // Step 4: Clean the transcript (remove single-word responses and empty brackets)
  formattedTranscript = cleanTranscript(formattedTranscript);

  // Step 5: Remove duplicate lines
  formattedTranscript = removeDuplicateLines(formattedTranscript);

  // Step 6: Remove "Thank you" lines
  formattedTranscript = removeThankYouLines(formattedTranscript);

  // Step 7: Apply format-specific adjustments
  switch (formatType) {
    case "CardTranscript":
    case "DialogueTranscript":
      // Keep single newlines
      return formattedTranscript;
    default:
      // Add an extra newline for paragraph-style formatting
      return formattedTranscript.replace(/\n/g, '\n\n');
  }
}

export const defaultConversation: ConversationData = {
  id: uuidv4(),
  title: 'Example Conversation',
  transcript: `9:58:02 AM - self: Hey, are you joining the standup? It's about to start. 9:58:10 AM - other: Standup? I thought we were having a sit-down meeting. 9:58:18 AM - self: No, it's a standup. You know, our daily agile meeting? 9:58:26 AM - other: Oh, right. So should I stand up at my desk or...? 9:58:35 AM - self: No, no. You can sit. It's just called a standup because it's meant to be quick. 9:58:44 AM - other: Got it. So what's on the agenda? Are we discussing that new Python script? 9:58:53 AM - self: Python? I thought we were working with JavaScript for this project. 9:59:01 AM - other: JavaScript? But the ticket mentioned a snake-related bug. 9:59:10 AM - self: That's just the name of the bug. It's not about actual snakes or Python. 9:59:18 AM - other: Oh, I see. Well, at least we're not dealing with any Cobols. 9:59:26 AM - self: Cobols? Do you mean COBOL? 9:59:34 AM - other: No, I mean Cobols. You know, the venomous snakes? 9:59:42 AM - self: Those are Cobras! Look, let's just join the meeting and sort this out. 9:59:50 AM - other: Alright, I'm ready. Should I turn my camera on or is this a slither-call? 9:59:58 AM - self: It's a video call! Just... never mind. See you in the meeting.`,
  summary: '',
  timestamp: new Date(),
  topic: '',
  summarized: false,
  shareLink: '',
  userId: ''
};
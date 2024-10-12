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

export const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  })
}

// change it into September 9, 2024 9:24AM PDT format for conversation panel
export const panelFormatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, 
    timeZoneName: 'short'
  })
}



export const createConversation = (
  params: Partial<Omit<ConversationData, 'id' | 'summarized'>> = {}
): ConversationData => {
  const now = new Date()
  const endedAt = params.endedAt || now
  return {
    id: uuidv4(),
    title: params.title || `Conversation ended at ${formatDate(endedAt)}`,
    summary: '',
    topic: '',
    transcript: '',
    startedAt: params.startedAt || now,
    endedAt,
    timestamp: params.timestamp || now,
    summarized: params.summary !== undefined && params.summary !== '',
    shareLink: '',
    userId: '',
    ...params
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
  startedAt: new Date(),
  endedAt: new Date(),
  topic: '',
  summarized: false,
  shareLink: '',
  userId: ''
};

export const DEFAULT_SUMMARY_INSTRUCTION = `When generating the summary, adhere to the following guidelines:
  1. Begin with a concise list of important topics discussed in the first sentence.
  2. Follow with key points, decisions, and action items in order of importance.
  3. Highlight any conclusions, takeaways, or next steps agreed upon.
  4. Include relevant details such as names, dates, numbers, or specific terminology used.
  5. Maintain a neutral tone and avoid personal interpretations.
  6. Summarize any disagreements or alternative viewpoints presented.
  7. If applicable, note any unresolved issues or topics that require further discussion.
  8. Aim for clarity and conciseness while capturing the essence of the conversation.
  9. Be mindful of potential ASR errors and try to infer the correct meaning when encountering unclear transcriptions.
  10. Organize the summary in a logical flow, grouping related points together.`

// const DEFAULT_SUMMARY_INSTRUCTION = '"The Summary should jump straight into listing important topics discussed in the first sentence, with following sentences expanding on conclusions and takeaways."'

// const BASE_SYSTEM_PROMPT = 'Analyze the following conversation transcript and generate a JSON object containing the following fields: \'topics\' (an array of main topics discussed), \'summary\' (a brief summary of the conversation), and \'title\' (a concise title no more than 26 characters long). Your response must be valid JSON and nothing else. Do not include any explanations or markdown formatting. The response should be in this exact format: {"topics": ["topic1", "topic2", ...], "summary": "Brief summary here", "title": "Concise title (max 26 chars)"}'
export const BASE_SYSTEM_PROMPT = 'Analyze the following conversation transcript, which has been generated by an Automatic Speech Recognition (ASR) service. Be aware that the input may contain misspellings, transcription errors, or inconsistencies due to the nature of ASR. Generate a JSON object containing the following fields: \'topics\' (an array of main topics discussed), \'summary\' (a comprehensive summary of the conversation), and \'title\' (a concise title no more than 26 characters long). Your response must be valid JSON and nothing else. Do not include any explanations or markdown formatting. The response should be in this exact format: {\"topics\": [\"topic1\", \"topic2\", ...], \"summary\": \"Detailed summary here\", \"title\": \"Concise title (max 26 chars)\"}'
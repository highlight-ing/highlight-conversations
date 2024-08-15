import { ConversationData, formatTranscript, FormatType } from '@/data/conversations'

export const generateMarkdownContent = (conversation: ConversationData): string => {
  const { title, timestamp, topic, summary, transcript } = conversation;
  
  // Format the transcript before putting it in the code block
  const formattedTranscript = formatTranscript(transcript, "DialogueTranscript");
  
  return `# ${title}

*${timestamp.toLocaleString()}*

## Topic
${topic || 'N/A'}

## Summary
${summary || 'No summary available.'}

## Transcript
\`\`\`
${formattedTranscript}
\`\`\`

---

*Create and share your own transcripts, securely and for free with Conversations | by Highlight: [https://highlight.ing/apps/conversations](https://highlight.ing/apps/conversations)*
`
}
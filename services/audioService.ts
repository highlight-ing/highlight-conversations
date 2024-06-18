// services/audioService.ts
import Highlight from "@highlight-ai/app-runtime";
import { ConversationData } from '../data/conversations';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid package is installed

export const fetchTranscript = async (
  currentTranscript: string,
  setCurrentTranscript: React.Dispatch<React.SetStateAction<string>>,
  setConversations: React.Dispatch<React.SetStateAction<ConversationData[]>>,
  setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>,
  timeoutId: NodeJS.Timeout | null,
  setTimeoutId: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>
) => {
  const transcript = await Highlight.user.getAudio(false);
  console.log("Fetched audio data:", transcript);

  if (transcript) {
    setCurrentTranscript((prev) => prev + '\n' + transcript);
    setIsWaiting(false);

    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      const timestamp = new Date().toLocaleString('en-US', { 
        month: 'long', day: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', 
        hour12: true 
      });

      const newConversation: ConversationData = {
        id: uuidv4(),
        // take currentTranscript and provide the first 50 characters as the summary, and add ... to indicate more
        summary: currentTranscript.slice(0, 50) + (currentTranscript.length > 50 ? '...' : ''),
        timestamp,
        topic: '', 
        transcript: currentTranscript
      };

      setConversations((prev) => [...prev, newConversation]);
      setCurrentTranscript('');
    }, 45000); // 45 seconds
    setTimeoutId(newTimeoutId);
  } else {
    setIsWaiting(true);
  }
};

export const fetchMicActivity = async (): Promise<number> => {
  const micActivity = await Highlight.user.getMicActivity(300);
  console.log("Fetched mic activity:", micActivity);
  return micActivity;
};
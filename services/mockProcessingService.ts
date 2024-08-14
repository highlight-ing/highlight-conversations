import { ConversationData } from "@/data/conversations";
import { getTextPredictionFromHighlight } from "./highlightService";

export const mockProcessConversation = async (conversation: ConversationData, signal?: AbortSignal): Promise<Partial<ConversationData>> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({
        title: `Processed: ${conversation.title}`,
        summary: 'This is a mock summary of the conversation.',
        topic: 'Mock Topic',
      });
    }, 2000);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
};
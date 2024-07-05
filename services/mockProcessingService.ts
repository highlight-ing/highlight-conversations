import { ConversationData } from "@/data/conversations";

export const mockProcessConversation = (conversation: ConversationData): Promise<ConversationData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...conversation,
        topic: `Mock Topic for ${conversation.id}`,
        summary: `This is a mock summary for the conversation. It was processed at ${new Date().toLocaleString()}.`,
      });
    }, 2500);
  });
};
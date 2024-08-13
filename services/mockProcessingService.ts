import { ConversationData } from "@/data/conversations";
import { getTextPredictionFromHighlight } from "./highlightService";

export const mockProcessConversation = async (conversation: ConversationData): Promise<ConversationData> => {
    try {
        const processedData = await getTextPredictionFromHighlight(conversation.transcript);
        return {
            ...conversation,
            topic: processedData.topics.join(', '), // Join topics into a single string
            summary: processedData.summary,
            title: processedData.title
        };
    } catch (error) {
        console.error("Error in mockProcessConversation:", error);
        // Return the original conversation data if there's an error
        return conversation;
    }
};

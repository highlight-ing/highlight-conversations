import { ConversationData } from "@/data/conversations";
import { getTextPredictionFromHighlight } from "./highlightService";

export const processConversation = async (conversation: ConversationData, signal?: AbortSignal): Promise<ConversationData> => {
    try {
        const processedData = await getTextPredictionFromHighlight(conversation.transcript, signal);
        return {
            ...conversation,
            topic: processedData.topics.join(', '),
            summary: processedData.summary,
            title: processedData.title,
            summarized: true
        };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.log('Conversation processing was aborted');
            throw error; // Re-throw the AbortError
        }
        console.error("Error in processConversation:", error);
        // Return the original conversation data if there's an error
        return conversation;
    }
};
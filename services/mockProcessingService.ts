import { ConversationData } from "@/data/conversations";
import { getTextPredictionFromHighlight } from "./highlightService";

export const mockProcessConversation = async (conversation: ConversationData): Promise<ConversationData> => {
  console.log("Starting mockProcessConversation");
try {
console.log("Calling getTextPrediction");
const processedData = await getTextPredictionFromHighlight(conversation.transcript);
console.log("Processed data received:", processedData);
return {
...conversation,
topic: processedData.topics.join(', '), // Join topics into a single string
summary: processedData.summary
};
} catch (error) {
console.error("Error in mockProcessConversation:", error);
// Return the original conversation data if there's an error
return conversation;
}
};

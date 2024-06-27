import ConversationCard from "./ConversationCard";
import CurrentConversationCard from "./CurrentConversationCard";
import { ConversationData } from "@/data/conversations";

interface ConversationGridProps {
    currentConversation: string;
    conversations: ConversationData[];
    micActivity: number;
    isLoading: boolean;
}

const ConversationGrid: React.FC<ConversationGridProps> = ({ 
  currentConversation, 
  conversations, 
  micActivity, 
  isLoading 
}) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <CurrentConversationCard 
          transcript={currentConversation} 
          micActivity={micActivity}
          isLoading={isLoading}
        />
        {conversations.map(conversation => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    );
  };

export default ConversationGrid;

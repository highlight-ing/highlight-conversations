import ConversationCard from "./ConversationCard";
import { ConversationData } from "@/data/conversations";

interface ConversationGridProps {
    conversations: ConversationData[];
}

const ConversationGrid: React.FC<ConversationGridProps> = ({ conversations }) => {
    return (
        <div className="grid grid-cols-3 gap-4 flex-col">
            {conversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
        </div>
    )
}

export default ConversationGrid;

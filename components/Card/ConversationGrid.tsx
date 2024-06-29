import React, { useCallback }  from "react"
import { AnimatePresence, motion } from "framer-motion";
import ConversationCard from "./ConversationCard";
import CurrentConversationCard from "./CurrentConversationCard";
import { ConversationData } from "@/data/conversations";

interface ConversationGridProps {
  currentConversation: string
  conversations: ConversationData[]
  micActivity: number
  isWaitingForTranscript: boolean
  onDeleteConversation: (id: string) => void
  onSave: () => void
}

const ConversationGrid: React.FC<ConversationGridProps> = ({
  currentConversation,
  conversations,
  micActivity,
  isWaitingForTranscript,
  onDeleteConversation,
  onSave,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <CurrentConversationCard
        transcript={currentConversation}
        micActivity={micActivity}
        isWaitingForTranscript={isWaitingForTranscript}
        onSave={onSave}
      />
      <AnimatePresence>
      {conversations.map((conversation) => (
        <motion.div
        key={conversation.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        >
          <ConversationCard 
          key={conversation.id} 
          conversation={conversation}
          onDelete={onDeleteConversation} 
          />
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
};

export default ConversationGrid;

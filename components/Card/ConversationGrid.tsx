import React from "react"
import { AnimatePresence, motion } from "framer-motion";
import ConversationCard from "./SavedConversation/ConversationCard";
import CurrentConversationCard from "./CurrentConversationCard";
import { useConversations } from "@/contexts/ConversationContext";
import { 
  ONBOARDING_CURRENT_CARD,
  ONBOARDING_SAVED_CARD
} from "@/constants/appConstants"

const ConversationGrid: React.FC = () => {
  const { filteredConversations } = useConversations();

  return (
    <div className="w-full grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"> {/* Update this line */}
      <div id={ONBOARDING_CURRENT_CARD}>
        <CurrentConversationCard />
      </div>
      <AnimatePresence>
        {filteredConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div id={ONBOARDING_SAVED_CARD}>
              <ConversationCard conversation={conversation} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConversationGrid;
import React from 'react'
import { ConversationData } from '@/data/conversations'
import { ConversationEntry } from './ConversationEntry'
import { useConversations } from '@/contexts/ConversationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader } from './SectionHeader'

interface ConversationListProps {
  title?: string
  conversations: ConversationData[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  title,
  conversations
}) => {
  const { isMergeActive, selectedConversations } = useConversations()

  if (conversations.length === 0) return null

  return (
    <div className="mb-1"> {/* Adjusted margin */}
      <SectionHeader title={title} />
      <AnimatePresence initial={false}>
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConversationEntry
              conversation={conversation}
              isFirst={index === 0}
              isLast={index === conversations.length - 1}
              isMergeActive={isMergeActive}
              isSelected={selectedConversations.some(
                (conv) => conv.id === conversation.id
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ConversationList

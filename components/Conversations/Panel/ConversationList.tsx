import React from 'react'
import { ConversationData } from '@/data/conversations'
import { ConversationEntry } from './ConversationEntry'
import { useConversations } from '@/contexts/ConversationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader } from './SectionHeader'

/**
 * Props interface for the ConversationList component
 * @interface ConversationListProps 
 * @property Optional title for the conversation section
 * @property Array of conversation data to display
 */
interface ConversationListProps {
  title?: string
  conversations: ConversationData[]
}

// Animation constants
const ANIMATION_CONFIG = {
  initial: { opacity: 0, height: 0 },
  animate:  { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3 }
} as const 


/**
 * @component
 * Displays a list of conversation with animation 
 * and merge functionality
 * @params {ConversationListProps} props - Component props
 * @returns {React.ReactElement | null} Returns null if no conversations, otherwise returns the list 
 */
const ConversationList: React.FC<ConversationListProps> = ({
  title,
  conversations,
}) => {
  const { isMergeActive, selectedConversations } = useConversations()

  // Return null if there are no conversations to display 
  if (conversations.length === 0) return null

  /**
   * Checks if a conversation is selected for merging 
   * @param conversationId 
   * @returns 
   */
  const isConversationSelected = (conversationId: string): boolean => {
    return selectedConversations.some(
      (conv) => conv.id === conversationId
    )
  }

  return (
    <div className="mb-1"> {/* Adjusted margin */}
      <SectionHeader title={title} />
      <AnimatePresence initial={false}>
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            {...ANIMATION_CONFIG}
          >
            <ConversationEntry
              conversation={conversation}
              isFirst={index === 0}
              isLast={index === conversations.length - 1}
              isMergeActive={isMergeActive}
              isSelected={isConversationSelected(conversation.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ConversationList

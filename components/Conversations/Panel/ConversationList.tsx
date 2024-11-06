/**
 * 
 * @fileoverview Conversation list on the left panel
 * @author Jungyoon Lim, Joanne <[joanne@highlight.ing]>
 */

import React, { useCallback, useMemo } from 'react'
import { ConversationData } from '@/data/conversations'
import { ConversationEntry } from './ConversationEntry'
import { useConversations } from '@/contexts/ConversationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader } from './SectionHeader'

/**
 * Props interface for the ConversationList component
 * @interface ConversationListProps 
 * @param {title} for the conversation section
 * @param {Array} of conversation data to display
 * @param {className} for optional CSS class name for custom styling 
 */
interface ConversationListProps {
  title?: string
  conversations: ConversationData[]
  className?: string
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
 * @returns {JSX.Element | null} Returns null if no conversations, otherwise returns the list 
 */
const ConversationList: React.FC<ConversationListProps> = ({
  title,
  conversations,
  className = '',
}) => {
  const { isMergeActive, selectedConversations } = useConversations()

  // Return null if there are no conversations to display 
  if (conversations.length === 0) return null

  /**
   * Checks if a conversation is selected for merging 
   * Memoized the selection check function to prevent unnecessary recreations 
   * @param conversationId 
   * @returns 
   */
  const isConversationSelected = useCallback((conversationId: string): boolean => 
    selectedConversations.some(conv => conv.id === conversationId)
  , [selectedConversations])

  // Memoize the base className
  const baseClassName = useMemo(() => 
    `mb-1 ${className}`.trim()
  , [className])

  return (
    <div className={baseClassName} role="list" aria-label="Conversations List">
      {/* section header with optional title */}
      {title && <SectionHeader title={title} />}

      <AnimatePresence initial={false} mode="sync">
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

export default React.memo(ConversationList)

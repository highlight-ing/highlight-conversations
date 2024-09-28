import React from 'react'
import { ConversationData } from '@/data/conversations'
import { ConversationEntry } from './ConversationEntry'
import { useConversations } from '@/contexts/ConversationContext'

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
    <div className="mb-6">
      {title && <h2 className="text-secondary mb-2">{title}</h2>}
      {conversations.map((conversation, index) => (
        <ConversationEntry
          key={conversation.id}
          conversation={conversation}
          isFirst={index === 0}
          isLast={index === conversations.length - 1}
          isMergeActive={isMergeActive}
          isSelected={selectedConversations.some(conv => conv.id === conversation.id)}
        />
      ))}
    </div>
  )
}

export default ConversationList
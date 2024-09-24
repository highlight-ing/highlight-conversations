import React from 'react'
import { ConversationEntry } from './ConversationEntry'
import { SectionHeader } from './SectionHeader'
import { ConversationData } from '@/data/conversations'

interface ConversationListProps {
  title: string
  conversations: ConversationData[]
}

export default function ConversationList({ title, conversations }: ConversationListProps) {
  return (
    <div>
      <SectionHeader title={title} />
      {conversations.map((conversation, index) => (
        <ConversationEntry key={conversation.id} conversation={conversation} isFirst={index === 0} isLast={index === conversations.length - 1} />
      ))}
    </div>
  )
}

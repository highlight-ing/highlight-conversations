import React from 'react'
import { useConversations } from '@/contexts/ConversationContext'
import ConversationPanel from './Panel/ConversationPanel'
import ConversationDetail from './Detail/ConversationDetail'

export const ConversationLayout: React.FC = () => {
  const { selectedConversationId, conversations } = useConversations()
  const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId)

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="h-full w-full flex-shrink-0 border-r border-tertiary sm:w-[38%]">
        <ConversationPanel />
      </div>

      {/* Right Panel */}
      <div className="h-full w-full flex-grow sm:w-[62%]">
        <ConversationDetail conversation={selectedConversation} />
      </div>
    </div>
  )
}

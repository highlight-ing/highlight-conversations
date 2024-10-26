import React, {useEffect} from 'react'
import { useConversations } from '@/contexts/ConversationContext'
import ConversationPanel from './Panel/ConversationPanel'
import ConversationDetail from './Detail/ConversationDetail'
import Highlight from '@highlight-ai/app-runtime'

export const ConversationLayout: React.FC = () => {
  const { selectedConversationId, conversations, handleConversationSelect } = useConversations()
  const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId)

  useEffect(() => {
    if (!Highlight.isRunningInHighlight()) {
      return
    }
    const unsub = Highlight.app.addListener('onExternalMessage', (caller, message) => {
      if (message.type === 'open-conversation-by-id' && caller === 'highlight') {
        handleConversationSelect(message.conversationId)
      }
    })
    return () => {
      unsub()
    }
  }, []);

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

import { useConversations } from '@/contexts/ConversationContext'
import ConversationPanel from './ConversationPanel'
import ConversationDetail from './ConversationDetail'

export const ConversationLayout: React.FC = () => {
  const { selectedConversationId, conversations } = useConversations()

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId)

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 border-r border-tertiary">
        <ConversationPanel />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2">
        <ConversationDetail conversation={selectedConversation} />
      </div>
    </div>
  )
}
import { useState } from 'react'
import ConversationPanel from './ConversationPanel'
import ConversationDetail from './ConversationDetail'

export const ConversationLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)

  return (
    <div className="flex flex-col sm:flex-row h-screen"> {/* Added px-6 for 24px padding */}
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 border-r border-tertiary">
        <ConversationPanel />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2">
        <ConversationDetail />
      </div>
    </div>
  )
}
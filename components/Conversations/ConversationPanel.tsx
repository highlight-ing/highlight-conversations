import React from 'react'
import PanelHeader from './PanelHeader'
import ActiveConversationComponent from './ActiveConversationComponent'

const ConversationPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <PanelHeader />
      <div className="flex-grow overflow-y-auto px-6 py-[39px]">
        <ActiveConversationComponent />
      </div>
    </div>
  )
}

export default ConversationPanel

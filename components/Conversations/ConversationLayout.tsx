import React from 'react';
import { useConversations } from '@/contexts/ConversationContext';
import ConversationPanel from './Panel/ConversationPanel';
import ConversationDetail from './Detail/ConversationDetail';

export const ConversationLayout: React.FC = () => {
  const { selectedConversationId, conversations } = useConversations();
  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-full sm:w-[38%] border-r border-tertiary flex-shrink-0 h-full">
        <ConversationPanel />
      </div>

      {/* Right Panel */}
      <div className="w-full sm:w-[62%] h-full flex-grow">
        <ConversationDetail conversation={selectedConversation} />
      </div>
    </div>
  );
};

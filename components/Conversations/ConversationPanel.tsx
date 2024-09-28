import React from 'react'
import PanelHeader from './PanelHeader'
import ActiveConversationComponent from './ActiveConversationComponent'
import ConversationList from './ConversationList'
import { useConversations } from '@/contexts/ConversationContext'
import { isLast24Hours, isPast7Days, isOlderThan7Days } from '@/utils/dateUtils'
import EnhancedSearchBar from '@/components/Search/EnhancedSearchBar'

const ConversationPanel: React.FC = () => {
  const { conversations } = useConversations()

  const last24HoursConversations = conversations.filter(convo => isLast24Hours(new Date(convo.timestamp)))
  const last24HoursTitle = last24HoursConversations.length > 0 ? 'Last 24 Hours' : undefined

  const past7DaysConversations = conversations.filter(convo => 
    isPast7Days(new Date(convo.timestamp)) && !isLast24Hours(new Date(convo.timestamp))
  )
  const past7DaysTitle = past7DaysConversations.length > 0 ? 'Past 7 Days' : undefined

  const olderConversations = conversations.filter(convo => isOlderThan7Days(new Date(convo.timestamp)))
  const olderTitle = olderConversations.length > 0 ? 'Older' : undefined

  return (
    <div className="flex flex-col h-full">
      <PanelHeader />
      <div className="flex-grow overflow-y-auto px-6 py-[39px]">
        <EnhancedSearchBar />
        <ActiveConversationComponent />
        <ConversationList title={last24HoursTitle} conversations={last24HoursConversations} />
        <ConversationList title={past7DaysTitle} conversations={past7DaysConversations} />
        <ConversationList title={olderTitle} conversations={olderConversations} />
      </div>
    </div>
  )
}

export default ConversationPanel

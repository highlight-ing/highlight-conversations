import React from 'react'
import PanelHeader from './PanelHeader'
import ActiveConversationComponent from './ActiveConversationComponent'
import ConversationList from './ConversationList'
import EnhancedSearchBar from '@/components/Search/EnhancedSearchBar'
import { useConversations } from '@/contexts/ConversationContext'
import { isLast24Hours, isPast7Days, isOlderThan7Days } from '@/utils/dateUtils'
import { Button } from '@/components/ui/button'

const ConversationPanel: React.FC = () => {
  const { 
    filteredConversations, 
    isMergeActive,
    selectedConversations,
    toggleMergeActive,
    mergeSelectedConversations
  } = useConversations()

  const last24HoursConversations = filteredConversations.filter(convo => isLast24Hours(new Date(convo.timestamp)))
  const last24HoursTitle = last24HoursConversations.length > 0 ? 'Last 24 Hours' : undefined

  const past7DaysConversations = filteredConversations.filter(convo => 
    isPast7Days(new Date(convo.timestamp)) && !isLast24Hours(new Date(convo.timestamp))
  )
  const past7DaysTitle = past7DaysConversations.length > 0 ? 'Past 7 Days' : undefined

  const olderConversations = filteredConversations.filter(convo => isOlderThan7Days(new Date(convo.timestamp)))
  const olderTitle = olderConversations.length > 0 ? 'Older' : undefined

  return (
    <div className="flex flex-col h-full relative">
      <PanelHeader onMergeActivate={toggleMergeActive} isMergeActive={isMergeActive} />
      <div className="flex-grow overflow-y-auto px-6 py-[39px]">
        <EnhancedSearchBar />
        <ActiveConversationComponent />
        {isMergeActive && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border border-input shadow-lg rounded-lg p-4 flex items-center justify-between w-[calc(100%-3rem)] max-w-md">
            <p className="text-primary">{selectedConversations.length} conversations selected</p>
            <Button 
              onClick={mergeSelectedConversations} 
              disabled={selectedConversations.length < 2}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Merge
            </Button>
          </div>
        )}
        <ConversationList 
          title={last24HoursTitle} 
          conversations={last24HoursConversations}
        />
        <ConversationList 
          title={past7DaysTitle} 
          conversations={past7DaysConversations}
        />
        <ConversationList 
          title={olderTitle} 
          conversations={olderConversations}
        />
      </div>
    </div>
  )
}

export default ConversationPanel
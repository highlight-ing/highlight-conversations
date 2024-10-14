import React, { useState } from 'react'
import PanelHeader from '../Panel/PanelHeader'
import ActiveConversationComponent from '../Panel/ActiveConversationComponent'
import ConversationList from '../Panel/ConversationList'
import EnhancedSearchBar from '@/components/Search/EnhancedSearchBar'
import FloatingMergeControl from '../Panel/FloatingMergeControl'
import MyTranscriptPanel from './MyTranscriptPanel'
import { useConversations } from '@/contexts/ConversationContext'
import { isLast24Hours, isPast7Days, isOlderThan7Days } from '@/utils/dateUtils'
import { AnimatePresence, motion } from 'framer-motion'
import SettingsPage from '../Settings/SettingsPage';

const ConversationPanel: React.FC = () => { 
  const [isSettingsActive, setIsSettingsActive] = useState(false);

  const { 
    filteredConversations, 
    isMergeActive,
    toggleMergeActive
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
      <PanelHeader 
          onMergeActivate={toggleMergeActive} 
          isMergeActive={isMergeActive}
           setIsSettingsActive={setIsSettingsActive} 
      />
      <MyTranscriptPanel 
          setIsSettingsActive={setIsSettingsActive}
          isSettingsActive={isSettingsActive}
      />

<div className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSettingsActive ? 'settings' : 'conversations'}
            initial="initial"
            animate="in"
            exit="out"
            className="h-full overflow-y-auto px-6 py-[39px]"
          >
            {isSettingsActive ? (
              <SettingsPage />
            ) : (
              <>
                <ActiveConversationComponent />
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
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {isMergeActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <FloatingMergeControl />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConversationPanel
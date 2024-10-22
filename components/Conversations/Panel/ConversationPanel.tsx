import React, { useState, useEffect } from 'react'
import PanelHeader from '../Panel/PanelHeader'
import ActiveConversationComponent from '../Panel/ActiveConversationComponent'
import ConversationList from '../Panel/ConversationList'
import MyTranscriptPanel from './MyTranscriptPanel'
import { useConversations } from '@/contexts/ConversationContext'
import { isLast24Hours, isPast7Days, isOlderThan7Days } from '@/utils/dateUtils'
import { AnimatePresence, motion } from 'framer-motion'
import SettingsPage from '../Settings/SettingsPage'
import FloatingMergeControl from '../Panel/FloatingMergeControl'

// Define the possible states for audioState
type AudioState = 'on' | 'off'

const ConversationPanel: React.FC = () => {
  const [isSettingsActive, setIsSettingsActive] = useState(false)
  const [audioState, setAudioState] = useState<AudioState>('off')

  const { filteredConversations, isMergeActive, toggleMergeActive, isAudioOn } = useConversations()

  const last24HoursConversations = filteredConversations.filter((convo) => isLast24Hours(new Date(convo.timestamp)))
  const last24HoursTitle = last24HoursConversations.length > 0 ? 'Last 24 Hours' : undefined

  const past7DaysConversations = filteredConversations.filter(
    (convo) => isPast7Days(new Date(convo.timestamp)) && !isLast24Hours(new Date(convo.timestamp))
  )
  const past7DaysTitle = past7DaysConversations.length > 0 ? 'Past 7 Days' : undefined

  const olderConversations = filteredConversations.filter((convo) => isOlderThan7Days(new Date(convo.timestamp)))
  const olderTitle = olderConversations.length > 0 ? 'Older' : undefined

  // Example: Simulate turning on/off the microphone (for testing purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAudioState('on') // Set to "on" after 2 seconds
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-hidden">
      <PanelHeader
        onMergeActivate={toggleMergeActive}
        isMergeActive={isMergeActive}
        setIsSettingsActive={setIsSettingsActive}
      />
      <MyTranscriptPanel setIsSettingsActive={setIsSettingsActive} isSettingsActive={isSettingsActive} />

      <div className="w-full flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSettingsActive ? 'settings' : 'conversations'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex h-full w-full flex-col justify-start overflow-y-auto px-6 py-6 align-top"
          >
            {isSettingsActive ? (
              <SettingsPage />
            ) : (
              <>
                <ActiveConversationComponent />
                {<ConversationList title={last24HoursTitle} conversations={last24HoursConversations} />}
                <ConversationList title={past7DaysTitle} conversations={past7DaysConversations} />
                <ConversationList title={olderTitle} conversations={olderConversations} />
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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-0 left-0 right-0 w-full"
          >
            <FloatingMergeControl />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConversationPanel

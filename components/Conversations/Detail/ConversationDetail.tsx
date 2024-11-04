import React, { useState, useEffect } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled'
import NoAudioDetected from './ConversationDetail/NoAudioDetected'
import ActiveConversation from './ConversationDetail/ActiveConversation'
import CompletedConversation from './ConversationDetail/CompletedConversation'

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const { micActivity, isAudioOn, saveCurrentConversation } = useConversations()

  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let transcribeTimer: NodeJS.Timeout | null = null

    if (isAudioOn && micActivity > 0) {
      // Start transcribing when sound is detected
      setIsTranscribing(true)
      // Clear any existing timers
      if (transcribeTimer) clearTimeout(transcribeTimer)
      if (saveTimer) {
        clearTimeout(saveTimer)
        setSaveTimer(null)
      }
    } else if (isAudioOn && micActivity === 0) {
      // Set a timer to stop transcribing after 30 seconds of silence
      transcribeTimer = setTimeout(() => {
        setIsTranscribing(false)
      }, 30000) // 30 seconds

      // Set a timer to save the transcript after 60 seconds of silence
      if (!saveTimer) {
        const newSaveTimer = setTimeout(() => {
          saveCurrentConversation()
          setSaveTimer(null)
        }, 60000) // 60 seconds
        setSaveTimer(newSaveTimer)
      }
    } else {
      // If audio is off, stop transcribing immediately
      setIsTranscribing(false)
      if (saveTimer) {
        clearTimeout(saveTimer)
        setSaveTimer(null)
      }
    }

    // Cleanup the timers on component unmount or when dependencies change
    return () => {
      if (transcribeTimer) clearTimeout(transcribeTimer)
      if (saveTimer) clearTimeout(saveTimer)
    }
  }, [isAudioOn, micActivity, saveTimer, saveCurrentConversation])

  // Completed Conversation when a user clicks on a conversation
  if (conversation) {
    return <CompletedConversation conversation={conversation} />
  }

  // When the audio is off, TranscriptionDisabled
  if (!isAudioOn) {
    return <TranscriptionDisabled />
  }

  // when the audio is off and there's no transcription, show noAudioDetected
  if (isAudioOn && !isTranscribing) {
    return <NoAudioDetected />
  }

  // When the audio is on and there's transcription, show ActiveConversation
  return <ActiveConversation />
}
export default ConversationDetail

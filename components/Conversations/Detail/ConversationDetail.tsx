import React from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled'
import NoAudioDetected from './ConversationDetail/NoAudioDetected'
import ActiveConversation from './ConversationDetail/ActiveConversation'
import CompletedConversation from './ConversationDetail/CompletedConversation'
import { useTranscriptionTimer } from '@/hooks/useTranscriptionTimer'

interface ConversationDetailProps {
  conversation?: ConversationData
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const { micActivity, isAudioOn, saveCurrentConversation, conversations } = useConversations()
  const isTranscribing = useTranscriptionTimer({
    isAudioOn,
    micActivity,
    onSave: saveCurrentConversation,
    transcribeTimeout: 30000, // 30 seconds
    saveTimeout: 60000 // 60 seconds
  })

  if (conversation) {
    return <CompletedConversation conversation={conversation} />
  }
  // If no conversation prop is provided, get the most recent conversation
  const recentConversation = conversation || (conversations && conversations[0])

  if (recentConversation) {
    return <CompletedConversation conversation={recentConversation} />
  }

  // When the audio is off, show TranscriptionDisabled
  if (!isAudioOn) {
    return <TranscriptionDisabled />
  }

    // If there's an active transcription, show ActiveConversation
    if (isTranscribing) {
      return <ActiveConversation />
    }
  

  // When the audio is on and there's no transcription, show NoAudioDetected
  return <NoAudioDetected />
}

export default ConversationDetail

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

  if (!isAudioOn) {
    return <TranscriptionDisabled />
  }

  if (isAudioOn && !isTranscribing) {
    return <NoAudioDetected />
  }

  return <ActiveConversation />
}

export default ConversationDetail

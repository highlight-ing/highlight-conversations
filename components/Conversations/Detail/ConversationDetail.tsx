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

<<<<<<< HEAD
const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const { micActivity, isAudioOn, saveCurrentConversation, conversations } = useConversations()
  const isTranscribing = useTranscriptionTimer({
    isAudioOn,
    micActivity,
    onSave: saveCurrentConversation,
    transcribeTimeout: 30000, // 30 seconds
    saveTimeout: 60000 // 60 seconds
  })
=======
// Timeout Values
const TRANSCRIBE_TIMEOUT = 30000 // 30 seconds
const SAVE_TIMEOUT = 60000 // 60 seconds

const useTranscriptionTimer = (isAudioOn: boolean, micActivity: number, saveCurrentConversation: () => void) => {
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let transcribeTimer: NodeJS.Timeout | null = null
    // Check if sound is detected
    const isSoundDetected = isAudioOn && micActivity > 0
    const isSilent = isAudioOn && micActivity === 0

    if (isSoundDetected) {
      setIsTranscribing(true)
      // Clear any existing timers
      if (transcribeTimer) clearTimeout(transcribeTimer)
      if (saveTimer) {
        clearTimeout(saveTimer)
        setSaveTimer(null)
      }
    } else if (isSilent) {
      // Set a timer to stop transcribing after 30 seconds of silence
      transcribeTimer = setTimeout(() => {
        setIsTranscribing(false)
      }, TRANSCRIBE_TIMEOUT)

      if (!saveTimer) {
        const newSaveTimer = setTimeout(() => {
          saveCurrentConversation()
          setSaveTimer(null)
        }, SAVE_TIMEOUT) // 60 seconds
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
  return isTranscribing
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const { micActivity, isAudioOn, saveCurrentConversation } = useConversations()
  const isTranscribing = useTranscriptionTimer(isAudioOn, micActivity, saveCurrentConversation)
>>>>>>> bbe8f763670c00fd6650a960248cf15068cddefe

  if (conversation) {
    return <CompletedConversation conversation={conversation} />
  }
  // If no conversation prop is provided, get the most recent conversation
  const recentConversation = conversation || (conversations && conversations[0])

<<<<<<< HEAD
  if (recentConversation) {
    return <CompletedConversation conversation={recentConversation} />
  }

  // When the audio is off, show TranscriptionDisabled
=======
>>>>>>> bbe8f763670c00fd6650a960248cf15068cddefe
  if (!isAudioOn) {
    return <TranscriptionDisabled />
  }

<<<<<<< HEAD
    // If there's an active transcription, show ActiveConversation
    if (isTranscribing) {
      return <ActiveConversation />
    }
  

  // When the audio is on and there's no transcription, show NoAudioDetected
  return <NoAudioDetected />
=======
  if (isAudioOn && !isTranscribing) {
    return <NoAudioDetected />
  }

  return <ActiveConversation />
>>>>>>> bbe8f763670c00fd6650a960248cf15068cddefe
}

export default ConversationDetail

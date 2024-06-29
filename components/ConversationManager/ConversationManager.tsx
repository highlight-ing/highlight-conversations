import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchTranscript, fetchMicActivity } from '../../services/highlightService'
import { ConversationData, createConversation } from '../../data/conversations'
import ConversationGrid from '../Card/ConversationGrid'

const POLL_MIC_INTERVAL = 100 // Poll every 100 ms
const POLL_TRANSCRIPT_INTERVAL = 29000 // Poll every 29 seconds
//TODO: - make this setable and probably default to like 30 seconds
const IDLE_THRESHOLD = 150 // 15 seconds (150 * 100ms) of non-activity to consider conversation ended

interface ConversationsManagerProps {
  idleThreshold: number
  minCharacters: number
  conversations: ConversationData[]
  addConversation: (conversations: ConversationData) => void
  onDeleteConversation: (id: string) => void
  onMicActivityChange: (activity: number) => void
}

const ConversationsManager: React.FC<ConversationsManagerProps> = ({
  idleThreshold,
  minCharacters,
  conversations,
  addConversation,
  onMicActivityChange,
  onDeleteConversation,

}) => {
  const [currentConversation, setCurrentConversation] = useState('')
  const [micActivity, setMicActivity] = useState(0)
  const [isWaitingForTranscript, setIsWaitingForTranscript] = useState(false)
  const idleCountRef = useRef(0)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const saveCurrentConversation = useCallback(() => {
    if (currentConversation.trim().length >= minCharacters) {
      const newConversation = createConversation(currentConversation)
      addConversation(newConversation)
      setCurrentConversation('')
    }
  }, [currentConversation, addConversation, minCharacters])

  // Poll Mic Activity to triggle idle threshold and save conversation
  const pollMicActivity = useCallback(async () => {
    const activity = await fetchMicActivity()
    setMicActivity(activity)
    onMicActivityChange(activity)

    if (activity <= 1) {
      idleCountRef.current += 1
    } else {
      idleCountRef.current = 0
    }

    if (idleCountRef.current >= idleThreshold) {
      saveCurrentConversation()
      idleCountRef.current = 0
    }
  }, [onMicActivityChange, saveCurrentConversation, idleThreshold])

  const handleSave = useCallback(() => {
    console.log("onSave called")
    setCurrentConversation(currentConversation)
    saveCurrentConversation()
  }, [saveCurrentConversation, currentConversation])

  // Poll Highlight api for transcripts
  const pollTranscription = useCallback(async () => {
    setIsWaitingForTranscript(false)
    try {
      const transcript = await fetchTranscript()
      if (transcript) {
        setCurrentConversation((prev) => prev.trim() + ' ' + transcript.trim())
      }
    } catch (error) {
      console.error('Error fetching transcript:', error)
    } finally {
      setIsWaitingForTranscript(true)
    }
  }, [])

  // Effect for polling mic activity
  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL)
    return () => clearInterval(intervalId)
  }, [pollMicActivity])

  // Effect for polling transcription
  useEffect(() => {
    const pollTranscriptionWithTimeout = () => {
      pollTranscription()
      pollTimeoutRef.current = setTimeout(pollTranscriptionWithTimeout, POLL_TRANSCRIPT_INTERVAL)
    }

    pollTranscriptionWithTimeout() // Initial poll

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [pollTranscription])

  return (
    <ConversationGrid
      currentConversation={currentConversation}
      conversations={conversations}
      micActivity={micActivity}
      isWaitingForTranscript={isWaitingForTranscript}
      onDeleteConversation={onDeleteConversation}
      onSave={handleSave}
    />
  )
}

export default ConversationsManager

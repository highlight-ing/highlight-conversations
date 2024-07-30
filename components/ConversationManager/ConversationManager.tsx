'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchTranscriptForDuration, fetchMicActivity } from '../../services/highlightService'
import { ConversationData, createConversation } from '../../data/conversations'
import ConversationGrid from '../Card/ConversationGrid'

const POLL_MIC_INTERVAL = 100 // Poll every 100 ms
const POLL_TRANSCRIPT_INTERVAL = 30000 // Poll every 30 seconds
interface ConversationsManagerProps {
  idleThreshold: number
  conversations: ConversationData[]
  isAudioEnabled: boolean
  isSleeping: boolean
  addConversation: (conversations: ConversationData) => void
  onDeleteConversation: (id: string) => void
  onMicActivityChange: (activity: number) => void
  onUpdateConversation: (updatedConversation: ConversationData) => void
}

const ConversationsManager: React.FC<ConversationsManagerProps> = ({
  idleThreshold,
  conversations,
  isAudioEnabled,
  isSleeping,
  addConversation,
  onMicActivityChange,
  onDeleteConversation,
  onUpdateConversation

}) => {
  const [currentConversationParts, setCurrentConversationParts] = useState<string[]>([])
  const [micActivity, setMicActivity] = useState(0)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [nextTranscriptIn, setNextTranscriptIn] = useState(POLL_TRANSCRIPT_INTERVAL / 1000)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())

  // Function to get the current conversation as a string
  const getCurrentConversationString = useCallback((reversed: boolean = true) => {
    return reversed 
      ? currentConversationParts.join(' ') 
      : [...currentConversationParts].reverse().join(' ')
  }, [currentConversationParts])

  const saveCurrentConversation = useCallback((forceSave: boolean = false) => {
    const conversationString = getCurrentConversationString(false) // Get in chronological order
    if (forceSave || conversationString.trim().length >= 1) {
      const newConversation = createConversation(conversationString)
      addConversation(newConversation)
      setCurrentConversationParts([]) // Clear the current conversation
    }
  }, [getCurrentConversationString, addConversation])

  // Check last known mic activity and trigger save if past idle threshold 
  useEffect(() => {
    if (isSleeping) { return }

    const checkIdleTime = () => {
      const currentTime = Date.now()
      const idleTime = currentTime - lastActivityTimeRef.current

      if (idleTime >= idleThreshold * 1000) {
        saveCurrentConversation()
        lastActivityTimeRef.current = currentTime
      }
    }

    const idleCheckInterval = setInterval(checkIdleTime, 1000)

    return () => {
      clearInterval(idleCheckInterval)
    }
  }, [isSleeping, idleThreshold, saveCurrentConversation])

  // Poll Mic Activity and make time stamp of last mic activity
  const pollMicActivity = useCallback(async () => {
    if (isSleeping) return;
    if (!isAudioEnabled) {
      setMicActivity(0)
      return;
    }
    const activity = await fetchMicActivity(300)
    setMicActivity(activity)
    onMicActivityChange(activity)

    if (activity > 1) {
      lastActivityTimeRef.current = Date.now()
    }
  }, [isSleeping, isAudioEnabled, onMicActivityChange])

  const handleSave = useCallback((didTapSaveButton: boolean = false) => {
    setCurrentConversationParts(currentConversationParts)
    saveCurrentConversation(didTapSaveButton)
  }, [saveCurrentConversation, currentConversationParts])

  // Poll Highlight api for transcripts
  const pollTranscription = useCallback(async () => {
    if (isSleeping) return;
    if (!isAudioEnabled) {
      setCurrentConversationParts([])
      return;
    }
    try {
      const transcript = await fetchTranscriptForDuration(30) // Get transcript for last 30 seconds
      if (transcript) {
        console.log('Received transcript:', transcript) // Log the received transcript
        setCurrentConversationParts(prevParts => {
          // Only add the transcript if it's not empty and different from the most recent one
          if (transcript.trim() && (prevParts.length === 0 || transcript.trim() !== prevParts[0])) {
            return [transcript.trim(), ...prevParts]
          }
          return prevParts
        })
        lastActivityTimeRef.current = Date.now() // Reset idle time
      } else {
        console.log('No new transcript received') // Log when no transcript is received
      }
    } catch (error) {
      console.error('Error fetching transcript:', error)
    } finally {
      setNextTranscriptIn(POLL_TRANSCRIPT_INTERVAL / 1000) // Reset countdown
    }
  }, [isSleeping, isAudioEnabled])

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

    // Countdown effect
    useEffect(() => {
      const updateCountdown = () => {
        setNextTranscriptIn((prev) => {
          if (prev <= 0) return POLL_TRANSCRIPT_INTERVAL / 1000
          return prev - 1
        })
      }
  
      countdownIntervalRef.current = setInterval(updateCountdown, 1000)
  
      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }
    }, [])

  return (
    <ConversationGrid
      currentConversation={getCurrentConversationString()} // Pass reversed (latest on top)
      conversations={conversations}
      micActivity={micActivity}
      isAudioEnabled={isAudioEnabled}
      nextTranscriptIn={nextTranscriptIn}
      onDeleteConversation={onDeleteConversation}
      onSave={() => handleSave(true)}
      onUpdate={onUpdateConversation}
    />
  )
}

export default ConversationsManager
'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchTranscript, fetchTranscriptForDuration, fetchMicActivity } from '../../services/highlightService'
import { ConversationData, createConversation } from '../../data/conversations'
import ConversationGrid from '../Card/ConversationGrid'

const POLL_MIC_INTERVAL = 100 // Poll every 100 ms
// const POLL_TRANSCRIPT_INTERVAL = 15000 // Poll every 29 seconds
const INITIAL_POLL_INTERVAL = 5000
const MAX_POLL_INTERVAL = 20000

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
  const [nextTranscriptIn, setNextTranscriptIn] = useState(Math.round(INITIAL_POLL_INTERVAL / 1000))
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())
  const lastTranscriptTimeRef = useRef<number>(Date.now())
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL) // Start with a short interval
  const initialPollIntervalRef = useRef(INITIAL_POLL_INTERVAL)
  const maxPollIntervalRef = useRef(MAX_POLL_INTERVAL)
  const isPollingRef = useRef(false)

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
    if (isSleeping || !isAudioEnabled || isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;
    const currentTime = Date.now();
    const timeSinceLastTranscript = (currentTime - lastTranscriptTimeRef.current) / 1000;
    
    try {
      const transcript = await fetchTranscript()
      if (transcript) {
        console.log(`[${new Date().toISOString()}] Received transcript after ${timeSinceLastTranscript.toFixed(2)} seconds:`, transcript)
        setCurrentConversationParts(prevParts => {
          if (transcript.trim() && (prevParts.length === 0 || transcript.trim() !== prevParts[0])) {
            setPollInterval(prev => Math.min(prev * 1.5, maxPollIntervalRef.current))
            return [transcript.trim(), ...prevParts]
          }
          return prevParts
        })
        lastActivityTimeRef.current = currentTime
        lastTranscriptTimeRef.current = currentTime
      } else {
        console.log(`[${new Date().toISOString()}] No new transcript received. Time since last transcript: ${timeSinceLastTranscript.toFixed(2)} seconds`)
        setPollInterval(prev => Math.max(prev / 1.2, initialPollIntervalRef.current))
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching transcript after ${timeSinceLastTranscript.toFixed(2)} seconds:`, error)
      setPollInterval(prev => Math.max(prev / 1.1, initialPollIntervalRef.current))
    } finally {
      isPollingRef.current = false;
      // Round the pollInterval to the nearest second (1000ms)
      setNextTranscriptIn(Math.round(pollInterval / 1000));
    }
  }, [isSleeping, isAudioEnabled, pollInterval])

  // Effect for polling mic activity
  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL)
    return () => clearInterval(intervalId)
  }, [pollMicActivity])

  // Effect for polling transcription
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const schedulePoll = () => {
      timeoutId = setTimeout(() => {
        pollTranscription().then(schedulePoll);
      }, pollInterval);
    };

    schedulePoll();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pollTranscription, pollInterval]);

    // Countdown effect
    useEffect(() => {
      const updateCountdown = () => {
        setNextTranscriptIn((prev) => {
          if (prev <= 0) return INITIAL_POLL_INTERVAL / 1000
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
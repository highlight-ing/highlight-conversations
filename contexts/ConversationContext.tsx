import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { ConversationData, createConversation } from '@/data/conversations'
import { saveConversationsInAppStorage, deleteAllConversationsInAppStorage, fetchTranscript, fetchMicActivity, fetchLongTranscript } from '@/services/highlightService'
import { useAppSettings } from './AppSettingsContext'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import Highlight from '@highlight-ai/app-runtime'

const POLL_MIC_INTERVAL = 100
const INITIAL_POLL_INTERVAL = 5000
const MAX_POLL_INTERVAL = 20000

interface ConversationContextType {
  conversations: ConversationData[]
  currentConversation: string
  micActivity: number
  addConversation: (conversation: ConversationData) => void
  updateConversation: (updatedConversation: ConversationData) => void
  deleteConversation: (id: string) => void
  deleteAllConversations: () => Promise<void>
  handleSave: (didTapSaveButton?: boolean) => void
  filteredConversations: ConversationData[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [currentConversationParts, setCurrentConversationParts] = useState<string[]>([])
  const [micActivity, setMicActivity] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL)

  const { autoSaveValue, isAudioOn } = useAppSettings()

  // Create a ref to hold the current autoSaveValue
  const autoSaveValueRef = useRef(autoSaveValue)

  // Update the ref whenever autoSaveValue changes
  useEffect(() => {
    autoSaveValueRef.current = autoSaveValue
    console.log(`Auto-save value updated to: ${autoSaveValue} seconds`)
  }, [autoSaveValue])

  // Add ASR event listener
  useEffect(() => {
    // @ts-ignore
    const destroy = Highlight.app.addListener('onAsrTranscriptEvent', (text) => {
      
    })

    return () => {
      destroy()
    }
  })

  const isAudioPermissionEnabled = useAudioPermission()

  const lastActivityTimeRef = useRef(Date.now())
  const lastTranscriptTimeRef = useRef<number>(Date.now())
  const isPollingRef = useRef(false)

  const getCurrentConversationString = useCallback((reversed: boolean = true) => {
    return reversed 
      ? currentConversationParts.join(' ') 
      : [...currentConversationParts].reverse().join(' ')
  }, [currentConversationParts])

  const addConversation = useCallback((newConversation: ConversationData) => {
    setConversations(prev => {
      const updated = [newConversation, ...prev]
      saveConversationsInAppStorage(updated)
      return updated
    })
  }, [])

  const updateConversation = useCallback((updatedConversation: ConversationData) => {
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
      saveConversationsInAppStorage(updated)
      return updated
    })
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const updated = prev.filter(conv => conv.id !== id)
      saveConversationsInAppStorage(updated)
      return updated
    })
  }, [])

  const deleteAllConversations = useCallback(async () => {
    await deleteAllConversationsInAppStorage()
    setConversations([])
  }, [])

  const saveCurrentConversation = useCallback((forceSave: boolean = false) => {
    const conversationString = getCurrentConversationString(false)
    console.log('Current conversation string:', conversationString)
    if (forceSave || conversationString.trim().length >= 1) {
      const newConversation = createConversation(conversationString)
      addConversation(newConversation)
      console.log('Saving conversation:', newConversation)
      setCurrentConversationParts([])
      console.log('Cleared currentConversationParts')
    } else {
      console.log('No conversation to save')
    }
  }, [getCurrentConversationString, addConversation])

  const handleSave = useCallback((didTapSaveButton: boolean = false) => {
    setCurrentConversationParts(currentConversationParts)
    saveCurrentConversation(didTapSaveButton)
  }, [saveCurrentConversation, currentConversationParts])

  const pollMicActivity = useCallback(async () => {
    if (!isAudioOn || !isAudioPermissionEnabled) {
      setMicActivity(0)
      return
    }
    const activity = await fetchMicActivity(300)
    setMicActivity(activity)
  }, [isAudioOn, isAudioPermissionEnabled])

  const pollTranscription = useCallback(async () => {
    if (!isAudioOn || isPollingRef.current) {
      return
    }

    isPollingRef.current = true
    
    try {
      const transcript = await fetchTranscript()
      const currentTime = Date.now()
      const timeSinceLastTranscript = currentTime - lastTranscriptTimeRef.current
      console.log(`Time since last transcript: ${timeSinceLastTranscript / 1000} seconds`)
      console.log(`Auto-save threshold: ${autoSaveValueRef.current} seconds`)
      console.log('Current conversation parts:', currentConversationParts)

      if (timeSinceLastTranscript >= autoSaveValueRef.current * 1000) {
        console.log('Auto-save triggered')
        saveCurrentConversation()
        lastTranscriptTimeRef.current = currentTime // Reset the timer after auto-save
      } else {
        console.log('Auto-save not triggered')
      }

      if (transcript) {
        const [timestampStr, ...contentParts] = transcript.split(' - ')
        const content = contentParts.join(' - ').trim()

        // Convert timestamp to Date object
        const transcriptTime = new Date(`${new Date().toDateString()} ${timestampStr}`)
        console.log(`Transcript timestamp: ${transcriptTime.toISOString()}`)

        setCurrentConversationParts(prevParts => {
          if (content && (prevParts.length === 0 || content !== prevParts[0])) {
            setPollInterval(prev => Math.min(prev * 1.5, MAX_POLL_INTERVAL))
            console.log(`New content added: "${content.substring(0, 50)}..."`)
            console.log('Previous parts:', prevParts)
            const newParts = [content, ...prevParts.filter(part => part !== content)]
            console.log('New parts:', newParts)
            return newParts;
          }
          return prevParts
        })

        // Update lastTranscriptTimeRef with the new transcript time
        lastTranscriptTimeRef.current = transcriptTime.getTime()
        console.log(`Updated lastTranscriptTimeRef: ${new Date(lastTranscriptTimeRef.current).toISOString()}`)
      } else {
        console.log('No new transcript received')
        setPollInterval(prev => Math.max(prev / 1.2, INITIAL_POLL_INTERVAL))
      }
    } catch (error) {
      console.error(`Error fetching transcript:`, error)
      setPollInterval(prev => Math.max(prev / 1.1, INITIAL_POLL_INTERVAL))
    } finally {
      isPollingRef.current = false
    }
  }, [isAudioOn, saveCurrentConversation, currentConversationParts])

  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL)
    return () => clearInterval(intervalId)
  }, [pollMicActivity])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const schedulePoll = () => {
      timeoutId = setTimeout(() => {
        console.log(`Polling for transcription (interval: ${pollInterval}ms)`)
        pollTranscription().then(schedulePoll)
      }, pollInterval)
    }

    schedulePoll()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [pollTranscription, pollInterval])

  useEffect(() => {
    const fetchInitialTranscript = async () => {
      try {
        const longTranscript = await fetchLongTranscript()
        if (longTranscript) {
          setCurrentConversationParts(prevParts => {
            const trimmedTranscript = longTranscript.trim()
            if (prevParts.length === 0 || trimmedTranscript !== prevParts[0]) {
              return [trimmedTranscript, ...prevParts.filter(part => part !== trimmedTranscript)]
            }
            return prevParts
          })
        }
      } catch (error) {
        console.error('Error fetching initial long transcript:', error)
      }
    }
  
    fetchInitialTranscript()
  }, [])

  const filteredConversations = conversations.filter(conversation => {
    const matchTranscript = conversation.transcript.toLowerCase().includes(searchQuery.toLowerCase())
    const matchSummary = conversation.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchTranscript || matchSummary
  })

  useEffect(() => {
    console.log('currentConversationParts updated:', currentConversationParts)
  }, [currentConversationParts])

  return (
    <ConversationContext.Provider value={{
      conversations,
      currentConversation: getCurrentConversationString(),
      micActivity,
      addConversation,
      updateConversation,
      deleteConversation,
      deleteAllConversations,
      handleSave,
      filteredConversations,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </ConversationContext.Provider>
  )
}

export const useConversations = () => {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider')
  }
  return context
}
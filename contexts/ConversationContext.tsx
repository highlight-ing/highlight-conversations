import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { ConversationData, createConversation } from '@/data/conversations'
import { saveConversationsInAppStorage, deleteAllConversationsInAppStorage, fetchTranscript, fetchMicActivity, fetchLongTranscript } from '@/services/highlightService'
import { useAppSettings } from './AppSettingsContext'
import { useAudioPermission } from '@/hooks/useAudioPermission'

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
    if (forceSave || conversationString.trim().length >= 1) {
      const newConversation = createConversation(conversationString)
      addConversation(newConversation)
      setCurrentConversationParts([])
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

    if (activity >= 1) {
      lastActivityTimeRef.current = Date.now()
    }
  }, [isAudioOn, isAudioPermissionEnabled])

  const pollTranscription = useCallback(async () => {
    if (!isAudioOn || isPollingRef.current) {
      return
    }

    isPollingRef.current = true
    const currentTime = Date.now()
    
    try {
      const transcript = await fetchTranscript()
      if (transcript) {
        setCurrentConversationParts(prevParts => {
          const trimmedTranscript = transcript.trim()
          if (trimmedTranscript && (prevParts.length === 0 || trimmedTranscript !== prevParts[0])) {
            setPollInterval(prev => Math.min(prev * 1.5, MAX_POLL_INTERVAL))
            return [trimmedTranscript, ...prevParts.filter(part => part !== trimmedTranscript)]
          }
          return prevParts
        })
        lastActivityTimeRef.current = currentTime
        lastTranscriptTimeRef.current = currentTime
      } else {
        setPollInterval(prev => Math.max(prev / 1.2, INITIAL_POLL_INTERVAL))
      }
    } catch (error) {
      console.error(`Error fetching transcript:`, error)
      setPollInterval(prev => Math.max(prev / 1.1, INITIAL_POLL_INTERVAL))
    } finally {
      isPollingRef.current = false
    }
  }, [isAudioOn])

  useEffect(() => {
    const checkIdleTime = () => {
      const currentTime = Date.now()
      const idleTime = currentTime - lastActivityTimeRef.current
      if (idleTime >= autoSaveValue * 1000) {
        saveCurrentConversation()
        lastActivityTimeRef.current = currentTime
      }
    }

    const idleCheckInterval = setInterval(checkIdleTime, 1000)
    return () => clearInterval(idleCheckInterval)
  }, [autoSaveValue, saveCurrentConversation])

  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL)
    return () => clearInterval(intervalId)
  }, [pollMicActivity])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const schedulePoll = () => {
      timeoutId = setTimeout(() => {
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
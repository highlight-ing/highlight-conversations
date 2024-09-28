import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import Highlight from '@highlight-ai/app-runtime'
import { ConversationData } from '@/data/conversations'
import { getConversationsFromAppStorage } from '@/services/highlightService'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import { useAmplitude } from '@/hooks/useAmplitude'

const POLL_MIC_ACTIVITY = 300
const HOUR_IN_MS = 60 * 60 * 1000
const DAY_IN_MS = 24 * 60 * 60 * 1000

const AUTO_SAVE_TIME_DEFAULT = 60 * 2
const AUTO_CLEAR_DAYS_DEFAULT = 7

const MIN_AUTO_SAVE_TIME = 60
const DEFAULT_AUTO_SAVE_TIME = 120

interface ConversationContextType {
  conversations: ConversationData[]
  selectedConversations: ConversationData[]
  filteredConversations: ConversationData[]
  currentConversation: string
  elapsedTime: number
  autoSaveTime: number
  autoClearDays: number
  micActivity: number
  isAudioOn: boolean
  searchQuery: string
  isMergeActive: boolean
  saveCurrentConversation: () => Promise<void>
  addConversation: (conversation: ConversationData) => Promise<void>
  updateConversation: (conversation: ConversationData) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  deleteAllConversations: () => Promise<void>
  setAutoSaveTime: (time: number) => Promise<void>
  setAutoClearDays: (days: number) => Promise<void>
  setIsAudioOn: (isOn: boolean) => Promise<void>
  setSearchQuery: (query: string) => void
  isSaving: boolean
  getWordCount: (transcript: string) => number
  updateConversations: (conversations: ConversationData[]) => Promise<void>
  toggleMergeActive: () => void
  handleConversationSelect: (id: string) => void
  mergeSelectedConversations: () => Promise<void>
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [selectedConversations, setSelectedConversations] = useState<ConversationData[]>([])
  const [currentConversation, setCurrentConversation] = useState<string>('')
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [autoSaveTime, setAutoSaveTime] = useState<number>(AUTO_SAVE_TIME_DEFAULT)
  const [autoClearDays, setAutoClearDays] = useState<number>(AUTO_CLEAR_DAYS_DEFAULT)
  const [micActivity, setMicActivity] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMergeActive, setIsMergeActive] = useState(false)

  // Use the useAudioPermission hook
  const { isAudioPermissionEnabled: isAudioOn, toggleAudioPermission } = useAudioPermission()

  const { trackEvent } = useAmplitude()

  const setupListeners = useCallback(() => {
    const removeCurrentConversationListener = Highlight.app.addListener(
      'onCurrentConversationUpdate',
      (conversation: string) => {
        if (isAudioOn) {
          console.log('New current conversation:', conversation)
          setCurrentConversation(conversation)
        }
      }
    )

    const removeConversationsUpdatedListener = Highlight.app.addListener(
      'onConversationsUpdated',
      (updatedConversations: ConversationData[]) => {
        if (isAudioOn) {
          console.log('Updated conversations:', updatedConversations)
          const processedConversations = updatedConversations.map((conv) => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
            startedAt: new Date(conv.startedAt),
            endedAt: new Date(conv.endedAt)
          }))
          setConversations(processedConversations)
          trackEvent('conversations_updated', { conversationsCount: processedConversations.length })
        }
      }
    )

    const removeElapsedTimeUpdatedListener = Highlight.app.addListener(
      'onConversationsElapsedTimeUpdated',
      (time: number) => {
        if (isAudioOn) {
          setElapsedTime(time)
        }
      }
    )

    const removeAutoSaveUpdatedListener = Highlight.app.addListener(
      'onConversationsAutoSaveUpdated',
      (time: number) => {
        console.log('Updated auto-save time:', time)
        const validTime = time < MIN_AUTO_SAVE_TIME ? DEFAULT_AUTO_SAVE_TIME : time
        setAutoSaveTime(validTime)
        // Removed the backend sync to avoid potential infinite loop
      }
    )

    const removeAutoClearUpdatedListener = Highlight.app.addListener(
      'onConversationsAutoClearUpdated',
      (days: number) => {
        console.log('Updated auto-clear days:', days)
        setAutoClearDays(days)
      }
    )

    const removeSaveConversationListener = Highlight.app.addListener('onConversationSaved', () => {
      console.log('Saving current conversation')
    })

    const removeConversationSavedListener = Highlight.app.addListener('onConversationSaved', () => {
      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
        setCurrentConversation('')
        setElapsedTime(0)
      }, 10)
    })

    return () => {
      removeCurrentConversationListener()
      removeConversationsUpdatedListener()
      removeElapsedTimeUpdatedListener()
      removeAutoSaveUpdatedListener()
      removeAutoClearUpdatedListener()
      removeSaveConversationListener()
      removeConversationSavedListener()
    }
  }, [isAudioOn, trackEvent])

  useEffect(() => {
    const removeListeners = setupListeners()
    return () => removeListeners()
  }, [setupListeners])

  const fetchConversations = async () => {
    try {
      const [allConversations, appStorageConversations] = await Promise.all([
        Highlight.conversations.getAllConversations(),
        getConversationsFromAppStorage()
      ])
      return { allConversations, appStorageConversations }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return { allConversations: [], appStorageConversations: [] }
    }
  }

  const mergeConversations = (allConversations: ConversationData[], appStorageConversations: ConversationData[]) => {
    const mergedConversations = [...allConversations, ...appStorageConversations].reduce((acc, conv) => {
      if (!acc.some((existingConv) => existingConv.id === conv.id) && conv.transcript.trim() !== '') {
        acc.push({
          ...conv,
          startedAt: conv.startedAt || conv.timestamp,
          endedAt: conv.endedAt || new Date(),
          timestamp: new Date(conv.timestamp)
        })
      }
      return acc
    }, [] as ConversationData[])
    return mergedConversations
  }

  const updateConversationsData = async (mergedConversations: ConversationData[]) => {
    try {
      const filteredConversations = mergedConversations.filter(conv => conv.transcript.trim() !== '')
      await Highlight.conversations.updateConversations(filteredConversations)
    } catch (error) {
      console.error('Error updating conversations:', error)
    }
  }

  const fetchAdditionalData = async () => {
    try {
      const currentConv = await Highlight.conversations.getCurrentConversation()
      const elapsedTime = await Highlight.conversations.getElapsedTime()
      return { currentConv, elapsedTime }
    } catch (error) {
      console.error('Error fetching additional data:', error)
      return { currentConv: '', elapsedTime: 0 }
    }
  }

  const fetchLatestData = useCallback(async () => {
    console.log('Fetching latest data...')

    const { allConversations, appStorageConversations } = await fetchConversations()
    console.log('All conversations from API:', allConversations)
    console.log('All conversations from AppStorage:', appStorageConversations)

    const mergedConversations = mergeConversations(allConversations, appStorageConversations)
    console.log('Merged conversations:', mergedConversations)

    await updateConversationsData(mergedConversations)
    setConversations(mergedConversations)

    const { currentConv, elapsedTime } = await fetchAdditionalData()
    console.log('Current conversation:', currentConv)
    setCurrentConversation(currentConv)

    console.log('Elapsed time:', elapsedTime)
    setElapsedTime(elapsedTime)

    console.log('Finished fetching latest data')
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log('Fetching initial data...')
      await fetchLatestData()

      const autoSaveTime = await Highlight.conversations.getAutoSaveTime()
      console.log('Auto-save time:', autoSaveTime)
      const validAutoSaveTime = autoSaveTime < MIN_AUTO_SAVE_TIME ? DEFAULT_AUTO_SAVE_TIME : autoSaveTime
      setAutoSaveTime(validAutoSaveTime)
      // Sync the valid time back to the backend if it was adjusted
      if (validAutoSaveTime !== autoSaveTime) {
        await Highlight.conversations.setAutoSaveTime(validAutoSaveTime)
      }

      const autoClearDaysFromAPI = await Highlight.conversations.getAutoClearDays()
      console.log('Auto-clear days:', autoClearDaysFromAPI)
      const validAutoClearDays = autoClearDaysFromAPI !== 0 ? autoClearDaysFromAPI : AUTO_CLEAR_DAYS_DEFAULT
      setAutoClearDays(validAutoClearDays)

      // Fetch conversations again after setting autoClearDays
      const { allConversations, appStorageConversations } = await fetchConversations()
      const mergedConversations = mergeConversations(allConversations, appStorageConversations)

      const now = new Date()
      const cutoffDate = new Date(now.getTime() - validAutoClearDays * DAY_IN_MS)

      const updatedConversations = mergedConversations.filter(conversation => {
        return conversation.timestamp >= cutoffDate
      })

      if (updatedConversations.length !== mergedConversations.length) {
        setConversations(updatedConversations)
        await Highlight.conversations.updateConversations(updatedConversations)
      } else {
        setConversations(mergedConversations)
      }

      console.log('Finished fetching initial data')
    }
    fetchInitialData()
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pollMicActivity = useCallback(async () => {
    if (!isAudioOn) {
      setMicActivity(0)
      return
    }
    const activity = await Highlight.user.getMicActivity(POLL_MIC_ACTIVITY)
    setMicActivity(activity)
  }, [isAudioOn])

  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_ACTIVITY)
    return () => clearInterval(intervalId)
  }, [pollMicActivity])

  const setIsAudioOnAndSave = useCallback(
    async (isOn: boolean) => {
      await toggleAudioPermission(isOn)

      if (isOn) {
        await fetchLatestData()
      } else {
        setCurrentConversation('')
        setElapsedTime(0)
      }
    },
    [fetchLatestData, toggleAudioPermission]
  )

  const getWordCount = useCallback((transcript: string): number => {
    return transcript.trim().split(/\s+/).length
  }, [])

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations

    const lowerQuery = searchQuery.toLowerCase()
    return conversations.filter((conversation) => {
      const matchTranscript = conversation.transcript.toLowerCase().includes(lowerQuery)
      const matchSummary = conversation.summary.toLowerCase().includes(lowerQuery)
      return matchTranscript || matchSummary
    })
  }, [conversations, searchQuery])

  const toggleMergeActive = useCallback(() => {
    setIsMergeActive(prev => !prev)
    setSelectedConversations([])
  }, [])

  const handleConversationSelect = useCallback((id: string) => {
    const conversation = conversations.find(conv => conv.id === id)
    if (conversation) {
      setSelectedConversations(prev => 
        prev.includes(conversation) ? prev.filter(conv => conv.id !== conversation.id) : [...prev, conversation]
      )
    }
  }, [conversations])

  const mergeSelectedConversations = useCallback(async () => {
    if (selectedConversations.length >= 2) {
      // We need merge conversations in two different ways:

      // 1. If the conversation is not summarized, create a new ConversationData, determine the date of each selected conversation, starting with the oldest, append that to the new .transcript field, and repeat in chronological order for each selected conversation. For .timestamp, make a new Date object with now's date. For .startedAt field, use the .startedAt field from the oldest selected conversation. For .endedAt, use the .endedAt field from the newest selected conversation.
      // 2. If the conversation is summarized, create a new ConversationData, determine the date of each selected conversation, starting with the oldest, append that to the new .transcript field, and repeat in chronological order for each selected conversation. For .timestamp, make a new Date object with now's date. For .startedAt field, use the .startedAt field from the oldest selected conversation. For .endedAt, use the .endedAt field from the newest selected conversation. We will also need to resummarize the merged conversation -- we'll use from highlightService "getTextPredictionFromHighlight (async)" function, we must await this or error if the call fails -- if the call succeeds, we will set the new .summary field. If it fails, we'll keep summary blank for now.
      
      
    
    }
  }, [selectedConversations])

  const contextValue: ConversationContextType = {
    conversations,
    selectedConversations,
    filteredConversations,
    currentConversation,
    elapsedTime,
    autoSaveTime,
    autoClearDays,
    micActivity,
    isAudioOn,
    searchQuery,
    isMergeActive,
    saveCurrentConversation: async () => {
      const savedConversation = await Highlight.conversations.saveCurrentConversation()
      trackEvent('conversation_added', { })
    },
    addConversation: async (conversation: ConversationData) => {
      await Highlight.conversations.addConversation(conversation)
      trackEvent('conversation_added', { conversationId: conversation.id })
    },
    updateConversation: Highlight.conversations.updateConversation,
    deleteConversation: async (id: string) => {
      await Highlight.conversations.deleteConversation(id)
      trackEvent('conversation_deleted', { conversationId: id })
    },
    deleteAllConversations: async () => {
      await Highlight.conversations.deleteAllConversations()
      trackEvent('delete_all_conversations', { })
    },
    setAutoSaveTime: async (time: number) => {
      const validTime = time !== 0 ? time : AUTO_SAVE_TIME_DEFAULT
      await Highlight.conversations.setAutoSaveTime(validTime)
      setAutoSaveTime(validTime)
      trackEvent('changed_auto_save_value', { newValue: validTime })
    },
    setAutoClearDays: async (days: number) => {
      const validDays = days !== 0 ? days : AUTO_CLEAR_DAYS_DEFAULT
      await Highlight.conversations.setAutoClearDays(validDays)
      setAutoClearDays(validDays)
      trackEvent('changed_auto_clear_value', { newValue: validDays })
    },
    setIsAudioOn: setIsAudioOnAndSave,
    setSearchQuery,
    isSaving,
    getWordCount,
    updateConversations: async (conversations: ConversationData[]) => {
      const filteredConversations = conversations.filter(conv => conv.transcript.trim() !== '')
      await Highlight.conversations.updateConversations(filteredConversations)
      setConversations(filteredConversations)
    },
    toggleMergeActive,
    handleConversationSelect,
    mergeSelectedConversations
  }

  const autoClearConversations = useCallback(async () => {
    const now = new Date()
    const cutoffDate = new Date(now.getTime() - autoClearDays * DAY_IN_MS)

    const updatedConversations = conversations.filter((conversation) => {
      return conversation.timestamp >= cutoffDate
    })

    if (updatedConversations.length !== conversations.length) {
      setConversations(updatedConversations)
      await Highlight.conversations.updateConversations(updatedConversations)
    }
  }, [conversations, autoClearDays])

  return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>
}

export const useConversations = () => {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider')
  }
  return context
}

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import Highlight from '@highlight-ai/app-runtime'
import { ConversationData, createConversation, formatTranscript } from '@/data/conversations'
import {
  getConversationsFromAppStorage,
  summarizeConversation,
  ProcessedConversationData
} from '@/services/highlightService'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import { useAmplitude } from '@/hooks/useAmplitude'

const POLL_MIC_ACTIVITY = 500
const HOUR_IN_MS = 60 * 60 * 1000
const DAY_IN_MS = 24 * 60 * 60 * 1000

const AUTO_SAVE_TIME_DEFAULT = 60 * 10
const AUTO_CLEAR_DAYS_DEFAULT = -1
const ASR_DURATION_HOURS_DEFAULT = 8

const MIN_AUTO_SAVE_TIME = 60
const DEFAULT_AUTO_SAVE_TIME = 600

interface ConversationContextType {
  conversations: ConversationData[]
  selectedConversations: ConversationData[]
  filteredConversations: ConversationData[]
  currentConversation: string
  elapsedTime: number
  autoSaveTime: number
  autoClearDays: number
  asrDuration: number
  asrCloudFallback: boolean
  micActivity: number
  noAudio: boolean
  isAudioOn: boolean
  searchQuery: string
  isMergeActive: boolean
  saveCurrentConversation: () => Promise<ConversationData>
  addConversation: (conversation: ConversationData) => Promise<void>
  updateConversation: (conversation: ConversationData) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  deleteAllConversations: () => Promise<void>
  setAutoSaveTime: (time: number) => Promise<void>
  setAutoClearDays: (days: number) => Promise<void>
  setAsrDuration: (hours: number) => Promise<void>
  setAsrCloudFallback: (enabled: boolean) => Promise<void>
  setIsAudioOn: (isOn: boolean) => Promise<void>
  setSearchQuery: (query: string) => void
  isSaving: boolean
  getWordCount: (transcript: string) => number
  updateConversations: (conversations: ConversationData[]) => Promise<void>
  toggleMergeActive: () => void
  handleConversationSelect: (id: string) => void
  mergeSelectedConversations: () => Promise<void>
  selectedConversationId: string | null
  setSelectedConversationId: (id: string | null) => void
  handleCurrentConversationSelect: () => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [selectedConversations, setSelectedConversations] = useState<ConversationData[]>([])
  const [currentConversation, setCurrentConversation] = useState<string>('')
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [autoSaveTime, setAutoSaveTime] = useState<number>(AUTO_SAVE_TIME_DEFAULT)
  const [autoClearDays, setAutoClearDays] = useState<number>(AUTO_CLEAR_DAYS_DEFAULT)
  const [asrDuration, setAsrDuration] = useState<number>(ASR_DURATION_HOURS_DEFAULT)
  const [asrCloudFallback, setAsrCloudFallback] = useState<boolean>(false)
  const [micActivity, setMicActivity] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMergeActive, setIsMergeActive] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [noAudio, setNoAudio] = useState(true)

  // Use the useAudioPermission hook
  const { isAudioPermissionEnabled: isAudioOn, toggleAudioPermission } = useAudioPermission()

  const { trackEvent } = useAmplitude()

  const setupListeners = useCallback(() => {
    const removeCurrentConversationListener = Highlight.app.addListener(
      'onCurrentConversationUpdate',
      (conversation: string) => {
        if (isAudioOn) {
          setCurrentConversation(conversation)
        }
      }
    )

    const removeConversationsUpdatedListener = Highlight.app.addListener(
      'onConversationsUpdated',
      (updatedConversations: ConversationData[]) => {
        if (isAudioOn) {
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
        const validTime = time < MIN_AUTO_SAVE_TIME ? DEFAULT_AUTO_SAVE_TIME : time
        setAutoSaveTime(validTime)
        // Removed the backend sync to avoid potential infinite loop
      }
    )

    const removeAutoClearUpdatedListener = Highlight.app.addListener(
      'onConversationsAutoClearUpdated',
      (days: number) => {
        setAutoClearDays(days)
      }
    )

    const removeExternalMessageListener = Highlight.app.addListener(
      'onExternalMessage',
      async (caller: string, message: any) => {
        if (caller === 'highlight' && message?.type === 'open-conversation-by-id') {
          setSelectedConversationId(message?.conversationId)
        }
      }
    )

    const removeSaveConversationListener = Highlight.app.addListener('onConversationSaved', () => { })

    const removeConversationSavedListener = Highlight.app.addListener('onConversationSaved', () => {
      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
        setCurrentConversation('')
        setElapsedTime(0)
      }, 10)
    })

    const removeOnAsrDurationListener = Highlight.app.addListener?.('onAsrDurationUpdated', (duration: number) => {
      setAsrDuration(duration)
    }) ?? (() => { })

    const removeOnAsrCloudFallbackListener = Highlight.app.addListener?.('onAsrCloudFallbackUpdated',
      (enabled: boolean) => {
        setAsrCloudFallback(enabled)
      }
    ) ?? (() => { })

    return () => {
      removeCurrentConversationListener()
      removeConversationsUpdatedListener()
      removeElapsedTimeUpdatedListener()
      removeAutoSaveUpdatedListener()
      removeAutoClearUpdatedListener()
      removeSaveConversationListener()
      removeConversationSavedListener()
      removeExternalMessageListener()
      removeOnAsrDurationListener()
      removeOnAsrCloudFallbackListener()
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

  const migrateAppStorageConversations = (
    allConversations: ConversationData[],
    appStorageConversations: ConversationData[]
  ) => {
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
      const filteredConversations = mergedConversations.filter((conv) => conv.transcript.trim() !== '')
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
    const { allConversations, appStorageConversations } = await fetchConversations()

    const migratedConversations = migrateAppStorageConversations(allConversations, appStorageConversations)
    console.log('Migrated conversations:', migratedConversations.length)

    await updateConversationsData(migratedConversations)
    setConversations(migratedConversations)

    const { currentConv, elapsedTime } = await fetchAdditionalData()
    setCurrentConversation(currentConv)

    setElapsedTime(elapsedTime)
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchLatestData()

      const autoSaveTime = await Highlight.conversations.getAutoSaveTime()
      const validAutoSaveTime = autoSaveTime < MIN_AUTO_SAVE_TIME ? DEFAULT_AUTO_SAVE_TIME : autoSaveTime
      setAutoSaveTime(validAutoSaveTime)
      // Sync the valid time back to the backend if it was adjusted
      if (validAutoSaveTime !== autoSaveTime) {
        await Highlight.conversations.setAutoSaveTime(validAutoSaveTime)
      }

      const autoClearDaysFromAPI = await Highlight.conversations.getAutoClearDays()
      const validAutoClearDays = autoClearDaysFromAPI ?? AUTO_CLEAR_DAYS_DEFAULT
      setAutoClearDays(validAutoClearDays)

      try {
        const duration = await Highlight.conversations.getAsrDuration?.() ?? ASR_DURATION_HOURS_DEFAULT
        setAsrDuration(duration)
      } catch (error) {
        console.warn('ASR Duration API not available, using default:', ASR_DURATION_HOURS_DEFAULT)
        setAsrDuration(ASR_DURATION_HOURS_DEFAULT)
      }

      try {
        const cloudFallback = await Highlight.conversations.getAsrCloudFallback?.() ?? false
        setAsrCloudFallback(cloudFallback)
      } catch (error) {
        console.warn('ASR Cloud Fallback API not available, using default: false')
        setAsrCloudFallback(false)
      }

      // Fetch conversations again after setting autoClearDays
      const { allConversations, appStorageConversations } = await fetchConversations()
      const mergedConversations = migrateAppStorageConversations(allConversations, appStorageConversations)

      let updatedConversations = mergedConversations

      // If auto-clear days is set, filter out conversations older than the cutoff date
      if (validAutoClearDays > 0) {
        const now = new Date()
        const cutoffDate = new Date(now.getTime() - validAutoClearDays * DAY_IN_MS)

        updatedConversations = mergedConversations.filter((conversation) => {
          return conversation.timestamp >= cutoffDate
        })
      }

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
    if (activity !== micActivity) {
      setMicActivity(activity)
    }
  }, [isAudioOn])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if ((micActivity || 0) < 1) {
      timer = setTimeout(() => {
        setNoAudio(true)
      }, 1000)
    } else {
      setNoAudio(false)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [micActivity])

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
    setIsMergeActive((prev) => !prev)
    setSelectedConversations([])
  }, [])

  const handleConversationSelect = useCallback(
    (id: string) => {
      if (isMergeActive) {
        const conversation = conversations.find((conv) => conv.id === id)
        if (conversation) {
          setSelectedConversations((prev) =>
            prev.includes(conversation) ? prev.filter((conv) => conv.id !== conversation.id) : [...prev, conversation]
          )
        }
      } else {
        setSelectedConversationId((prev) => (prev === id ? null : id))
      }
    },
    [conversations, isMergeActive]
  )

  const handleCurrentConversationSelect = useCallback(() => {
    setSelectedConversationId(null)
  }, [])

  const addConversation = useCallback(
    async (conversation: ConversationData) => {
      await Highlight.conversations.addConversation(conversation)
      trackEvent('conversation_added', { conversationId: conversation.id })
    },
    [trackEvent]
  )

  const deleteConversation = useCallback(
    async (id: string) => {
      await Highlight.conversations.deleteConversation(id)
      trackEvent('conversation_deleted', { conversationId: id })
    },
    [trackEvent]
  )

  const mergeSelectedConversations = useCallback(async () => {
    if (selectedConversations.length >= 2) {
      const sortedConversations = selectedConversations.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
      const oldestConversation = sortedConversations[0]
      const newestConversation = sortedConversations[sortedConversations.length - 1]

      const mergedTranscript = sortedConversations.map((conv) => `${conv.transcript}`).join('\n\n')

      const formattedTranscript = formatTranscript(mergedTranscript, 'DialogueTranscript')

      let summarizedData: ProcessedConversationData | null = null
      if (sortedConversations.some((conv) => conv.summarized)) {
        try {
          summarizedData = await summarizeConversation(formattedTranscript)
        } catch (error) {
          console.error('Failed to generate summary for merged conversation:', error)
        }
      }

      const newConversation = createConversation({
        title: summarizedData?.title,
        transcript: formattedTranscript,
        summary: summarizedData?.summary || '',
        topic: summarizedData?.topics?.join(', ') || sortedConversations.map((conv) => conv.topic).join(', '),
        startedAt: oldestConversation.startedAt,
        endedAt: newestConversation.endedAt,
        timestamp: new Date(),
        userId: oldestConversation.userId // Assuming all conversations have the same userId
      })
      console.log('New merged conversation:', newConversation)

      // Add the new merged conversation
      await addConversation(newConversation)

      // Delete the original conversations
      for (const conv of selectedConversations) {
        await deleteConversation(conv.id)
      }

      // Clear selected conversations and update the conversations list and set merge active to false
      setIsMergeActive(false)
      setSelectedConversations([])

      // Track the merge event
      trackEvent('conversations_merged', { count: selectedConversations.length })
    }
  }, [selectedConversations, addConversation, deleteConversation, fetchLatestData, trackEvent])

  const updateConversation = useCallback(async (updatedConversation: ConversationData) => {
    // Update the local state
    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
    )

    try {
      await Highlight.conversations.updateConversation(updatedConversation)
      console.log('Conversation updated successfully:', updatedConversation.id)
    } catch (error) {
      console.error('Error updating conversation:', error)
    }
  }, [])

  const contextValue: ConversationContextType = {
    conversations,
    selectedConversations,
    filteredConversations,
    currentConversation,
    elapsedTime,
    autoSaveTime,
    autoClearDays,
    asrDuration,
    asrCloudFallback,
    micActivity,
    noAudio,
    isAudioOn,
    searchQuery,
    isMergeActive,
    saveCurrentConversation: async (): Promise<ConversationData> => {
      try {
        await Highlight.conversations.saveCurrentConversation()

        // Fetch updated conversations
        const updatedConversations = await Highlight.conversations.getAllConversations()

        // Find the conversation with the most recent timestamp
        const savedConversation = updatedConversations.reduce((latest, conversation) => {
          return conversation.timestamp > latest.timestamp ? conversation : latest
        }, updatedConversations[0])

        if (!savedConversation) {
          throw new Error('Failed to retrieve the saved conversation.')
        }

        trackEvent('conversation_added', {})
        return savedConversation
      } catch (error) {
        console.error('Error saving conversation:', error)
        throw error
      }
    },

    addConversation,
    updateConversation,
    deleteConversation,
    deleteAllConversations: async () => {
      await Highlight.conversations.deleteAllConversations()
      trackEvent('delete_all_conversations', {})
    },
    setAutoSaveTime: async (time: number) => {
      const validTime = time !== 0 ? time : AUTO_SAVE_TIME_DEFAULT
      await Highlight.conversations.setAutoSaveTime(validTime)
      setAutoSaveTime(validTime)
      trackEvent('changed_auto_save_value', { newValue: validTime })
    },
    setAutoClearDays: async (days: number) => {
      const validDays = days
      await Highlight.conversations.setAutoClearDays(validDays)
      setAutoClearDays(validDays)
      trackEvent('changed_auto_clear_value', { newValue: validDays })
    },
    setAsrDuration: async (hours: number) => {
      if (hours <= 0) {
        console.log('Invalid ASR duration. Skipping update:', hours)
        return
      }
      try {
        if (Highlight.conversations.setAsrDuration) {
          await Highlight.conversations.setAsrDuration(hours)
        }
        setAsrDuration(hours)
        trackEvent('changed_asr_duration', { newValue: hours })
      } catch (error) {
        console.error('Error setting ASR duration:', error)
        throw error
      }
    },
    setAsrCloudFallback: async (enabled: boolean) => {
      try {
        if (Highlight.conversations.setAsrCloudFallback) {
          await Highlight.conversations.setAsrCloudFallback(enabled)
        }
        setAsrCloudFallback(enabled)
        trackEvent('changed_asr_cloud_fallback', { newValue: enabled })
      } catch (error) {
        console.error('Error setting ASR cloud fallback:', error)
        throw error
      }
    },
    setIsAudioOn: setIsAudioOnAndSave,
    setSearchQuery,
    isSaving,
    getWordCount,
    updateConversations: async (conversations: ConversationData[]) => {
      const filteredConversations = conversations.filter((conv) => conv.transcript.trim() !== '')
      await Highlight.conversations.updateConversations(filteredConversations)
      setConversations(filteredConversations)
    },
    toggleMergeActive,
    handleConversationSelect,
    mergeSelectedConversations,
    selectedConversationId,
    setSelectedConversationId,
    handleCurrentConversationSelect
  }

  // const autoClearConversations = useCallback(async () => {
  //   console.log('Auto-clearing conversations:', autoClearDays)
  //   if (autoClearDays <= 0) return

  //   const now = new Date()
  //   const cutoffDate = new Date(now.getTime() - autoClearDays * DAY_IN_MS)

  //   const updatedConversations = conversations.filter((conversation) => {
  //     return conversation.timestamp >= cutoffDate
  //   })

  //   if (updatedConversations.length !== conversations.length) {
  //     console.log('Auto-cleared conversations:', conversations.length - updatedConversations.length)
  //     setConversations(updatedConversations)
  //     await Highlight.conversations.updateConversations(updatedConversations)
  //   }
  // }, [conversations, autoClearDays])

  return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>
}

export const useConversations = () => {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider')
  }
  return context
}

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import Highlight from '@highlight-ai/app-runtime'
import { ConversationData } from '@/data/conversations'
import { getConversationsFromAppStorage } from '@/services/highlightService'
import { useAudioPermission } from '@/hooks/useAudioPermission'

const POLL_MIC_ACTIVITY = 300
const HOUR_IN_MS = 60 * 60 * 1000
const DAY_IN_MS = 24 * 60 * 60 * 1000

const AUTO_SAVE_TIME_DEFAULT = 60 * 2
const AUTO_CLEAR_DAYS_DEFAULT = 7

interface ConversationContextType {
  conversations: ConversationData[]
  filteredConversations: ConversationData[]
  currentConversation: string
  elapsedTime: number
  autoSaveTime: number
  autoClearDays: number
  micActivity: number
  isAudioOn: boolean
  searchQuery: string
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
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [currentConversation, setCurrentConversation] = useState<string>('')
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [autoSaveTime, setAutoSaveTime] = useState<number>(AUTO_SAVE_TIME_DEFAULT)
  const [autoClearDays, setAutoClearDays] = useState<number>(AUTO_CLEAR_DAYS_DEFAULT)
  const [micActivity, setMicActivity] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Use the useAudioPermission hook
  const { isAudioPermissionEnabled: isAudioOn, toggleAudioPermission } = useAudioPermission()

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
        setAutoSaveTime(time)
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
  }, [isAudioOn])

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
      if (!acc.some((existingConv) => existingConv.id === conv.id)) {
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
      await Highlight.conversations.updateConversations(mergedConversations)
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
      setAutoSaveTime(autoSaveTime !== 0 ? autoSaveTime : AUTO_SAVE_TIME_DEFAULT)

      const autoClearDays = await Highlight.conversations.getAutoClearDays()
      console.log('Auto-clear days:', autoClearDays)
      setAutoClearDays(autoClearDays !== 0 ? autoClearDays : AUTO_CLEAR_DAYS_DEFAULT)

      await autoClearConversations()

      console.log('Finished fetching initial data')
    }
    fetchInitialData()
  }, [fetchLatestData])

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
    return conversations.filter((conversation) => {
      const matchTranscript = conversation.transcript.toLowerCase().includes(searchQuery.toLowerCase())
      const matchSummary = conversation.summary.toLowerCase().includes(searchQuery.toLowerCase())
      return matchTranscript || matchSummary
    })
  }, [conversations, searchQuery])

  const contextValue: ConversationContextType = {
    conversations,
    filteredConversations,
    currentConversation,
    elapsedTime,
    autoSaveTime,
    autoClearDays,
    micActivity,
    isAudioOn,
    searchQuery,
    saveCurrentConversation: Highlight.conversations.saveCurrentConversation,
    addConversation: Highlight.conversations.addConversation,
    updateConversation: Highlight.conversations.updateConversation,
    deleteConversation: Highlight.conversations.deleteConversation,
    deleteAllConversations: Highlight.conversations.deleteAllConversations,
    setAutoSaveTime: async (time: number) => {
      const validTime = time !== 0 ? time : AUTO_SAVE_TIME_DEFAULT
      await Highlight.conversations.setAutoSaveTime(validTime)
      setAutoSaveTime(validTime)
    },
    setAutoClearDays: async (days: number) => {
      const validDays = days !== 0 ? days : AUTO_CLEAR_DAYS_DEFAULT
      await Highlight.conversations.setAutoClearDays(validDays)
      setAutoClearDays(validDays)
    },
    setIsAudioOn: setIsAudioOnAndSave,
    setSearchQuery,
    isSaving,
    getWordCount,
    updateConversations: Highlight.conversations.updateConversations
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

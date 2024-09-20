import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import Highlight, { ConversationData } from '@highlight-ai/app-runtime'
import { ConversationData as ConversationDataFromData } from '@/data/conversations'

const POLL_MIC_ACTIVITY = 300
const AUDIO_ENABLED_KEY = 'audioEnabled'

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
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [currentConversation, setCurrentConversation] = useState<string>('')
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [autoSaveTime, setAutoSaveTime] = useState<number>(0)
  const [autoClearDays, setAutoClearDays] = useState<number>(0)
  const [micActivity, setMicActivity] = useState(0)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const setupListeners = useCallback(() => {
    const removeCurrentConversationListener = Highlight.app.addListener(
      'onCurrentConversationUpdate',
      (conversation: string) => {
        if (isAudioOn) {
          console.log('New current conversation:', conversation)
          setCurrentConversation(conversation)
        }
      },
    )

    const removeConversationsUpdatedListener = Highlight.app.addListener(
      'onConversationsUpdated',
      (updatedConversations: ConversationData[]) => {
        if (isAudioOn) {
          console.log('Updated conversations:', updatedConversations)
          const processedConversations = updatedConversations.map(conv => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
            startedAt: new Date(conv.startedAt),
            endedAt: new Date(conv.endedAt)
          }))
          setConversations(processedConversations)
        }
      },
    )

    const removeElapsedTimeUpdatedListener = Highlight.app.addListener(
      'onConversationsElapsedTimeUpdated',
      (time: number) => {
        if (isAudioOn) {
          setElapsedTime(time)
        }
      },
    )

    const removeAutoSaveUpdatedListener = Highlight.app.addListener(
      'onConversationsAutoSaveUpdated',
      (time: number) => {
        console.log('Updated auto-save time:', time)
        setAutoSaveTime(time)
      },
    )

    const removeAutoClearUpdatedListener = Highlight.app.addListener(
      'onConversationsAutoClearUpdated',
      (days: number) => {
        console.log('Updated auto-clear days:', days)
        setAutoClearDays(days)
      },
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

  const fetchLatestData = useCallback(async () => {
    console.log('Fetching latest data...')
    const allConversations = await Highlight.conversations.getAllConversations()
    console.log('All conversations:', allConversations)
    
    // Ensure timestamps are Date objects
    const processedConversations = allConversations.map((conv: ConversationDataFromData) => ({
      ...conv,
      timestamp: new Date(conv.timestamp),
      startedAt: new Date(conv.startedAt),
      endedAt: new Date(conv.endedAt)
    }))
    
    setConversations(processedConversations)

    const currentConv = await Highlight.conversations.getCurrentConversation()
    console.log('Current conversation:', currentConv)
    setCurrentConversation(currentConv)

    const elapsedTime = await Highlight.conversations.getElapsedTime()
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
      setAutoSaveTime(autoSaveTime)

      const autoClearDays = await Highlight.conversations.getAutoClearDays()
      console.log('Auto-clear days:', autoClearDays)
      setAutoClearDays(autoClearDays)

      // Load isAudioOn from appStorage
      const storedIsAudioOn = await Highlight.appStorage.get(AUDIO_ENABLED_KEY)
      console.log('Stored isAudioOn:', storedIsAudioOn)
      setIsAudioOn(storedIsAudioOn === false ? false : true)
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
      setIsAudioOn(isOn)
      await Highlight.appStorage.set(AUDIO_ENABLED_KEY, isOn)

      if (isOn) {
        await fetchLatestData()
      } else {
        setCurrentConversation('')
        setElapsedTime(0)
      }
    },
    [fetchLatestData],
  )

  const getWordCount = useCallback((transcript: string): number => {
    return transcript.trim().split(/\s+/).length
  }, [])

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
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
    setAutoSaveTime: Highlight.conversations.setAutoSaveTime,
    setAutoClearDays: Highlight.conversations.setAutoClearDays,
    setIsAudioOn: setIsAudioOnAndSave,
    setSearchQuery,
    isSaving,
    getWordCount,
  }

  return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>
}

export const useConversations = () => {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider')
  }
  return context
}
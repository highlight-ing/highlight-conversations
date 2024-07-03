'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { setAsrRealtime, setAudioSuperpowerEnabled, getAudioSuperPowerEnabled } from '@/services/highlightService'
import { ConversationData } from '@/data/conversations'
import {
  saveConversations,
  loadConversations,
  AUTO_CLEAR_VALUE_KEY,
  MIN_CHARACTER_KEY,
  AUTO_SAVE_SEC_KEY,
  AUDIO_ENABLED_KEY,
  saveNumberValue,
  loadNumberValue,
  saveBooleanValue,
  loadBooleanValue,
  migrateToNewDefaults
} from '@/utils/localStorage'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'
import { usePageVisibility } from '@/hooks/usePageVisibility'
import WelcomeDialog from '@/components/WelcomeDialog/WelcomeDialog'
import { MIN_CHARACTER_COUNT, AUTO_SAVE_SEC, AUTO_CLEAR_DAYS } from '@/constants/appConstants'

// TODO: - set to false or remove for production
const IS_TEST_MODE = false
const AUTO_CLEAR_POLL = 60000

const clearOldConversations = (
  conversations: ConversationData[],
  autoClearValue: number,
  isTestMode: boolean
): ConversationData[] => {
  if (!conversations || conversations.length === 0) {
    return []
  }

  const now = new Date()

  return conversations.filter((conversation) => {
    const conversationDate = new Date(conversation.timestamp)

    const diff = isTestMode ? minutesDifference(conversationDate, now) : daysDifference(conversationDate, now)

    const shouldKeep = diff < autoClearValue

    return shouldKeep
  })
}

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState<number>(1)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean | null>(null)
  const [characterCount, setCharacterCount] = useState(MIN_CHARACTER_COUNT)
  const [idleTimerValue, setIdleTimerValue] = useState(AUTO_SAVE_SEC)
  const isVisible = usePageVisibility()
  const isInitialMount = useRef(true)

  useEffect(() => {
    const initializeAudioState = async () => {
      const electronSetting = await getAudioSuperPowerEnabled()
      const localStorageSetting = loadBooleanValue(AUDIO_ENABLED_KEY, electronSetting)
      
      setIsAudioEnabled(localStorageSetting)
    }
  
    initializeAudioState()
  }, [])

  // Load values from localStorage
  useEffect(() => {
    migrateToNewDefaults()
    setAutoClearValue(loadNumberValue(AUTO_CLEAR_VALUE_KEY, AUTO_CLEAR_DAYS))
    setIdleTimerValue(loadNumberValue(AUTO_SAVE_SEC_KEY, AUTO_SAVE_SEC))
  }, [])

  // Load saved conversations from Local Storage
  useEffect(() => {
    const storedConversations = loadConversations()
    setConversations(storedConversations)
  }, [])

  // Save conversations to Local Storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    saveConversations(conversations)
  }, [conversations])

  // Set ASR Realtime effect TODO: Deprecate?
  useEffect(() => {
    setAsrRealtime(false)
  }, [])

  useEffect(() => {
    const clearConversations = () => {
      const updatedConversations = clearOldConversations(conversations, autoClearValue, IS_TEST_MODE)
      if (updatedConversations.length !== conversations.length) {
        setConversations(updatedConversations)
      }
    }

    clearConversations() // Clear on load

    const intervalId = setInterval(clearConversations, AUTO_CLEAR_POLL)
    return () => clearInterval(intervalId)
  }, [conversations, autoClearValue])

  const handleAudioToggle = async (isOn: boolean) => {
    await setAudioSuperpowerEnabled(isOn)
    setIsAudioEnabled(isOn)
    saveBooleanValue(AUDIO_ENABLED_KEY, isOn)
  }

  const handleMicActivityChange = (activity: number) => {
    setMicActivity(activity)
  }

  const handleAutoClearValueChange = (value: number) => {
    setAutoClearValue(value)
    saveNumberValue(AUTO_CLEAR_VALUE_KEY, value)
  }

  const handleAutoSaveChange = (value: number) => {
    setIdleTimerValue(value)
    saveNumberValue(AUTO_SAVE_SEC_KEY, value)
  }

  const addConversation = useCallback((newConversation: Omit<ConversationData, 'timestamp'>) => {
    const conversationWithCurrentTimestamp = {
      ...newConversation,
      timestamp: new Date()
    }
    setConversations((prevConversations) => [conversationWithCurrentTimestamp, ...prevConversations])
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.filter((conv) => conv.id !== id)
      saveConversations(updatedConversations)
      return updatedConversations
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <WelcomeDialog />
      <Header
        autoClearValue={autoClearValue}
        characterCount={characterCount}
        autoSaveValue={idleTimerValue}
        isAudioOn={isAudioEnabled ?? false}
        onAutoClearValueChange={handleAutoClearValueChange}
        onAudioSwitch={handleAudioToggle}
        onAutoSaveChange={handleAutoSaveChange}
      />
      <main className="flex-grow p-4">
        <AnimatePresence>
          <ConversationsManager
            conversations={conversations}
            idleThreshold={idleTimerValue}
            minCharacters={characterCount}
            isAudioEnabled={isAudioEnabled ?? false}
            onMicActivityChange={handleMicActivityChange}
            addConversation={addConversation}
            onDeleteConversation={deleteConversation}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}

export default MainPage

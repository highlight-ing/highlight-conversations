'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { ConversationData } from '@/data/conversations'
import {
  setAsrRealtime,
  requestBackgroundPermission,
  setAudioSuperpowerEnabled,
  getAudioSuperPowerEnabled,
  migrateFromLocalStorageToAppStorage,
  saveNumberInAppStorage,
  saveBooleanInAppStorage,
  getNumberFromAppStorage,
  getOptionalBooleanFromAppStorage,
  saveConversationsInAppStorage,
  getConversationsFromAppStorage,
  AUTO_CLEAR_VALUE_KEY,
  AUTO_SAVE_SEC_KEY,
  AUDIO_ENABLED_KEY,
  
} from '@/services/highlightService'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'
import { usePageVisibility } from '@/hooks/usePageVisibility'
import WelcomeDialog from '@/components/WelcomeDialog/WelcomeDialog'
import { MIN_CHARACTER_COUNT, AUTO_SAVE_SEC, AUTO_CLEAR_DAYS } from '@/constants/appConstants'

// TODO: - set to false or remove for production
const IS_TEST_MODE = false
const AUTO_CLEAR_POLL = 60000
const USER_AUDIO_PREFERENCE_KEY = 'userAudioPreference';

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
  const [autoClearValue, setAutoClearValue] = useState<number>(AUTO_CLEAR_DAYS)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean | null>(null)
  const [characterCount, setCharacterCount] = useState(MIN_CHARACTER_COUNT)
  const [idleTimerValue, setIdleTimerValue] = useState(AUTO_SAVE_SEC)
  const isVisible = usePageVisibility()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      requestBackgroundPermission()
    }
  }, [])

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      // Perform migration
      await migrateFromLocalStorageToAppStorage()
      console.log('Migration completed');

      const initializeAudioState = async () => {
        const electronSetting = await getAudioSuperPowerEnabled();
        const userPreference = await getOptionalBooleanFromAppStorage(USER_AUDIO_PREFERENCE_KEY);
        console.log('Audio settings:', { electronSetting, userPreference });
    
        if (userPreference === undefined) {
          console.log('Using electron setting for audio:', electronSetting);
          setIsAudioEnabled(electronSetting);
        } else {
          console.log('Using user preference for audio:', userPreference);
          setIsAudioEnabled(userPreference);
        }
      };

      // Initialize audio state
      await initializeAudioState();

      // Load values from AppStorage
      const storedAutoClearValue = await getNumberFromAppStorage(AUTO_CLEAR_VALUE_KEY, AUTO_CLEAR_DAYS);
      const storedIdleTimerValue = await getNumberFromAppStorage(AUTO_SAVE_SEC_KEY, AUTO_SAVE_SEC);
      console.log('Loaded settings:', { autoClearValue: storedAutoClearValue, idleTimerValue: storedIdleTimerValue });
      setAutoClearValue(storedAutoClearValue);
      setIdleTimerValue(storedIdleTimerValue);

      // Load conversations
      console.log('Loading conversations from AppStorage...');
      const storedConversations = await getConversationsFromAppStorage()
      console.log('Loaded conversations:', storedConversations);
      setConversations(storedConversations)
    }

    initializeApp()
  }, [])

  // Save conversations to AppStorage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      console.log('Initial mount, skipping save');
      isInitialMount.current = false
      return
    }
    console.log('Saving conversations to AppStorage:', conversations);
    saveConversationsInAppStorage(conversations)
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
    await saveBooleanInAppStorage(AUDIO_ENABLED_KEY, isOn)
  }

  const handleMicActivityChange = (activity: number) => {
    setMicActivity(activity)
  }

  const handleAutoClearValueChange = async (value: number) => {
    setAutoClearValue(value)
    await saveNumberInAppStorage(AUTO_CLEAR_VALUE_KEY, value)
  }

  const handleAutoSaveChange = async (value: number) => {
    setIdleTimerValue(value)
    await saveNumberInAppStorage(AUTO_SAVE_SEC_KEY, value)
  }

  const addConversation = useCallback(async (newConversation: Omit<ConversationData, 'timestamp'>) => {
    const conversationWithCurrentTimestamp = {
      ...newConversation,
      timestamp: new Date()
    };
    console.log('Adding new conversation:', conversationWithCurrentTimestamp);
    setConversations((prevConversations) => {
      const updatedConversations = [conversationWithCurrentTimestamp, ...prevConversations];
      console.log('Saving updated conversations:', updatedConversations);
      saveConversationsInAppStorage(updatedConversations);
      return updatedConversations;
    });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    console.log('Deleting conversation with id:', id);
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.filter((conv) => conv.id !== id)
      console.log('Saving updated conversations after deletion:', updatedConversations);
      saveConversationsInAppStorage(updatedConversations)
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

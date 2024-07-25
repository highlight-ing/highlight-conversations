'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { ConversationData } from '@/data/conversations'
import {
  requestBackgroundPermission,
  setAudioSuperpowerEnabled,
  getAudioSuperPowerEnabled,
  addAudioPermissionListener,
  requestAudioPermissionEvents,
  migrateFromLocalStorageToAppStorage,
  saveNumberInAppStorage,
  saveBooleanInAppStorage,
  getNumberFromAppStorage,
  getBooleanFromAppStorage,
  saveConversationsInAppStorage,
  getConversationsFromAppStorage,
  setupSimpleAudioPermissionListener,
  AUTO_CLEAR_VALUE_KEY,
  AUTO_SAVE_SEC_KEY,
  AUDIO_ENABLED_KEY,
  // addSleepListener,
  // removeSleepListener,
  // addWakeListener,
  // removeWakeListener
  
} from '@/services/highlightService'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'
import { usePageVisibility } from '@/hooks/usePageVisibility'
import WelcomeDialog from '@/components/WelcomeDialog/WelcomeDialog'
import { MIN_CHARACTER_COUNT, AUTO_SAVE_SEC, AUTO_CLEAR_DAYS } from '@/constants/appConstants'
import AudioPermissionDialog from '@/components/Dialogue/AudioPermissionDialog'

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
  const [autoClearValue, setAutoClearValue] = useState<number>(AUTO_CLEAR_DAYS)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true)
  const [characterCount, setCharacterCount] = useState(MIN_CHARACTER_COUNT)
  const [idleTimerValue, setIdleTimerValue] = useState(AUTO_SAVE_SEC)
  const [isSleeping, setIsSleeping] = useState(false)
  const isInitialMount = useRef(true)
  const [isAudioPermissionEnabled, setIsAudioPermissionEnabled] = useState<boolean | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // useEffect(() => {
  //   const handleSleep = () => {
  //     console.log('System is going to sleep');
  //     setIsSleeping(true)
  //   };
  
  //   const handleWake = () => {
  //     console.log('System is waking up');
  //     setIsSleeping(false)
  //   };
  
  //   addSleepListener(handleSleep);
  //   addWakeListener(handleWake);
  
  //   // Cleanup
  //   return () => {
  //     removeSleepListener(handleSleep);
  //     removeWakeListener(handleWake);
  //   };
  // }, []);

  useEffect(() => {
    requestBackgroundPermission()
  }, [])
  
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      // Perform migration
      await migrateFromLocalStorageToAppStorage()
      console.log('Migration completed');

      // Initialize audio state
      await initializeAudioSuperPower();
      await initializeAudioEnabled();
      await requestAudioPermissionEvents()

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
      setIsInitialized(true)

      setupSimpleAudioPermissionListener()

      // // Set up audio permission listener
      // addAudioPermissionListener((event: { hasPermission: any }) => {
      //   // setIsAudioPermissionEnabled(event.hasPermission);
      //   console.log('Audio permission changed:', event.hasPermission);
      // });

      // Clean up function
      return () => {
        // If there's no way to remove the listener, you can leave this empty
        // or add any other cleanup code you might need
      };
    }

    initializeApp()
  }, [])

  const initializeAudioSuperPower = async () => {
    const audioPermission = await getAudioSuperPowerEnabled();
    console.log('Initial audio permission:', audioPermission);
    setIsAudioPermissionEnabled(audioPermission);
  };

  const initializeAudioEnabled = async () => {
    const audioEnabled = await getBooleanFromAppStorage(AUDIO_ENABLED_KEY, true);
    console.log('Audio enabled:', audioEnabled);
    setIsAudioEnabled(audioEnabled);
  };

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
  const handleUpdateConversation = (updatedConversation: ConversationData) => {
    setConversations((prevConversations) => {
      const index = prevConversations.findIndex((conv) => conv.id === updatedConversation.id)
      const updatedConversations = [...prevConversations]
      updatedConversations[index] = updatedConversation
      return updatedConversations
    })
  }

  const handleDeleteAllConversations = async () => {
    setConversations([])
    await saveConversationsInAppStorage([])
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

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isAudioPermissionEnabled !== null && (
        <AudioPermissionDialog isAudioPermissionGranted={isAudioPermissionEnabled} />
      )}
      <WelcomeDialog />
      <Header
        autoClearValue={autoClearValue}
        autoSaveValue={idleTimerValue}
        isAudioOn={isAudioEnabled ?? false}
        onDeleteAllConversations={handleDeleteAllConversations}
        onAutoClearValueChange={handleAutoClearValueChange}
        onAudioSwitch={handleAudioToggle}
        onAutoSaveChange={handleAutoSaveChange}
      />
      <main className="flex-grow p-4">
        <AnimatePresence>
          <ConversationsManager
            conversations={conversations}
            idleThreshold={idleTimerValue}
            isAudioEnabled={isAudioEnabled}
            isSleeping={isSleeping}
            onMicActivityChange={handleMicActivityChange}
            addConversation={addConversation}
            onDeleteConversation={deleteConversation}
            onUpdateConversation={handleUpdateConversation}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}

export default MainPage
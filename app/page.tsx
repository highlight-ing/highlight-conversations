'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { 
  setAsrRealtime,
  setAudioSuperpowerEnabled
 } from '@/services/highlightService'
import { ConversationData } from '@/data/conversations'
import { saveConversations, loadConversations } from '@/utils/localStorage'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'

const AUTO_CLEAR_VALUE_KEY = 'autoClearValue'
// TODO: - set to false or remove for production
const IS_TEST_MODE = false
const AUTO_CLEAR_POLL = 60000

const clearOldConversations = (
  conversations: ConversationData[],
  autoClearValue: number,
  isTestMode: boolean
): ConversationData[] => {
  if (!conversations || conversations.length === 0) {
    return [];
  }

  const now = new Date();
  
  return conversations.filter((conversation) => {
    const conversationDate = new Date(conversation.timestamp);
    
    const diff = isTestMode
      ? minutesDifference(conversationDate, now)
      : daysDifference(conversationDate, now);
        
    const shouldKeep = diff < autoClearValue;
    
    return shouldKeep;
  });
};

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState<number>(1)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const isInitialMount = useRef(true)

  const handleAudioToggle = async (isOn: boolean) => {
    await setAudioSuperpowerEnabled(isOn)
  }
  // Set the initial autoClearValue from localStorage
  useEffect(() => {
    const storedValue = localStorage.getItem(AUTO_CLEAR_VALUE_KEY)
    if (storedValue) {
      setAutoClearValue(parseInt(storedValue, 10))
    }
  }, [])

  // Load saved conversations from Local Storage
  useEffect(() => {
    const storedConversations = loadConversations()
    setConversations(storedConversations)
  }, [])

  // Save conversations to Local Storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveConversations(conversations)
  }, [conversations])

  // Set ASR Realtime effect TODO: Deprecate?
  useEffect(() => {
    setAsrRealtime(false)
  }, [])

  const handleMicActivityChange = (activity: number) => {
    setMicActivity(activity)
  }

  const handleAutoClearValueChange = (value: number) => {
    setAutoClearValue(value)
    localStorage.setItem(AUTO_CLEAR_VALUE_KEY, value.toString())
  }

  useEffect(() => {
    const clearConversations = () => {
      const updatedConversations = clearOldConversations(
        conversations,
        autoClearValue,
        IS_TEST_MODE
      );
      if (updatedConversations.length !== conversations.length) {
        setConversations(updatedConversations);
      }
    };
  
    clearConversations(); // Clear on load
  
    const intervalId = setInterval(clearConversations, AUTO_CLEAR_POLL);
    return () => clearInterval(intervalId);
  }, [conversations, autoClearValue]); // Add dependencies

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
      <Header
        autoClearValue={autoClearValue}
        onAutoClearValueChange={handleAutoClearValueChange}
        isAudioOn={isAudioEnabled}
        onAudioSwitch={handleAudioToggle}
      />
      <main className="flex-grow p-4">
        <AnimatePresence>
          <ConversationsManager
            onMicActivityChange={handleMicActivityChange}
            conversations={conversations}
            addConversation={addConversation}
            onDeleteConversation={deleteConversation}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}

export default MainPage

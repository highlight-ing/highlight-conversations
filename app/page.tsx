"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { setAsrRealtime } from '@/services/audioService'
import { ConversationData } from '@/data/conversations'
import { saveConversations, loadConversations } from '@/utils/localStorage'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'

const AUTO_CLEAR_VALUE_KEY = 'autoClearValue'
// TODO: - set to false or remove for production
const IS_TEST_MODE = true
const AUTO_CLEAR_POLL = 60000


const clearOldConversations = (
  conversations: ConversationData[],
  autoClearValue: number,
  isTestMode: boolean
): ConversationData[] => {
  const now = new Date()
  return conversations.filter((conversation) => {
    if (isTestMode) {
      return minutesDifference(conversation.timestamp, now) < autoClearValue
    } else {
      return daysDifference(conversation.timestamp, now) < autoClearValue
    }
  })
}

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState<number>(() => {
    const storedValue = localStorage.getItem(AUTO_CLEAR_VALUE_KEY)
    return storedValue ? parseInt(storedValue, 10) : 1
  })
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])

  const conversationsRef = useRef(conversations)
  const autoClearValueRef = useRef(autoClearValue)

  // Load saved conversations from Local Storage
  useEffect(() => {
    const storedConversations = loadConversations()
    setConversations(storedConversations)
  }, [])

  // Save conversations to Local Storage whenever they change
  useEffect(() => {
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

  // Clear old conversations on load and at regular intervals
  useEffect(() => {
    const clearConversations = () => {
      const updatedConversations = clearOldConversations(
        conversationsRef.current,
        autoClearValueRef.current,
        IS_TEST_MODE
      )
      setConversations(updatedConversations)
    }

    clearConversations() // Clear on load

    const intervalId = setInterval(clearConversations, AUTO_CLEAR_POLL)
    return () => clearInterval(intervalId)
  }, [])

  const addConversation = useCallback((newConversation: Omit<ConversationData, 'timestamp'>) => {
    const conversationWithCurrentTimestamp = {
      ...newConversation,
      timestamp: new Date()
    }
    setConversations(prevConversations => [conversationWithCurrentTimestamp, ...prevConversations])
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        autoClearValue={autoClearValue}
        onAutoClearValueChange={handleAutoClearValueChange}
      />
      <main className="flex-grow p-4">
        <ConversationsManager 
          onMicActivityChange={handleMicActivityChange}
          conversations={conversations}
          addConversation={addConversation}
        />
        <h2>Mic Activity: {micActivity}</h2>
      </main>
    </div>
  )
}

export default MainPage
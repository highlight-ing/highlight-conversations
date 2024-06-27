"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { setAsrRealtime } from '@/services/audioService'
import { ConversationData } from '@/data/conversations'
import { saveConversations, loadConversations } from '@/utils/localStorage'

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState(1)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])

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
  }

  const clearOldConversations = useCallback(() => {
    const now = new Date()
    const updatedConversations = conversations.filter((conversation) => {
      const conversationDate = new Date(conversation.timestamp)
      const diffMs = now.getTime() - conversationDate.getTime()
      const diffMinutes = Math.floor(diffMs / 5000)
      const shouldKeep = diffMinutes < autoClearValue
      return shouldKeep
    })
    setConversations(updatedConversations)
  }, [autoClearValue, conversations])

  useEffect(() => {
    const intervalId = setInterval(clearOldConversations, 5000) // Check every 10 seconds
    return () => {
      clearInterval(intervalId)
    }
  }, [clearOldConversations])

  const addConversation = useCallback((newConversation: ConversationData) => {
    const conversationWithCurrentTimestamp = {
      ...newConversation,
      timestamp: new Date().toISOString()
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
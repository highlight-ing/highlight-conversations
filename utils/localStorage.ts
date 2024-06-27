// utils/localStorage.ts
import { ConversationData } from '@/data/conversations'

const STORAGE_KEY = 'conversations'

export const saveConversations = (conversations: ConversationData[]): void => {
  const serializedConversations = conversations.map(conv => ({
    ...conv,
    timestamp: conv.timestamp.toISOString()
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedConversations))
}

export const loadConversations = (): ConversationData[] => {
  const storedConversations = localStorage.getItem(STORAGE_KEY)
  if (!storedConversations) return []
  
  return JSON.parse(storedConversations).map((conv: any) => ({
    ...conv,
    timestamp: new Date(conv.timestamp)
  }))
}
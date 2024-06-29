// utils/localStorage.ts
import { ConversationData } from '@/data/conversations'

const STORAGE_KEY = 'conversations'

export const saveConversations = (conversations: ConversationData[]): void => {
  if (conversations.length === 0) {
    console.warn('Attempting to save an empty conversations array. This might be unintended')
    return
  }
  const serializedConversations = conversations.map(conv => ({
    ...conv,
    timestamp: conv.timestamp.toISOString()
  }))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedConversations))
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error);
  }
}

export const loadConversations = (): ConversationData[] => {
  const storedConversations = localStorage.getItem(STORAGE_KEY)
  if (!storedConversations) {
    console.log('No stored conversations found');
    return []
  }
  
  try {
    const parsedConversations = JSON.parse(storedConversations);
    
    const deserializedConversations = parsedConversations.map((conv: any) => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }));
    
    return deserializedConversations;
  } catch (error) {
    console.error('Failed to parse or deserialize stored conversations:', error);
    return [];
  }
}
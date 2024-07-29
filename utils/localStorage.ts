// utils/localStorage.ts
import { ConversationData } from '@/data/conversations'
import { AUTO_CLEAR_DAYS, AUTO_SAVE_SEC } from '@/constants/appConstants'

export const CONVERSATIONS_STORAGE_KEY = 'conversations'
export const AUTO_CLEAR_VALUE_KEY = 'autoClearValue'
export const MIN_CHARACTER_KEY = 'minCharacter'
export const AUTO_SAVE_SEC_KEY = 'autoSaveSec'
export const AUDIO_ENABLED_KEY = 'audioEnabled'

export const saveConversations = (conversations: ConversationData[]): void => {
  if (conversations.length === 0) {
    console.warn('Attempting to save an empty conversations array. This might be unintended')
    return
  }
  const serializedConversations = conversations.map((conv) => ({
    ...conv,
    timestamp: conv.timestamp.toISOString()
  }))
  try {
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(serializedConversations))
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error)
  }
}

export const loadConversations = (): ConversationData[] => {
  const storedConversations = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
  if (!storedConversations) {
    return []
  }

  try {
    const parsedConversations = JSON.parse(storedConversations)

    const deserializedConversations = parsedConversations.map((conv: any) => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }))

    return deserializedConversations
  } catch (error) {
    console.error('Failed to parse or deserialize stored conversations:', error)
    return []
  }
}

export const saveNumberValue = (key: string, value: number) => {
  localStorage.setItem(key, value.toString())
}

export const loadNumberValue = (key: string, defaultValue: number): number => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? parseInt(storedValue, 10) : defaultValue
}

export const saveBooleanValue = (key: string, value: boolean) => {
  localStorage.setItem(key, value.toString())
}

export const loadBooleanValue = (key: string, defaultValue: boolean): boolean => {
  const storedValue = localStorage.getItem(key)
  return storedValue !== null ? storedValue === 'true' : defaultValue
}

export const migrateToNewDefaults = () => {
  const keys = [
    { key: AUTO_CLEAR_VALUE_KEY, defaultValue: AUTO_CLEAR_DAYS },
    { key: AUTO_SAVE_SEC_KEY, defaultValue: AUTO_SAVE_SEC },
  ];

  keys.forEach(({ key, defaultValue }) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      const parsedValue = parseInt(storedValue, 10);
      if (isNaN(parsedValue) || parsedValue !== defaultValue) {
        localStorage.setItem(key, defaultValue.toString());
      }
    } else {
      localStorage.setItem(key, defaultValue.toString());
    }
  });
};
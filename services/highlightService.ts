// services/highlightService.ts
'use client'
import Highlight from '@highlight-ai/app-runtime'
import { GeneratedPrompt, LLMMessage } from '../types/types'
import { ConversationData, DEFAULT_SUMMARY_INSTRUCTION, BASE_SYSTEM_PROMPT } from '@/data/conversations'

export const CONVERSATIONS_STORAGE_KEY = 'conversations'
export const AUTO_CLEAR_VALUE_KEY = 'autoClearValue'
export const AUTO_SAVE_SEC_KEY = 'autoSaveSec'
export const AUDIO_ENABLED_KEY = 'audioEnabled'
export const HAS_SEEN_ONBOARDING_KEY = 'hasSeenOnboarding'
declare global {
  interface Window {
    highlight: {
      internal: {
        getAudioSuperpowerEnabled: () => Promise<boolean>
        setAudioSuperpowerEnabled: (enabled: boolean) => Promise<void>
        getTextPrediction: (messages: LLMMessage[]) => Promise<string>
        openApp: (appId: string) => void
        sendConversationAsAttachment: (targetAppId: string, attachment: string) => Promise<void>
        requestAudioPermissionEvents: () => Promise<void>
      }
      appStorage: {
        isHydrated: () => boolean
        whenHydrated: () => Promise<boolean>
        all: () => Record<string, any>
        get: (key: string) => any
        set: (key: string, value: any) => void
        setAll: (value: Record<string, any>) => void
        delete: (key: string) => void
        clear: () => void
      }
    }
  }
}

// Public API functions
export const fetchTranscript = async (): Promise<string | null> => {
  return await Highlight.user.getAudio(false)
}

export const fetchTranscriptForDuration = async (seconds: number): Promise<string | null> => {
  return await Highlight.user.getAudioForDuration(seconds)
}

export const fetchLongTranscript = async (): Promise<string | null> => {
  return await Highlight.user.getAudio(true)
}

export const fetchMicActivity = async (lastNumMs: number = 300): Promise<number> => {
  let activity = await Highlight.user.getMicActivity(lastNumMs)
  return activity
}

export const setAsrRealtime = async (isRealtime: boolean): Promise<void> => {
  await Highlight.user.setAsrRealtime(isRealtime)
}

export const fetchUserFacts = async (): Promise<any> => {
  return await Highlight.user.getFacts()
}

export const fetchScreenshot = async (): Promise<string> => {
  return await Highlight.user.getScreenshot()
}

export const fetchUserEmail = async (): Promise<string> => {
  return await Highlight.user.getEmail()
}

export const requestBackgroundPermission = () => {
  try {
    if (typeof window !== 'undefined' && window.highlight) {
      console
      return Highlight.permissions.requestBackgroundPermission()
    }
  } catch (error) {
    console.error('Error requesting background permission:', error)
  }
}

// Internal API functions
export const getAudioSuperpowerEnabled = async (): Promise<boolean> => {
  return await window.highlight.internal.getAudioSuperpowerEnabled()
}

export const setAudioSuperpowerEnabled = async (enabled: boolean): Promise<void> => {
  await window.highlight.internal.setAudioSuperpowerEnabled(enabled)
}

export const sendAttachmentAndOpen = async (targetAppId: string, attachment: string): Promise<void> => {
  await openExternalApp()

  // Add a 2-second delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await sendAttachment(targetAppId, attachment)
}

const openExternalApp = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.highlight && window.highlight.internal) {
    try {
      await Highlight.app.openApp('highlightchat')
    } catch (error) {
      console.error('Failed to open external app:', error)
    }
  } else {
    console.error('openApp function is not available')
  }
}

const sendAttachment = async (targetAppId: string, attachment: string): Promise<void> => {
  if (typeof window !== 'undefined' && window.highlight && window.highlight.internal) {
    try {
      await window.highlight.internal.sendConversationAsAttachment(targetAppId, attachment)
    } catch (error) {
      console.error('Error sending attachment:', error)
      throw error
    }
  } else {
    throw new Error('sendAttachment function is not available')
  }
}

export interface ProcessedConversationData {
  topics: string[]
  summary: string
  title: string
}

export const summarizeConversation = async (
  transcript: string,
  customPrompt?: string,
  signal?: AbortSignal
): Promise<ProcessedConversationData> => {
  try {
    const processedData = await getTextPredictionFromHighlight(transcript, customPrompt, signal)
    console.log('Processed data:', processedData)
    return {
      topics: processedData.topics,
      summary: processedData.summary,
      title: processedData.title
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Conversation summarization was aborted')
      throw error
    }
    console.error('Error in summarizeConversation:', error)
    throw new Error('Failed to summarize conversation')
  }
}

const getTextPredictionFromHighlight = async (
  transcript: string,
  customPrompt?: string,
  signal?: AbortSignal
): Promise<ProcessedConversationData> => {
  const summaryInstruction = customPrompt || DEFAULT_SUMMARY_INSTRUCTION
  const systemPrompt = `${BASE_SYSTEM_PROMPT} ${summaryInstruction}`

  console.log('Transcript:', transcript)
  console.log('Summary instruction:', summaryInstruction)
  console.log('System prompt:', systemPrompt)

  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: transcript
    }
  ]

  let accumulatedText = ''

  try {
    const textPredictionStream = Highlight.inference.getTextPrediction(messages)

    for await (const chunk of textPredictionStream) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }
      accumulatedText += chunk
    }

    // Parse the accumulated text as JSON
    const parsedData: ProcessedConversationData = JSON.parse(accumulatedText)
    return parsedData
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    console.error('Error in text prediction or parsing:', error)
    throw new Error('Failed to get or parse LLM output')
  }
}

const parsePrompts = (text: string): GeneratedPrompt[] => {
  return text
    .split('\n')
    .filter((line) => /^\d+\./.test(line))
    .map((line, index) => ({
      text: line.replace(/^\d+\.\s*/, '').trim(),
      index: index + 1
    }))
}

// Event listener functions
export const addContextListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onContext', listener)
}

export const removeContextListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onContext', listener)
}

export const addTextPredictionUpdateListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onTextPredictionUpdate', listener)
}

export const removeTextPredictionUpdateListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onTextPredictionUpdate', listener)
}

export const addTextPredictionDoneListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onTextPredictionDone', listener)
}

export const removeTextPredictionDoneListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onTextPredictionDone', listener)
}

export const addAudioPermissionListener = (listener: (event: any) => void): (() => void) => {
  // @ts-ignore
  globalThis.highlight?.internal?.requestAudioPermissionEvents()
  return Highlight.app.addListener('onAudioPermissionUpdate', listener)
}

export const isAudioPermissionEnabled = async (): Promise<boolean> => {
  // @ts-ignore
  return await globalThis.highlight?.internal?.isAudioTranscriptEnabled()
}

export const requestAudioPermissionEvents = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.highlight && window.highlight.internal) {
    try {
      await window.highlight.internal.requestAudioPermissionEvents()
    } catch (error) {
      console.error('Error sending audio permission request:', error)
      throw error
    }
  } else {
    throw new Error('request audio permission is not available')
  }
}

export const setupSimpleAudioPermissionListener = () => {
  Highlight.app.addListener('onAudioPermissionUpdate', (event: any) => {
    // If you know the exact structure of the event, you can log specific properties
    // For example, if there's a hasPermission property:
    // console.log('Audio permission changed:', event.hasPermission);
  })
}

// export const addSleepListener = (listener: () => void): void => {
//   Highlight.addEventListener('onSleep', listener);
// };

// export const removeSleepListener = (listener: () => void): void => {
//   Highlight.removeEventListener('onSleep', listener);
// };

// export const addWakeListener = (listener: () => void): void => {
//   Highlight.addEventListener('onWake', listener);
// };

// export const removeWakeListener = (listener: () => void): void => {
//   Highlight.removeEventListener('onWake', listener);
// };

// App Storage functions
const isBrowser = typeof window !== 'undefined'
const getAppStorage = () => (isBrowser ? window.highlight.appStorage : null)

export const saveToAppStorage = async (key: string, value: any): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.set(key, value)
  }
}

export const loadFromAppStorage = async (key: string, defaultValue: any): Promise<any> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const value = appStorage.get(key)
    return value !== undefined ? value : defaultValue
  }
  return defaultValue
}

export const removeFromAppStorage = async (key: string): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.delete(key)
  }
}

export const clearAppStorage = async (): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.clear()
  }
}

// Type-specific app storage functions
export const saveNumberInAppStorage = async (key: string, value: number): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.set(key, value)
  }
}

export const saveBooleanInAppStorage = async (key: string, value: boolean): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.set(key, value)
  }
}

export const saveStringInAppStorage = async (key: string, value: string): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.set(key, value)
  }
}

export const saveConversationsInAppStorage = async (conversations: ConversationData[]): Promise<void> => {
  if (conversations.length === 0) {
    console.warn('Attempting to save an empty conversations array. This might be unintended')
    return
  }
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const serializedConversations = conversations.map((conv) => ({
      ...conv,
      timestamp: conv.timestamp.toISOString()
    }))
    appStorage.set(CONVERSATIONS_STORAGE_KEY, serializedConversations)
  } else {
    console.error('AppStorage not available. Unable to save conversations.')
  }
}

export const deleteAllConversationsInAppStorage = async (): Promise<void> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    appStorage.delete(CONVERSATIONS_STORAGE_KEY)
  }
}

// Type-specific app storage retrieval functions
export const getNumberFromAppStorage = async (key: string, defaultValue: number): Promise<number> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const value = appStorage.get(key)
    return typeof value === 'number' ? value : defaultValue
  }
  return defaultValue
}

export const getBooleanFromAppStorage = async (key: string, defaultValue: boolean): Promise<boolean> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const value = appStorage.get(key)
    return typeof value === 'boolean' ? value : defaultValue
  }
  return defaultValue
}

export const getStringFromAppStorage = async (key: string, defaultValue: string): Promise<string> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const value = appStorage.get(key)
    return typeof value === 'string' ? value : defaultValue
  }
  return defaultValue
}

export const getConversationsFromAppStorage = async (): Promise<ConversationData[]> => {
  const appStorage = getAppStorage()
  if (appStorage) {
    await appStorage.whenHydrated()
    const serializedConversations = appStorage.get(CONVERSATIONS_STORAGE_KEY)
    if (Array.isArray(serializedConversations)) {
      return serializedConversations.map((conv) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      }))
    }
  }
  return []
}

// Add this new function to the file
export const saveHasSeenOnboarding = async (value: boolean): Promise<void> => {
  await saveBooleanInAppStorage(HAS_SEEN_ONBOARDING_KEY, value)
}

// Also, let's add a function to retrieve this value
export const getHasSeenOnboarding = async (): Promise<boolean> => {
  return await getBooleanFromAppStorage(HAS_SEEN_ONBOARDING_KEY, false)
}

export async function getAccessToken() {
  const { accessToken } = await Highlight.auth.signIn()

  return accessToken
}

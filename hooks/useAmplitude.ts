import { useCallback, useRef } from 'react'
import * as amplitude from '@amplitude/analytics-browser'
import { getUserId } from '@/utils/userUtils'

const IS_DEBUG = process.env.NEXT_PUBLIC_AMPLITUDE_DEBUG_MODE === 'true'

const formatEventName = (eventName: string): string => {
  return `hl_conversations_${eventName.replace(/\s+/g, '_').toLowerCase()}`
}

const trackEventInternal = (eventName: string, eventProperties: Record<string, any>): void => {
  if (typeof window !== 'undefined') {
    const finalEventName = IS_DEBUG ? `DEBUG ${eventName}` : eventName
    const formattedEventName = formatEventName(finalEventName)
    amplitude.track(formattedEventName, eventProperties)
  }
}

export const useAmplitude = () => {
  const trackEventRef = useRef(trackEventInternal)

  const initAmplitude = useCallback(async (): Promise<void> => {
    try {
      const userId = await getUserId()
      if (userId) {
        amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
          defaultTracking: true,
          userId: userId,
        })
        trackEventRef.current('App Initialized', { userId })
      } else {
        const fallbackId = 'anonymous_' + Math.random().toString(36).slice(2, 9)
        amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
          defaultTracking: true,
          userId: fallbackId,
        })
        trackEventRef.current('App Initialized', { fallbackId, error: 'Failed to get userId' })
      }
    } catch (error) {
      console.error('Failed to initialize Amplitude:', error)
      const fallbackId = `anonymous_${Math.random().toString(36).slice(2, 9)}`
      amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
        defaultTracking: true,
        userId: fallbackId,
      })
      trackEventRef.current('App Initialized', { fallbackId, error: 'Failed to get userId' })
    }
  }, [])

  const trackEvent = useCallback((eventName: string, eventProperties: Record<string, any>): void => {
    trackEventInternal(eventName, eventProperties)
  }, [])

  return { initAmplitude, trackEvent }
}
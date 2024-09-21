import { useEffect } from 'react'
import { initAmplitude, trackEvent } from '@/lib/amplitude'
import { getUserId } from '@/utils/userUtils'

export const useAmplitude = () => {
  useEffect(() => {
    const initializeAmplitude = async () => {
      try {
        const userId = await getUserId()
        if (userId) {
          initAmplitude(userId)
          trackEvent('App Initialized', { userId })
        } else {
          const fallbackId = 'anonymous_' + Math.random().toString(36).slice(2, 9)
          initAmplitude(fallbackId)
          trackEvent('App Initialized', { fallbackId, error: 'Failed to get userId' })
        }
      } catch (error) {
        console.error('Failed to initialize Amplitude:', error)
        const fallbackId = `anonymous_${Math.random().toString(36).slice(2, 9)}`
        initAmplitude(fallbackId)
        trackEvent('App Initialized', { fallbackId, error: 'Failed to get userId' })
      }
    }

    initializeAmplitude()
  }, [])

  return { trackEvent }
}
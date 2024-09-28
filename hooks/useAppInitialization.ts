import { useState, useEffect, useCallback, useRef } from 'react'
import { useAmplitude } from '@/hooks/useAmplitude'
import { getHasSeenOnboarding, saveHasSeenOnboarding } from '@/services/highlightService'

export const useAppInitialization = (debugOnboarding: boolean) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)
  const { initAmplitude } = useAmplitude()

  const initAmplitudeRef = useRef(initAmplitude)
  useEffect(() => {
    initAmplitudeRef.current = initAmplitude
  }, [initAmplitude])

  useEffect(() => {
    const initialize = async () => {
      const hasSeenOnboarding = await getHasSeenOnboarding()
      setShowOnboarding(!hasSeenOnboarding || debugOnboarding)

      await initAmplitudeRef.current()
      setIsInitialized(true)
    }

    initialize()
  }, [debugOnboarding])

  const completeOnboarding = useCallback(async () => {
    await saveHasSeenOnboarding(true)
    setShowOnboarding(false)
  }, []) 

  return { isInitialized, showOnboarding, completeOnboarding, setShowOnboarding }
}
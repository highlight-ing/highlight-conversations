'use client'

import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow'
import OnboardingTooltips from '@/components/Onboarding/OnboardingTooltips'
import { useAppInitialization } from '@/hooks/useAppInitialization'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import { useConversations } from '@/contexts/ConversationContext'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useAmplitude } from '@/hooks/useAmplitude'
import { useOnboarding } from '@/hooks/useOnboarding'
import { ConversationLayout } from '@/components/Conversations/ConversationLayout'
import { saveHasSeenOnboarding, getHasSeenOnboarding } from '@/services/highlightService'

const DEBUG_ONBOARDING = process.env.NEXT_PUBLIC_DEBUG_ONBOARDING === 'true'

const MainPageContent: React.FC = () => {
  const { isInitialized, showOnboarding, setShowOnboarding } = useAppInitialization(DEBUG_ONBOARDING)
  const { isAudioPermissionEnabled, toggleAudioPermission } = useAudioPermission()
  const { autoSaveTime } = useConversations()
  const { trackEvent } = useAmplitude()
  const { showOnboardingTooltips, tooltipsReady, handleTooltipsComplete } = useOnboarding()

  const [searchQuery, setSearchQuery] = useState('')

  const handleOnboardingComplete = useCallback(async () => {
    await saveHasSeenOnboarding(true)
    setShowOnboarding(false)
    trackEvent('Onboarding Flow Complete', {})
  }, [setShowOnboarding, trackEvent])

  if (!isInitialized || isAudioPermissionEnabled === null) {
    return null
  }

  // if (showOnboarding) {
  //   return <OnboardingFlow onComplete={handleOnboardingComplete} />
  // }

  return (
    <div className="flex max-h-screen min-h-screen flex-col overflow-hidden">
      <main className="flex-grow p-4">
        <AnimatePresence>
          <ConversationLayout />
        </AnimatePresence>
      </main>
      {showOnboardingTooltips && tooltipsReady && (
        <OnboardingTooltips
          autoSaveSeconds={autoSaveTime}
          onComplete={() => {
            handleTooltipsComplete()
            trackEvent('Onboarding Tooltips Complete', {})
          }}
        />
      )}
    </div>
  )
}

const MainPage: React.FC = () => {
  return (
    <ConversationProvider>
      <MainPageContent />
    </ConversationProvider>
  )
}

export default MainPage

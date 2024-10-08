'use client'
import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import AudioPermissionDialog from '@/components/Dialogue/AudioPermissionDialog'
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow"
import OnboardingTooltips from '@/components/Onboarding/OnboardingTooltips'
import { useAppInitialization } from '@/hooks/useAppInitialization'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import { useConversations } from '@/contexts/ConversationContext'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useAmplitude } from '@/hooks/useAmplitude'
import { useOnboarding } from '@/hooks/useOnboarding'
import SearchBar from '@/components/Search/SearchBar'
import SearchResultsSummary from '@/components/Search/SearchResultsSummary'
import ConversationGrid from '@/components/Card/ConversationGrid'
import { saveHasSeenOnboarding, getHasSeenOnboarding } from '@/services/highlightService'
import EnhancedSearchBar from '@/components/Search/EnhancedSearchBar'

const DEBUG_ONBOARDING = process.env.NEXT_PUBLIC_DEBUG_ONBOARDING === 'true'

const MainPageContent: React.FC = () => {
  const { isInitialized, showOnboarding, setShowOnboarding } = useAppInitialization(DEBUG_ONBOARDING)
  const { isAudioPermissionEnabled, toggleAudioPermission } = useAudioPermission()
  const { filteredConversations, autoSaveTime } = useConversations()
  const { trackEvent } = useAmplitude()
  const { showOnboardingTooltips, tooltipsReady, handleTooltipsComplete } = useOnboarding()

  const [searchQuery, setSearchQuery] = useState("")

  const handleOnboardingComplete = useCallback(async () => {
    await saveHasSeenOnboarding(true)
    setShowOnboarding(false)
    trackEvent('Onboarding Flow Complete', {})
  }, [setShowOnboarding, trackEvent])

  if (!isInitialized || isAudioPermissionEnabled === null) {
    return null
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto w-full"> {/* Add this container */}
          <EnhancedSearchBar />
          {searchQuery && (
            <SearchResultsSummary count={filteredConversations.length} />
          )}
          <AnimatePresence>
            <ConversationGrid />
          </AnimatePresence>
        </div>
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
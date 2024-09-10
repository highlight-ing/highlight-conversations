'use client'
// 

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import AudioPermissionDialog from '@/components/Dialogue/AudioPermissionDialog'
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow"
import OnboardingTooltips from '@/components/Onboarding/OnboardingTooltips'
import { useAppInitialization } from '@/hooks/useAppInitialization'
import { useAudioPermission } from '@/hooks/useAudioPermission'
import { useConversations } from '@/contexts/ConversationContext'
import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useAmplitude } from '@/hooks/useAmplitude'
import { useOnboarding } from '@/hooks/useOnboarding'
import SearchBar from '@/components/Search/SearchBar'
import SearchResultsSummary from '@/components/Search/SearchResultsSummary'
import ConversationGrid from '@/components/Card/ConversationGrid'

const DEBUG_ONBOARDING = process.env.NEXT_PUBLIC_DEBUG_ONBOARDING === 'true'

const MainPageContent: React.FC = () => {
  const { isInitialized, showOnboarding, conversations: initialConversations } = useAppInitialization(DEBUG_ONBOARDING);
  const { isAudioPermissionEnabled, toggleAudioPermission } = useAudioPermission();
  const { conversations, addConversation, deleteConversation, updateConversation, filteredConversations, currentConversation, micActivity, handleSave } = useConversations();
  const { autoSaveValue } = useAppSettings();
  const { trackEvent } = useAmplitude();
  const { showOnboardingTooltips, tooltipsReady, handleOnboardingComplete, handleTooltipsComplete } = useOnboarding();

  const [searchQuery, setSearchQuery] = useState("");

  if (!isInitialized || isAudioPermissionEnabled === null) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => {
      handleOnboardingComplete();
      trackEvent('Onboarding Flow Complete', {});
    }} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AudioPermissionDialog 
        isAudioPermissionGranted={isAudioPermissionEnabled} 
        onTogglePermission={toggleAudioPermission}
      />
      <Header />
      <main className="flex-grow p-4">
        <SearchBar />
        {searchQuery && (
          <SearchResultsSummary count={filteredConversations.length} />
        )}
        <AnimatePresence>
          <ConversationGrid
            currentConversation={currentConversation}
            conversations={filteredConversations}
            micActivity={micActivity}
            isAudioEnabled={isAudioPermissionEnabled}
            autoSaveTime={autoSaveValue}
            onDeleteConversation={deleteConversation}
            onSave={handleSave}
            onUpdate={updateConversation}
            searchQuery={searchQuery}
            isAudioPermissionEnabled={isAudioPermissionEnabled}
          />
        </AnimatePresence>
      </main>
      {showOnboardingTooltips && tooltipsReady && (
        <OnboardingTooltips 
          autoSaveSeconds={autoSaveValue} 
          onComplete={() => {
            handleTooltipsComplete();
            trackEvent('Onboarding Tooltips Complete', {});
          }} 
        />
      )}
    </div>
  )
}

const MainPage: React.FC = () => {
  return (
    <AppSettingsProvider>
      <ConversationProvider>
        <MainPageContent />
      </ConversationProvider>
    </AppSettingsProvider>
  )
}

export default MainPage
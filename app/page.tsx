'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import AudioPermissionDialog from '@/components/Dialogue/AudioPermissionDialog'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import SearchResultsSummary from '@/components/Search/SearchResultsSummary'
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow"
import OnboardingTooltips from '@/components/Onboarding/OnboardingTooltips';
import { useAppInitialization } from './hooks/useAppInitialization'
import { useAudioPermission } from './hooks/useAudioPermission'
import { useConversationManagement } from './hooks/useConversationManagement'
import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { useAmplitude } from '@/hooks/useAmplitude'
import { useOnboarding } from '@/hooks/useOnboarding'

const DEBUG_ONBOARDING = process.env.NEXT_PUBLIC_DEBUG_ONBOARDING === 'true'

const MainPageContent: React.FC = () => {
  const { showOnboarding, conversations: initialConversations, isInitialized } = useAppInitialization(DEBUG_ONBOARDING);
  const { isAudioPermissionEnabled, toggleAudioPermission } = useAudioPermission();
  const { conversations, addConversation, deleteConversation, updateConversation } = useConversationManagement(initialConversations);
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

  const filteredConversations = conversations.filter(conversation => {
    const matchTranscript = conversation.transcript.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSummary = conversation.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTranscript || matchSummary;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <AudioPermissionDialog 
        isAudioPermissionGranted={isAudioPermissionEnabled} 
        onTogglePermission={toggleAudioPermission}
      />
      <Header />
      <main className="flex-grow p-4">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchQuery && (
          <SearchResultsSummary count={filteredConversations.length} />
        )}
        <AnimatePresence>
          <ConversationsManager
            conversations={filteredConversations}
            idleThreshold={autoSaveValue}
            isAudioPermissionEnabled={isAudioPermissionEnabled}
            searchQuery={searchQuery}
            autoSaveTime={autoSaveValue}
            addConversation={addConversation}
            onDeleteConversation={deleteConversation}
            onUpdateConversation={updateConversation}
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
  );
};

const MainPage: React.FC = () => {
  return (
    <AppSettingsProvider>
      <ConversationProvider>
        <MainPageContent />
      </ConversationProvider>
    </AppSettingsProvider>
  );
};

export default MainPage;
'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header/Header'
import ConversationsManager from '@/components/ConversationManager/ConversationManager'
import { ConversationData, defaultConversation } from '@/data/conversations'
import {
  requestBackgroundPermission,
  getAudioSuperPowerEnabled,
  addAudioPermissionListener,
  requestAudioPermissionEvents,
  migrateFromLocalStorageToAppStorage,
  saveNumberInAppStorage,
  saveBooleanInAppStorage,
  getNumberFromAppStorage,
  getBooleanFromAppStorage,
  saveConversationsInAppStorage,
  getConversationsFromAppStorage,
  deleteAllConversationsInAppStorage,
  AUTO_CLEAR_VALUE_KEY,
  AUTO_SAVE_SEC_KEY,
  AUDIO_ENABLED_KEY,
  HAS_SEEN_ONBOARDING_KEY,
} from '@/services/highlightService'
import { minutesDifference, daysDifference } from '@/utils/dateUtils'
import { 
  AUTO_SAVE_SEC, 
  AUTO_CLEAR_DAYS,
  ONBOARDING_HEADER,
  ONBOARDING_SEARCH,
} from '@/constants/appConstants'
import AudioPermissionDialog from '@/components/Dialogue/AudioPermissionDialog'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import SearchResultsSummary from '@/components/Search/SearchResultsSummary'
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow"
import OnboardingTooltips from '@/components/Onboarding/OnboardingTooltips';
import { initAmplitude, trackEvent } from '../lib/amplitude';
import debounce from 'lodash.debounce'

// TODO: - set to false or remove for production
const IS_TEST_MODE = false
const AUTO_CLEAR_POLL = 60000

const clearOldConversations = (
  conversations: ConversationData[],
  autoClearValue: number,
  isTestMode: boolean
): ConversationData[] => {
  if (!conversations || conversations.length === 0) {
    return []
  }

  const now = new Date()

  return conversations.filter((conversation) => {
    const conversationDate = new Date(conversation.timestamp)

    const diff = isTestMode ? minutesDifference(conversationDate, now) : daysDifference(conversationDate, now)

    const shouldKeep = diff < autoClearValue

    return shouldKeep
  })
}

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState<number>(AUTO_CLEAR_DAYS)
  const [micActivity, setMicActivity] = useState(0)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true)
  const [idleTimerValue, setIdleTimerValue] = useState(AUTO_SAVE_SEC)
  const [isSleeping, setIsSleeping] = useState(false)
  const isInitialMount = useRef(true)
  const [isAudioPermissionEnabled, setIsAudioPermissionEnabled] = useState<boolean | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showOnboardingTooltips, setShowOnboardingTooltips] = useState(false)
  const [tooltipsReady, setTooltipsReady] = useState(false);
  //MARK: Set this to false when in production!
  const [debugOnboarding, setDebugOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const matchTranscript = conversation.transcript.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSummary = conversation.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTranscript || matchSummary;
    });
  }, [conversations, searchQuery])

  useEffect(() => {
    initAmplitude()
  }, [])

  // useEffect(() => {
  //   requestBackgroundPermission()
  // }, [])
  
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      // Perform migration
      await migrateFromLocalStorageToAppStorage()
      // Initialize audio state
      await initializeAudioSuperPower();
      await initializeAudioEnabled();
      await requestAudioPermissionEvents()

      // Load values from AppStorage
      const storedAutoClearValue = await getNumberFromAppStorage(AUTO_CLEAR_VALUE_KEY, AUTO_CLEAR_DAYS);
      const storedIdleTimerValue = await getNumberFromAppStorage(AUTO_SAVE_SEC_KEY, AUTO_SAVE_SEC);
      const hasSeenOnboarding = await getBooleanFromAppStorage(HAS_SEEN_ONBOARDING_KEY, false);
      setAutoClearValue(storedAutoClearValue);
      setIdleTimerValue(storedIdleTimerValue);
      setShowOnboarding(!hasSeenOnboarding || debugOnboarding);
      setOnboardingComplete(hasSeenOnboarding && !debugOnboarding);

      // Load conversations
      let storedConversations = await getConversationsFromAppStorage();
      
      // If there are no conversations and it's the first time (showOnboarding is true),
      // add a default conversation
      if (storedConversations.length === 0 && (!hasSeenOnboarding || debugOnboarding)) {
        storedConversations = [defaultConversation];
        await saveConversationsInAppStorage(storedConversations);
      }
      
      setConversations(storedConversations);
      setIsInitialized(true)

      // Set up audio permission listener
      const removeListener = addAudioPermissionListener((event: 'locked' | 'detect' | 'attach') => {
        console.log('Audio permission update:', event);
        const newPermissionState = event === 'attach';
        setIsAudioPermissionEnabled(newPermissionState);
        console.log('New audio permission state:', newPermissionState);
      });

      // // Clean up function
      // return () => {
      //   removeListener();
      // };
    }

    initializeApp()
  }, [debugOnboarding])

  const initializeAudioSuperPower = async () => {
    const audioPermission = await getAudioSuperPowerEnabled();
    console.log('Initial audio permission:', audioPermission);
    setIsAudioPermissionEnabled(audioPermission);
  };

  const initializeAudioEnabled = async () => {
    const audioEnabled = await getBooleanFromAppStorage(AUDIO_ENABLED_KEY, true);
    console.log('Audio enabled:', audioEnabled);
    setIsAudioEnabled(audioEnabled);
  };

  // Save conversations to AppStorage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    saveConversationsInAppStorage(conversations)
  }, [conversations])

  useEffect(() => {
    const clearConversations = () => {
      const updatedConversations = clearOldConversations(conversations, autoClearValue, IS_TEST_MODE)
      if (updatedConversations.length !== conversations.length) {
        setConversations(updatedConversations)
      }
    }

    clearConversations() // Clear on load

    const intervalId = setInterval(clearConversations, AUTO_CLEAR_POLL)
    return () => clearInterval(intervalId)
  }, [conversations, autoClearValue])

  const handleAudioToggle = async (isOn: boolean) => {
    setIsAudioEnabled(isOn)
    await saveBooleanInAppStorage(AUDIO_ENABLED_KEY, isOn)
  }

  const handleMicActivityChange = (activity: number) => {
    setMicActivity(activity)
  }

  const handleAutoClearValueChange = async (value: number): Promise<void> => {
    setAutoClearValue(value)
    await saveNumberInAppStorage(AUTO_CLEAR_VALUE_KEY, value)
    trackEvent('Conversations Interaction', {
      action: 'Auto Clear Value Change',
      value: value
    });
  }

  const handleAutoSaveChange = async (value: number) => {
    setIdleTimerValue(value)
    await saveNumberInAppStorage(AUTO_SAVE_SEC_KEY, value)
    trackEvent('Conversations Interaction', {
      action: 'Auto Save Change',
      value: value
    });
  }
  const handleUpdateConversation = (updatedConversation: ConversationData) => {
    setConversations((prevConversations) => {
      const index = prevConversations.findIndex((conv) => conv.id === updatedConversation.id)
      const updatedConversations = [...prevConversations]
      updatedConversations[index] = updatedConversation
      return updatedConversations
    })
  }

  const handleDeleteAllConversations = async () => {
    setConversations([])
    await deleteAllConversationsInAppStorage()
  }

  const addConversation = useCallback(async (newConversation: Omit<ConversationData, 'timestamp'>) => {
    const conversationWithCurrentTimestamp = {
      ...newConversation,
      timestamp: new Date()
    };
    setConversations((prevConversations) => {
      const updatedConversations = [conversationWithCurrentTimestamp, ...prevConversations];
      saveConversationsInAppStorage(updatedConversations);
      return updatedConversations;
    })
    trackEvent('Conversations Interaction', {
      action: 'Conversation Added'
    });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.filter((conv) => conv.id !== id)
      saveConversationsInAppStorage(updatedConversations)
      return updatedConversations
    })
    trackEvent('Conversations Interaction', {
      action: 'Conversation Deleted'
    });
  }, [])

  useEffect(() => {
    console.log('isAudioPermissionEnabled updated:', isAudioPermissionEnabled);
  }, [isAudioPermissionEnabled]);

  const handleOnboardingComplete = () => {
    trackEvent('Conversations Interaction', {
      action: 'Onboarding Flow Complete',
    });
    setShowOnboarding(false);
    setShowOnboardingTooltips(true);
  };

  const handleTooltipsComplete = async () => {
    setShowOnboardingTooltips(false);
    await saveBooleanInAppStorage(HAS_SEEN_ONBOARDING_KEY, true);
    setOnboardingComplete(true);
    trackEvent('Conversations Interaction', {
      action: 'Onboarding Tooltips Complete',
    });
  };

  useEffect(() => {
    if (showOnboardingTooltips) {
      // Delay tooltip rendering slightly to ensure DOM is ready
      const timer = setTimeout(() => {
        setTooltipsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showOnboardingTooltips]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
  };

  const debouncedTrackSearchEvent = useMemo(
    () =>
      debounce((query: string) => {
        trackEvent('Conversations Interaction', {
          action: 'Search Query Change',
          query: query
        });
      }, 500), // 500ms debounce time
    []
  );

  useEffect(() => {
    debouncedTrackSearchEvent(searchQuery);
    return () => {
      debouncedTrackSearchEvent.cancel();
    };
  }, [searchQuery, debouncedTrackSearchEvent]);

  useEffect(() => {
    if (onboardingComplete) {
      requestBackgroundPermission()
    }
  }, [onboardingComplete])

  if (!isInitialized) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isAudioPermissionEnabled !== null && (
        <AudioPermissionDialog isAudioPermissionGranted={isAudioPermissionEnabled} />
      )}
      <div id={`${ONBOARDING_HEADER}`}>
        <Header
          autoClearValue={autoClearValue}
          autoSaveValue={idleTimerValue}
          isAudioOn={isAudioEnabled ?? false}
          onDeleteAllConversations={handleDeleteAllConversations}
          onAutoClearValueChange={handleAutoClearValueChange}
          onAudioSwitch={handleAudioToggle}
          onAutoSaveChange={handleAutoSaveChange}
        />
      </div>
      <main className="flex-grow p-4">
        <div id={`${ONBOARDING_SEARCH}`} className="relative mb-4">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
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
            idleThreshold={idleTimerValue}
            isAudioEnabled={isAudioEnabled}
            isSleeping={isSleeping}
            searchQuery={searchQuery}
            onMicActivityChange={handleMicActivityChange}
            addConversation={addConversation}
            onDeleteConversation={deleteConversation}
            onUpdateConversation={handleUpdateConversation}
          />
        </AnimatePresence>
      </main>
      {showOnboardingTooltips && tooltipsReady && <OnboardingTooltips onComplete={handleTooltipsComplete} />}
    </div>
  )
}

export default MainPage
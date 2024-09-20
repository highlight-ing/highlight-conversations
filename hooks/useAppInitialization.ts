import { useState, useEffect, useCallback } from 'react';
import { migrateFromLocalStorageToAppStorage, getBooleanFromAppStorage, getConversationsFromAppStorage, saveConversationsInAppStorage } from '@/services/highlightService';
import { defaultConversation } from '@/data/conversations';
import { HAS_SEEN_ONBOARDING_KEY } from '@/services/highlightService';
import { initAmplitude, trackEvent } from '@/lib/amplitude';
import { getUserId } from '@/utils/userUtils';
import { getHasSeenOnboarding } from '@/services/highlightService';

export const useAppInitialization = (debugOnboarding: boolean) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      const hasSeenOnboarding = await getHasSeenOnboarding();
      setShowOnboarding(!hasSeenOnboarding || debugOnboarding);
      // Initialize Amplitude
      try {
        const userId = await getUserId();
        if (userId) {
          initAmplitude(userId);
          trackEvent('App Initialized', { userId });
        } else {
          const fallbackId = 'anonymous_' + Math.random().toString(36).slice(2, 9);
          initAmplitude(fallbackId);
          trackEvent('App Initialized', { fallbackId, error: 'Failed to get userId' });
        }
      } catch (error) {
        console.error('Failed to initialize Amplitude:', error);
        const fallbackId = `anonymous_${Math.random().toString(36).slice(2, 9)}`;
        initAmplitude(fallbackId);
        trackEvent('App Initialized', { fallbackId, error: 'Failed to get userId' });
      }

      // Load conversations
      let storedConversations = await getConversationsFromAppStorage();

      // If there are no conversations and it's the first time, add a default conversation
      if (storedConversations.length === 0 && (!hasSeenOnboarding || debugOnboarding)) {
        storedConversations = [defaultConversation];
        await saveConversationsInAppStorage(storedConversations);
      }

      setConversations(storedConversations);
      setIsInitialized(true);
    };

    initialize();
  }, [debugOnboarding]);

  const completeOnboarding = useCallback(async () => {
    await saveHasSeenOnboarding(true);
    setShowOnboarding(false);
  }, []);

  return { isInitialized, showOnboarding, conversations, completeOnboarding, setShowOnboarding };
};
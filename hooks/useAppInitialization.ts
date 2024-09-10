import { useState, useEffect } from 'react';
import { migrateFromLocalStorageToAppStorage, getBooleanFromAppStorage, getConversationsFromAppStorage, saveConversationsInAppStorage } from '@/services/highlightService';
import { defaultConversation } from '@/data/conversations';
import { HAS_SEEN_ONBOARDING_KEY } from '@/constants/appConstants';
import { initAmplitude, trackEvent } from '@/lib/amplitude';
import { getUserId } from '@/utils/userUtils';

export const useAppInitialization = (debugOnboarding: boolean) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');

      // Perform migration
      await migrateFromLocalStorageToAppStorage();

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

      // Check onboarding status
      const hasSeenOnboarding = await getBooleanFromAppStorage(HAS_SEEN_ONBOARDING_KEY, false);
      setShowOnboarding(!hasSeenOnboarding || debugOnboarding);

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

    initializeApp();
  }, [debugOnboarding]);

  return { isInitialized, showOnboarding, conversations };
};
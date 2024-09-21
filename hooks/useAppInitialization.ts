import { useState, useEffect, useCallback } from 'react';
import { initAmplitude, trackEvent } from '@/lib/amplitude';
import { getUserId } from '@/utils/userUtils';
import { getHasSeenOnboarding, saveHasSeenOnboarding } from '@/services/highlightService';

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
import { useState, useEffect } from 'react';
import { saveBooleanInAppStorage, HAS_SEEN_ONBOARDING_KEY } from '@/services/highlightService';
import { requestBackgroundPermission } from '@/services/highlightService';

export const useOnboarding = () => {
  const [showOnboardingTooltips, setShowOnboardingTooltips] = useState(false);
  const [tooltipsReady, setTooltipsReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboardingTooltips(true);
  };

  const handleTooltipsComplete = async () => {
    setShowOnboardingTooltips(false);
    await saveBooleanInAppStorage(HAS_SEEN_ONBOARDING_KEY, true);
    setOnboardingComplete(true);
  };

  useEffect(() => {
    if (showOnboardingTooltips) {
      const timer = setTimeout(() => {
        setTooltipsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showOnboardingTooltips]);

  useEffect(() => {
    if (onboardingComplete) {
      requestBackgroundPermission();
    }
  }, [onboardingComplete]);

  return {
    showOnboardingTooltips,
    tooltipsReady,
    handleOnboardingComplete,
    handleTooltipsComplete,
  };
};
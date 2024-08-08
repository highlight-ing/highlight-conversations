// components/Onboarding/OnboardingTooltips.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ONBOARDING_HEADER,
    ONBOARDING_SEARCH,
    ONBOARDING_CURRENT_CARD,
    ONBOARDING_SAVED_CARD
} from "@/constants/appConstants"
import { trackEvent } from '@/lib/amplitude';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingTooltipsProps {
  onComplete: () => void;
}

const OnboardingTooltips: React.FC<OnboardingTooltipsProps> = ({ onComplete }) => {
  const [currentTooltip, setCurrentTooltip] = useState(0);

  const tooltips = useMemo(() => [
    { id: ONBOARDING_HEADER, content: 'Adjust settings like audio input, auto-save, and auto-clear here.' },
    { id: ONBOARDING_SEARCH, content: 'Search through your conversations to find specific conversations.' },
    { id: ONBOARDING_CURRENT_CARD, content: 'This is the live feed of your transcriptions. The border animates to show audio input. Conversations will use both your microphone and system audio to generate transcriptions. You can manually save and copy the current conversation once there is text available.' },
    { id: ONBOARDING_SAVED_CARD, content: 'View, copy, delete, or prompt with Highlight your saved conversations here.' },
  ], []);

  const addHighlight = useCallback((element: HTMLElement) => {
    if (element.id === ONBOARDING_CURRENT_CARD) {
      element.classList.add('shadow-[0_0_0_4px_rgba(var(--brand-rgb),0.5)]');
    } else {
      element.classList.add('border-4', 'border-brand');
    }
    element.classList.add('rounded-lg', 'transition-all', 'duration-300');
  }, []);

  const removeHighlight = useCallback(() => {
    const previousElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (previousElement) {
      previousElement.classList.remove(
        'border-4', 'border-brand', 
        'shadow-[0_0_0_4px_rgba(var(--brand-rgb),0.5)]',
        'rounded-lg', 'transition-all', 'duration-300'
      );
    }
  }, [currentTooltip, tooltips]);

  const handleNextTooltip = useCallback(() => {
    removeHighlight();
    if (currentTooltip < tooltips.length - 1) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      onComplete();
    }
  }, [currentTooltip, tooltips, removeHighlight, onComplete]);

  useEffect(() => {
    const targetElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addHighlight(targetElement);
    }

    return () => removeHighlight();
  }, [currentTooltip, tooltips, removeHighlight, addHighlight]);

  useEffect(() => {
    trackEvent('Conversations Interaction', {
      action: 'Onboarding Tooltips Started',
    });
  }, []);

  const currentTooltipData = tooltips[currentTooltip];
  const targetElement = document.getElementById(`${currentTooltipData.id}`);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  let tooltipStyle = {};

  if (currentTooltipData.id === ONBOARDING_CURRENT_CARD) {
    tooltipStyle = {
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.right + window.scrollX + 10}px`,
    };
  } else if (currentTooltipData.id === ONBOARDING_SAVED_CARD) {
    tooltipStyle = {
      top: `${rect.top + window.scrollY}px`,
      right: `${window.innerWidth - rect.left + window.scrollX + 10}px`,
      left: 'auto', // Reset left positioning
    };
  } else {
    tooltipStyle = {
      top: `${rect.bottom + window.scrollY + 10}px`,
      left: `${rect.left + window.scrollX}px`,
    };
  }

  const getOverlayStyle = useCallback(() => {
    const targetElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();
    return {
      clipPath: `polygon(
        0% 0%,
        0% 100%,
        ${rect.left}px 100%,
        ${rect.left}px ${rect.top}px,
        ${rect.right}px ${rect.top}px,
        ${rect.right}px ${rect.bottom}px,
        ${rect.left}px ${rect.bottom}px,
        ${rect.left}px 100%,
        100% 100%,
        100% 0%
      )`
    };
  }, [currentTooltip, tooltips]);

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={getOverlayStyle()}
        />
      </AnimatePresence>
      <div className="relative w-full h-full pointer-events-none">
        <Card 
          className="absolute max-w-sm pointer-events-auto"
          style={tooltipStyle}
        >
          <CardContent className="pt-6">
            <p>{currentTooltipData.content}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNextTooltip} className="mt-2 bg-brand text-background">
              {currentTooltip < tooltips.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingTooltips;
// components/Onboarding/OnboardingTooltips.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ONBOARDING_CURRENT_CARD,
    ONBOARDING_SAVED_CARD
} from "@/constants/appConstants"
import { useAmplitude } from '@/hooks/useAmplitude';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingTooltipsProps {
  autoSaveSeconds: number
  onComplete: () => void
}

const OnboardingTooltips: React.FC<OnboardingTooltipsProps> = ({ autoSaveSeconds, onComplete }) => {
  const { trackEvent } = useAmplitude()
  const [currentTooltip, setCurrentTooltip] = useState(0);
  const [overlayStyle, setOverlayStyle] = useState({});
  const [tooltipStyle, setTooltipStyle] = useState({});

  const tooltips = useMemo(() => [
    // { id: ONBOARDING_HEADER, content: 'Adjust settings like audio input, auto-save, and auto-clear here.' },
    // { id: ONBOARDING_SEARCH, content: 'Search through your conversations to find specific conversations.' },
    { id: ONBOARDING_CURRENT_CARD, content: `This is your current transcript. It will automatically save after ${autoSaveSeconds} seconds of silence, but you can click to save it at any point.` },
    // { id: ONBOARDING_SAVED_CARD, content: 'View, copy, delete, or prompt with Highlight your saved conversations here.' },
  ], [autoSaveSeconds]);

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

  const updatePositioning = useCallback(() => {
    const targetElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (!targetElement) {
      setOverlayStyle({});
      setTooltipStyle({});
      return;
    }

    const rect = targetElement.getBoundingClientRect();

    setOverlayStyle({
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
    });

    let newTooltipStyle = {};
    if (tooltips[currentTooltip].id === ONBOARDING_CURRENT_CARD) {
      newTooltipStyle = {
        top: `${rect.top}px`,
        left: `${rect.right + 10}px`,
      };
    } else if (tooltips[currentTooltip].id === ONBOARDING_SAVED_CARD) {
      newTooltipStyle = {
        top: `${rect.top}px`,
        right: `${window.innerWidth - rect.left + 10}px`,
        left: 'auto',
      };
    } else {
      newTooltipStyle = {
        top: `${rect.bottom + 10}px`,
        left: `${rect.left}px`,
      };
    }
    setTooltipStyle(newTooltipStyle);
  }, [currentTooltip, tooltips]);

  useEffect(() => {
    updatePositioning();
    window.addEventListener('resize', updatePositioning);
    window.addEventListener('scroll', updatePositioning);

    return () => {
      window.removeEventListener('resize', updatePositioning);
      window.removeEventListener('scroll', updatePositioning);
    };
  }, [updatePositioning]);

  useEffect(() => {
    trackEvent('Onboarding Tooltips Started', {});
  }, [trackEvent]);

  const currentTooltipData = tooltips[currentTooltip];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={overlayStyle}
        />
      </AnimatePresence>
      <div className="fixed inset-0 pointer-events-none">
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
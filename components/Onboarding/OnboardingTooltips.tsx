// components/Onboarding/OnboardingTooltips.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ONBOARDING_HEADER,
    ONBOARDING_SEARCH,
    ONBOARDING_CURRENT_CARD,
    ONBOARDING_SAVED_CARD
} from "@/constants/appConstants"

interface OnboardingTooltipsProps {
  onComplete: () => void;
}

const OnboardingTooltips: React.FC<OnboardingTooltipsProps> = ({ onComplete }) => {
  const [currentTooltip, setCurrentTooltip] = useState(0);

  const tooltips = useMemo(() => [
    { id: ONBOARDING_HEADER, content: 'Adjust settings like audio input, auto-save, and auto-clear here.' },
    { id: ONBOARDING_SEARCH, content: 'Search through your transcripts to find specific conversations.' },
    { id: ONBOARDING_CURRENT_CARD, content: 'This is the live feed of your transcriptions. The border animates to show audio input.' },
    { id: ONBOARDING_SAVED_CARD, content: 'View, copy, or delete your saved conversations here.' },
  ], []);

  const handleNextTooltip = () => {
    removeHighlight();
    if (currentTooltip < tooltips.length - 1) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      onComplete();
    }
  };

  const addHighlight = (element: HTMLElement) => {
    if (element.id === ONBOARDING_CURRENT_CARD) {
      element.classList.add('ring-4', 'ring-brand', 'ring-opacity-50');
    } else {
      element.classList.add('border-4', 'border-brand');
    }
    element.classList.add('rounded-lg', 'transition-all', 'duration-300');
  };

  const removeHighlight = () => {
    const previousElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (previousElement) {
      previousElement.classList.remove(
        'border-4', 'border-brand', 'ring-4', 'ring-brand', 'ring-opacity-50',
        'rounded-lg', 'transition-all', 'duration-300'
      );
    }
  };

  useEffect(() => {
    const targetElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addHighlight(targetElement);
    }

    return () => removeHighlight();
  }, [currentTooltip, tooltips]);

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
    const firstSavedCard = document.querySelector(`#${ONBOARDING_SAVED_CARD}`);
    if (firstSavedCard) {
      const firstSavedCardRect = firstSavedCard.getBoundingClientRect();
      tooltipStyle = {
        top: `${firstSavedCardRect.top + window.scrollY}px`,
        left: `${firstSavedCardRect.right + window.scrollX + 10}px`,
      };
    }
  } else {
    tooltipStyle = {
      top: `${rect.bottom + window.scrollY + 10}px`,
      left: `${rect.left + window.scrollX}px`,
    };
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="relative w-full h-full">
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
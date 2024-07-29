// components/Onboarding/OnboardingTooltips.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    if (currentTooltip < tooltips.length - 1) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const targetElement = document.getElementById(`${tooltips[currentTooltip].id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTooltip, tooltips]);

  return (
    <TooltipProvider>
      {tooltips.map((tooltip, index) => {
        const targetElement = document.getElementById(`${tooltip.id}`);
        return (
          <Tooltip key={tooltip.id} open={currentTooltip === index}>
            <TooltipTrigger asChild>
              {targetElement ? <div className="absolute inset-0" style={{
                top: targetElement.offsetTop,
                left: targetElement.offsetLeft,
                width: targetElement.offsetWidth,
                height: targetElement.offsetHeight,
              }} /> : <div />}
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="max-w-sm">
              <p>{tooltip.content}</p>
              <Button onClick={handleNextTooltip} className="mt-2 bg-brand text-background">
                {index < tooltips.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
};

export default OnboardingTooltips;
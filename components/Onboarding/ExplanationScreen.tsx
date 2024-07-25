import React from 'react'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ExplanationScreenProps = {
    onNext: () => void;
};

export const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ onNext }) => {
    const [currentTooltip, setCurrentTooltip] = useState(0);

  const tooltips = [
    { id: 'currentConversation', content: 'This is the live feed of your transcriptions. The border animates to show audio input.' },
    { id: 'savedConversations', content: 'View, copy, or delete your saved conversations here.' },
    { id: 'header', content: 'Adjust settings like microphone input and auto-save here.' },
    { id: 'search', content: 'Search through your transcripts to find specific conversations.' },
  ];

  const handleNextTooltip = () => {
    if (currentTooltip < tooltips.length - 1) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-background p-4 rounded-lg shadow-lg">
        {/* Simplified mock-up of your main interface */}
        <div className="mb-4 p-2 border border-foreground-muted rounded-lg">
          <TooltipProvider>
            <Tooltip open={currentTooltip === 0}>
              <TooltipTrigger asChild>
                <div className="h-20 bg-foreground-muted">Current Conversation</div>
              </TooltipTrigger>
              <TooltipContent>{tooltips[0].content}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <TooltipProvider key={i}>
              <Tooltip open={currentTooltip === 1}>
                <TooltipTrigger asChild>
                  <div className="h-16 bg-foreground-muted">Saved Conversation</div>
                </TooltipTrigger>
                <TooltipContent>{tooltips[1].content}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <TooltipProvider>
          <Tooltip open={currentTooltip === 2}>
            <TooltipTrigger asChild>
              <div className="h-10 bg-foreground-muted mb-4">Header</div>
            </TooltipTrigger>
            <TooltipContent>{tooltips[2].content}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip open={currentTooltip === 3}>
            <TooltipTrigger asChild>
              <div className="h-8 bg-foreground-muted">Search</div>
            </TooltipTrigger>
            <TooltipContent>{tooltips[3].content}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button onClick={handleNextTooltip} className="mt-8 bg-brand text-background">
        {currentTooltip < tooltips.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
};

export default ExplanationScreen;
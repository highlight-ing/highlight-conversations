import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type InfoTooltipType = "AUDIO_SWITCH" | "AUTO_CLEAR" | "AUTO_SAVE"

interface InfoTooltipProps {
  content: string
  type: InfoTooltipType
  children: React.ReactNode
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, type, children }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line text-white bg-muted-foreground/20 backdrop-blur-md rounded-lg shadow-lg p-2">
          <p className='font-regular'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IoInformationCircleOutline } from 'react-icons/io5';

export type InfoTooltipType = "AUDIO_SWITCH" | "AUTO_CLEAR" | "AUTO_SAVE"

interface InfoTooltipProps {
  content: string
  type: InfoTooltipType
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, type }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <IoInformationCircleOutline className={`text-muted-foreground hover:text-brand transition-colors ${type === 'AUDIO_SWITCH' ? 'm-0' : 'mr-2'}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line text-white bg-muted-foreground/20 backdrop-blur-md rounded-lg shadow-lg p-2">
          <p className='font-regular'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
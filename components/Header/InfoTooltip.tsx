import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IoInformationCircleOutline } from 'react-icons/io5';

interface InfoTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <IoInformationCircleOutline className="text-muted-foreground hover:text-brand transition-colors ml-2" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line text-muted-foreground bg-background/70 backdrop-blur-md rounded-lg shadow-lg p-2">
          <p className='font-regular'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
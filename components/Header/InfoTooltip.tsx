import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IoInformationCircleOutline } from 'react-icons/io5';

interface InfoTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <IoInformationCircleOutline className="text-muted-foreground hover:text-brand transition-colors ml-2" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line text-foreground bg-background/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <p className='font-semibold'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
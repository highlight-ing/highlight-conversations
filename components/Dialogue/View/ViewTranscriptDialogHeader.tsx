import React from 'react';
import { DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton, DeleteButton, ShareButton } from "./ViewTranscriptButtons"
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { TooltipState} from '@/components/Tooltip/Tooltip'

interface ViewTranscriptDialogHeaderProps {
    title: string;
    timestamp: string;
    isSummarized?: boolean;
    onCopy: () => void;
    onDelete: () => void;
    copyState: TooltipState;
    setCopyTooltipState: (state: TooltipState) => void;
    onSummarize?: () => void;
  }
  
  const isDebug = process.env.NEXT_PUBLIC_DEBUG_SUMMARY === 'true';

  export const ViewTranscriptDialogHeader: React.FC<ViewTranscriptDialogHeaderProps> = ({
    title,
    timestamp,
    isSummarized,
    onCopy,
    onDelete,
    copyState,
    setCopyTooltipState,
    onSummarize,
  }) => (
    <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold leading-normal text-foreground">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm leading-normal text-foreground/60">
            {timestamp}
          </p>
          {isSummarized && <Badge>Summarized</Badge>}
        </div>
      </div>
      <div className="flex items-center space-x-4 mr-12">
        <CopyButton onClick={onCopy} copyState={copyState} setCopyTooltipState={setCopyTooltipState} />
        <DeleteButton onDelete={onDelete} />
        {(!isSummarized || isDebug) && (
          <>
            <div className="h-10 w-px bg-white/10" />
            <Button onClick={onSummarize} variant="outline" className="flex items-center">
              <LightningBoltIcon className="mr-2 h-4 w-4" />
              Summarize
            </Button>
          </>
        )}
      </div>
    </DialogHeader>
  );
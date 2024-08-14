import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import useScrollGradient from '@/hooks/useScrollGradient';
import { getRelativeTimeString, formatTimestamp } from '@/utils/dateUtils';
import { ConversationData} from '@/data/conversations';
import { TooltipState} from '@/components/Tooltip/Tooltip'

import { ViewTranscriptDialogHeader } from './ViewTranscriptDialogHeader';
import { ViewTranscriptSummarizedContent } from './ViewTranscriptSummarizedContent';
import { ViewTranscriptUnsummarizedContent } from './ViewTranscriptUnsummarizedContent';

export const ViewTranscriptDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    conversation: ConversationData;
    onDelete: (id: string) => void;
    onSummarize: () => void;
  }> = ({ isOpen, onClose, conversation, onDelete, onSummarize }) => {
    const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));
    const [copyTooltipState, setCopyTooltipState] = useState<TooltipState>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

    useEffect(() => {
      const timer = setInterval(() => {
        setRelativeTime(getRelativeTimeString(conversation.timestamp));
      }, 60000);
      return () => clearInterval(timer);
    }, [conversation.timestamp]);

    const handleCopyTranscript = () => {
      const clipboardContent = conversation.summarized
        ? `Topic: ${conversation.topic}\n\nSummary: ${conversation.summary}\n\nTranscript: ${conversation.transcript}`
        : conversation.transcript;
    
      navigator.clipboard
        .writeText(clipboardContent)
        .then(() => {
          setCopyTooltipState('success');
          setTimeout(() => setCopyTooltipState('hiding'), 1500);
          setTimeout(() => setCopyTooltipState('idle'), 1700);
        })
        .catch((error) => {
          console.error('Failed to copy transcript:', error);
          setCopyTooltipState('idle');
        });
    };

    const handleDeleteTranscript = () => {
      onDelete(conversation.id);
      setTimeout(() => {
        onClose();
      }, 300);
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[80vw] max-w-[1200px] h-[80vh] flex flex-col">
          <DialogTitle asChild>
            <VisuallyHidden.Root>
              {conversation.summarized ? 'View Summarized Transcript' : 'View Transcript'}
            </VisuallyHidden.Root>
          </DialogTitle>
          <ViewTranscriptDialogHeader
            title={conversation.title || relativeTime || 'Moments ago'}
            timestamp={formatTimestamp(conversation.timestamp)}
            isSummarized={conversation.summarized}
            onCopy={handleCopyTranscript}
            onDelete={handleDeleteTranscript}
            copyState={copyTooltipState}
            setCopyTooltipState={setCopyTooltipState}
            onSummarize={onSummarize}
          />
          <div className="h-px bg-foreground/10 w-full flex-shrink-0" />
          {conversation.summarized ? (
            <ViewTranscriptSummarizedContent
              summary={conversation.summary}
              transcript={conversation.transcript}
              scrollRef={scrollRef}
              showTopGradient={showTopGradient}
              showBottomGradient={showBottomGradient}
            />
          ) : (
            <ViewTranscriptUnsummarizedContent
              transcript={conversation.transcript}
              scrollRef={scrollRef}
              showTopGradient={showTopGradient}
              showBottomGradient={showBottomGradient}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };
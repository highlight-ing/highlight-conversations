import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons';
import { LightningBoltIcon } from "@radix-ui/react-icons";
import useScrollGradient from '@/hooks/useScrollGradient';
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils';
import { ConversationData, formatTranscript } from '@/data/conversations';
import { Tooltip, TooltipState, TooltipType } from '@/components/Tooltip/Tooltip'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog';

export const ViewTranscriptDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    conversation: ConversationData;
    onDelete: (id: string) => void;
    onSummarize: () => void;
  }> = ({ isOpen, onClose, conversation, onDelete, onSummarize }) => {
    const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));
    const [copyTooltipState, setCopyTooltipState] = useState<TooltipState>('idle');
  
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
    if (conversation.summarized) {
      return (
        <SummarizedViewTranscriptDialog
          isOpen={isOpen}
          conversation={conversation}
          relativeTime={relativeTime}
          copyState={copyTooltipState}
          setCopyTooltipState={setCopyTooltipState}
          onClose={onClose}
          onDelete={() => onDelete(conversation.id)}
          onCopy={handleCopyTranscript}
        />
      );
    } else {
      return (
        <UnsummarizedViewTranscriptDialog
          conversation={conversation}
          relativeTime={relativeTime}
          copyState={copyTooltipState}
          setCopyTooltipState={setCopyTooltipState}
          isOpen={isOpen}
          onClose={onClose}
          onDelete={() => onDelete(conversation.id)}
          onSummarize={onSummarize}
          onCopy={handleCopyTranscript}
        />
      );
    }
  };

  //Unsummarized Dialog
  interface UnsummarizedViewTranscriptDialogProps {
    isOpen: boolean
    conversation: ConversationData
    relativeTime: string
    copyState: TooltipState
    setCopyTooltipState: (state: TooltipState) => void
    onClose: () => void
    onDelete: () => void
    onSummarize: () => void
    onCopy: () => void
  }
  
  const UnsummarizedViewTranscriptDialog: React.FC<UnsummarizedViewTranscriptDialogProps> = ({
    isOpen,
    conversation,
    relativeTime,
    copyState,
    setCopyTooltipState,
    onClose,
    onDelete,
    onSummarize,
    onCopy
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[80vw] max-w-[1200px]">
          <DialogTitle asChild>
            <VisuallyHidden.Root>View Transcript</VisuallyHidden.Root>
          </DialogTitle>
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold leading-normal text-foreground">
                {conversation.title || relativeTime || 'Moments ago'}
              </h2>
              <p className="text-sm leading-normal text-foreground/60">
                {formatTimestamp(conversation.timestamp)}
              </p>
            </div>
            <div className="flex items-center space-x-4 mr-12">
              <CopyButton onClick={onCopy} copyState={copyState} setCopyTooltipState={setCopyTooltipState} />
              <DeleteButton onDelete={onDelete} />
              <div className="h-10 w-px bg-white/10" /> {/* Vertical divider */}
              <Button onClick={onSummarize} variant="outline" className="flex items-center">
                <LightningBoltIcon className="mr-2 h-4 w-4" />
                Summarize
              </Button>
            </div>
          </DialogHeader>
          <div className="h-px bg-white/10 my-0" /> {/* Horizontal divider */}
          <div className="relative h-[400px]"> {/* Adjust height as needed */}
            {showTopGradient && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent" />
            )}
            {showBottomGradient && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />
            )}
            <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto">
              <p className="select-text text-sm font-regular text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {formatTranscript(conversation.transcript, "DialogueTranscript")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Summarized Dialog
  interface SummarizedViewTranscriptDialogProps {
    isOpen: boolean
    conversation: ConversationData
    relativeTime: string
    copyState: TooltipState
    setCopyTooltipState: (state: TooltipState) => void
    onClose: () => void
    onDelete: () => void
    onCopy: () => void
  }
  
const SummarizedViewTranscriptDialog: React.FC<SummarizedViewTranscriptDialogProps> = ({
  isOpen,
  conversation,
  relativeTime,
  copyState,
  setCopyTooltipState,
  onClose,
  onDelete,
  onCopy
}) => {
  const transcriptScrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(transcriptScrollRef);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-[1200px] h-[80vh] flex flex-col">
        <DialogTitle asChild>
          <VisuallyHidden.Root>View Summarized Transcript</VisuallyHidden.Root>
        </DialogTitle>
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold leading-normal text-foreground">
              {conversation.title || relativeTime || 'Moments ago'}
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm leading-normal text-foreground/60">
                {formatTimestamp(conversation.timestamp)}
              </p>
              <Badge>Summarized</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4 mr-12">
            <CopyButton onClick={onCopy} copyState={copyState} setCopyTooltipState={setCopyTooltipState} />
            <DeleteButton onDelete={onDelete} />
          </div>
        </DialogHeader>
        <div className="h-px bg-foreground/10 w-full flex-shrink-0" />
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-shrink-0 mb-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Summary</h3>
            <p className="text-sm text-foreground/80">{conversation.summary}</p>
          </div>
          <div className="h-px bg-white/10 my-2 w-full flex-shrink-0" />
          <div className="flex-grow flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-2 text-foreground flex-shrink-0">Transcript</h3>
            <div className="relative flex-grow overflow-hidden">
              {showTopGradient && (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent" />
              )}
              {showBottomGradient && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />
              )}
              <div ref={transcriptScrollRef} className="scrollbar-hide absolute inset-0 overflow-y-auto">
                <p className="select-text text-sm font-regular text-foreground/60 whitespace-pre-wrap leading-relaxed">
                  {formatTranscript(conversation.transcript, "DialogueTranscript")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CopyButtonProps {
  onClick: () => void
  copyState: TooltipState
  setCopyTooltipState: (state: TooltipState) => void
}

export const CopyButton: React.FC<CopyButtonProps> = ({ onClick, copyState, setCopyTooltipState }) => (
  <div className='relative'>
    <button
      onClick={onClick}
      onMouseEnter={() => setCopyTooltipState('active')}
      onMouseLeave={() => setCopyTooltipState('idle')}
      className="text-muted-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
    >
      <ClipboardIcon width={24} height={24} />
      <Tooltip type='copy' state={copyState} />
    </button>
  </div>
);

interface DeleteButtonProps {
  onDelete: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => (
  <DeleteConversationDialog onDelete={onDelete} />
);
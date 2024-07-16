import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons';
import { LightningBoltIcon } from "@radix-ui/react-icons";
import useScrollGradient from '@/hooks/useScrollGradient';
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils';
import { ConversationData, formatTranscript } from '@/data/conversations';
import Tooltip from '@/components/Tooltip/Tooltip'
import { CopyState } from '@/types/types'

export const ViewTranscriptDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    conversation: ConversationData;
    onDelete: (id: string) => void;
    onSummarize: () => void;
  }> = ({ isOpen, onClose, conversation, onDelete, onSummarize }) => {
    const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));
    const [copyState, setCopyState] = useState<CopyState>('idle');
  
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
    
      setCopyState('copying');
      navigator.clipboard
        .writeText(clipboardContent)
        .then(() => {
          setCopyState('copied');
          setTimeout(() => setCopyState('hiding'), 1500);
          setTimeout(() => setCopyState('idle'), 1700);
        })
        .catch((error) => {
          console.error('Failed to copy transcript:', error);
          setCopyState('idle');
        });
    };
    if (conversation.summarized) {
      return (
        <SummarizedViewTranscriptDialog
          isOpen={isOpen}
          conversation={conversation}
          relativeTime={relativeTime}
          copyState={copyState}
          onClose={onClose}
          onDelete={onDelete}
          onCopy={handleCopyTranscript}
        />
      );
    } else {
      return (
        <UnsummarizedViewTranscriptDialog
          conversation={conversation}
          relativeTime={relativeTime}
          copyState={copyState}
          isOpen={isOpen}
          onClose={onClose}
          onDelete={onDelete}
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
    copyState: CopyState
    onClose: () => void
    onDelete: (id: string) => void
    onSummarize: () => void
    onCopy: () => void
  }
  
  const UnsummarizedViewTranscriptDialog: React.FC<UnsummarizedViewTranscriptDialogProps> = ({
    isOpen,
    conversation,
    relativeTime,
    copyState,
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
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold leading-normal text-white">
                {relativeTime || 'Moments ago'}
              </h2>
              <p className="text-sm leading-normal text-white/60">
                {formatTimestamp(conversation.timestamp)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <CopyButton onClick={onCopy} copyState={copyState} />
              <DeleteButton onClick={() => onDelete(conversation.id)} />
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
              <p className="select-text text-sm font-regular text-white/80 whitespace-pre-wrap leading-relaxed">
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
    copyState: CopyState
    onClose: () => void
    onDelete: (id: string) => void
    onCopy: () => void
  }
  
const SummarizedViewTranscriptDialog: React.FC<SummarizedViewTranscriptDialogProps> = ({
  isOpen,
  conversation,
  relativeTime,
  copyState,
  onClose,
  onDelete,
  onCopy
}) => {
  const transcriptScrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(transcriptScrollRef);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-[1200px] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold leading-normal text-white">
              {relativeTime || 'Moments ago'}
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm leading-normal text-white/60">
                {formatTimestamp(conversation.timestamp)}
              </p>
              <Badge>Summarized</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CopyButton onClick={onCopy} copyState={copyState} />
            <DeleteButton onClick={() => onDelete(conversation.id)} />
          </div>
        </DialogHeader>
        <div className="h-px bg-white/10 my-2 w-full flex-shrink-0" />
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-shrink-0 mb-4">
            <h3 className="text-md text-white/90 font-semibold mb-2 text-white">Topic</h3>
            <p className="text-sm text-white/80 mb-4">{conversation.topic}</p>
            <h3 className="text-lg font-semibold mb-2 text-white">Summary</h3>
            <p className="text-sm text-white/80">{conversation.summary}</p>
          </div>
          <div className="h-px bg-white/10 my-2 w-full flex-shrink-0" />
          <div className="flex-grow flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-2 text-white flex-shrink-0">Transcript</h3>
            <div className="relative flex-grow overflow-hidden">
              {showTopGradient && (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent" />
              )}
              {showBottomGradient && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />
              )}
              <div ref={transcriptScrollRef} className="scrollbar-hide absolute inset-0 overflow-y-auto">
                <p className="select-text text-sm font-regular text-white/60 whitespace-pre-wrap leading-relaxed">
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
  onClick: () => void;
  copyState: 'idle' | 'copying' | 'copied' | 'hiding';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ onClick, copyState }) => (
  <div className='relative'>
    <button
      onClick={onClick}
      className="text-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
    >
      <ClipboardIcon width={24} height={24} />
      <Tooltip message="Copied" state={copyState} />
    </button>
  </div>
);

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-foreground transition-colors duration-200 flex items-center justify-center hover:text-destructive"
  >
    <TrashIcon width={24} height={24} />
  </button>
);
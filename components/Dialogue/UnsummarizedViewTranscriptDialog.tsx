import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons';
import { LightningBoltIcon } from "@radix-ui/react-icons";
import useScrollGradient from '@/hooks/useScrollGradient';
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils';
import { ConversationData, formatTranscript } from '@/data/conversations';

interface UnsummarizedViewTranscriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ConversationData;
  onDelete: (id: string) => void;
  onSummarize: () => void;
}

const UnsummarizedViewTranscriptDialog: React.FC<UnsummarizedViewTranscriptDialogProps> = ({
  isOpen,
  onClose,
  conversation,
  onDelete,
  onSummarize
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(conversation.transcript)
      .then(() => {
        // Handle successful copy (e.g., show a tooltip)
      })
      .catch((error) => {
        console.error('Failed to copy transcript:', error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-[1200px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold leading-normal text-white">
              {getRelativeTimeString(conversation.timestamp) || 'Moments ago'}
            </h2>
            <p className="text-sm leading-normal text-white/60">
              {formatTimestamp(conversation.timestamp)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCopyTranscript}
              className="text-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
            >
              <ClipboardIcon width={24} height={24} />
            </button>
            <button
              onClick={() => onDelete(conversation.id)}
              className="text-foreground transition-colors duration-200 flex items-center justify-center hover:text-destructive"
            >
              <TrashIcon width={24} height={24} />
            </button>
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
            <p className="text-sm font-regular text-white/80 whitespace-pre-wrap leading-relaxed">
              {formatTranscript(conversation.transcript, "DialogueTranscript")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnsummarizedViewTranscriptDialog;
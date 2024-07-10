import React, { useEffect, useRef, useState } from 'react'
import { ConversationData, formatTranscript, FormatType } from '@/data/conversations'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProcessingDialog from '@/components/Dialogue/ProcessingDialog'
import { mockProcessConversation } from '@/services/mockProcessingService'
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons'
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge";
import { ViewTranscriptDialog } from "@/components/Dialogue/ViewTranscriptDialog"
import Tooltip from "@/components/Tooltip/Tooltip"

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdate: (updatedConversation: ConversationData) => void
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onUpdate, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isViewTranscriptOpen, setIsViewTranscriptOpen] = useState(false)

  const handleSummarize = async () => {
    setIsProcessing(true)
    try {
      const processedConversation = await mockProcessConversation(conversation)
      onUpdate({ ...processedConversation, summarized: true })
    } catch (error) {
      console.error('Error processing conversation:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOnViewTranscript = async () => {
    setIsViewTranscriptOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
      <Card className="flex w-full flex-col rounded-lg bg-background-100 p-0 shadow">
        <ConversationCardHeader conversation={conversation} onDelete={onDelete} />
        <CardContent className="flex flex-grow flex-col px-4 pb-4 pt-0">
          {conversation.summarized ? (
            <SummarizedContent conversation={conversation} onViewTranscript={handleOnViewTranscript} />
          ) : (
            <UnsummarizedContent transcript={conversation.transcript} onViewTranscript={handleOnViewTranscript} />
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          {!conversation.summarized && (
            <Button
              onClick={handleSummarize}
              className="hover:bg-brand-light w-full items-center justify-center rounded-lg bg-background p-1.5 text-[15px] font-semibold text-foreground/80 transition-colors duration-200 hover:text-brand"
            >
              Summarize
            </Button>
          )}
        </CardFooter>
      </Card>
      <ProcessingDialog isProcessing={isProcessing} />
      <ViewTranscriptDialog 
        isOpen={isViewTranscriptOpen} 
        onClose={() => setIsViewTranscriptOpen(false)} 
        conversation={conversation} 
        onDelete={onDelete} 
        onSummarize={handleSummarize} 
      />
    </motion.div>
  )
}

const ConversationCardHeader: React.FC<{ conversation: ConversationData; onDelete: (id: string) => void }> = ({
  conversation,
  onDelete
}) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp))
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'hiding'>('idle')

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp))
    }, 60000)
    return () => clearInterval(timer)
  }, [conversation.timestamp])

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

  return (
    <div className="flex flex-col gap-0.5 px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-semibold leading-normal text-white">
            {relativeTime || 'Moments ago'}
          </CardTitle>
          <CardDescription className="text-sm leading-normal text-white/60">
            {formatTimestamp(conversation.timestamp)}
          </CardDescription>
        </div>
        <div className="flex gap-[5px]">
          <div className='relative'>
          <button
            onClick={handleCopyTranscript}
            className = "text-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
          >
            <ClipboardIcon width={24} height={24} />
            <Tooltip message="Copied" state={copyState} />
          </button>
          </div>
          <button
            onClick={() => onDelete(conversation.id)}
            className="text-foreground transition-colors duration-200 flex items-center justify-center hover:text-destructive"
          >
            <TrashIcon width={24} height={24} className='group-hover:text-destructive' />
          </button>
        </div>
      </div>
    </div>
  )
}
interface UnsummarizedContentProps {
  transcript: string;
  onViewTranscript: () => void;
}

const UnsummarizedContent: React.FC<UnsummarizedContentProps> = ({ transcript, onViewTranscript }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  return (
    <div className="relative space-y-4">
      <div className="relative h-[275px]">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-100 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto p-0">
          <p className="select-text pb-0 text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {formatTranscript(transcript, "CardTranscript")}
          </p>
        </div>
      </div>
      <ViewTranscriptButton onViewTranscript={onViewTranscript} />
    </div>
  )
}

interface SummarizedContentProps {
  conversation: ConversationData;
  onViewTranscript: () => void;
}

const SummarizedContent: React.FC<SummarizedContentProps> = ({ conversation, onViewTranscript }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  return (
    <div className="relative space-y-4">
      <Badge className="mb-2">
        Summarized
      </Badge>
      <div className="relative h-[210px]">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-100 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto p-0">
          <h3 className="text-sm font-semibold text-white/60 mb-1">Topic:</h3>
          <p className="text-sm text-white mb-4">{conversation.topic}</p>
          <h3 className="text-sm font-semibold text-white/60 mb-1">Summary:</h3>
          <p className="select-text text-[15px] leading-normal text-white">
            {conversation.summary}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={onViewTranscript}
          variant="ghost"
          className="w-full justify-between items-center rounded-lg bg-background/20 p-2 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:text-white hover:bg-background/30 hover:backdrop-blur-sm"
        >
          View Conversation
          <ArrowRightIcon className="ml-0 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

interface ViewTranscriptButtonProps {
  onViewTranscript: () => void;
}

const ViewTranscriptButton: React.FC<ViewTranscriptButtonProps> = ({ onViewTranscript }) => (
  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
    <Button
      onClick={onViewTranscript}
      variant="ghost"
      className="w-full justify-between items-center rounded-lg bg-background/20 p-2 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:text-white hover:bg-background/30 hover:backdrop-blur-sm"
    >
      View Conversation
      <ArrowRightIcon className="ml-0 h-5 w-5" />
    </Button>
  </div>
);

export default ConversationCard
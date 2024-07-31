import React, { useEffect, useRef, useState } from 'react'
import { ConversationData, formatTranscript } from '@/data/conversations'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProcessingDialog from '@/components/Dialogue/ProcessingDialog'
import { mockProcessConversation } from '@/services/mockProcessingService'
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons'
import { Badge } from "@/components/ui/badge";
import { ViewTranscriptDialog } from "@/components/Dialogue/ViewTranscriptDialog"
import { Tooltip, TooltipState } from "@/components/Tooltip/Tooltip"
import HighlightIcon from '@/components/ui/icons/HighlightIcon'
import { sendAttachmentAndOpen } from '@/services/highlightService'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog';
import { ChevronRightIcon } from "@radix-ui/react-icons";

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <span key={i} className="bg-brand/80 text-background">{part}</span> : part
  );
};

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdate: (updatedConversation: ConversationData) => void
  searchQuery: string
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onUpdate, onDelete, searchQuery }) => {
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

  const handleAttachment = async () => {
    let toAppId = 'highlightchat'
    let transcript = conversation.transcript
    await sendAttachmentAndOpen(toAppId, transcript)
  }

  return (
    <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
      <Card className="flex w-full flex-col rounded-lg bg-background-100 p-0 shadow">
        <ConversationCardHeader conversation={conversation} onDelete={onDelete} />
        <CardContent className="flex flex-grow flex-col px-4 pb-4 pt-0">
          {conversation.summarized ? (
            <SummarizedContent conversation={conversation} onViewTranscript={handleOnViewTranscript} searchQuery={searchQuery} />
          ) : (
            <UnsummarizedContent transcript={conversation.transcript} onViewTranscript={handleOnViewTranscript} searchQuery={searchQuery} />
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <Button
            onClick={handleAttachment}
            className="w-full flex items-center justify-center rounded-lg p-2 text-[15px] font-semibold transition-colors duration-200 bg-background text-foreground hover:bg-background hover:text-brand"
          >
            <span className="flex items-center gap-2">
              Prompt
              <HighlightIcon viewBox='0 0 24 24' />
            </span>
          </Button>
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
  const [copyTooltipState, setCopyTooltipState] = useState<TooltipState>('idle');

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

  return (
    <div className="flex flex-col gap-0.5 px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold leading-normal text-white">
            {relativeTime || 'Moments ago'}
          </CardTitle>
          <CardDescription className="text-[0.825rem] leading-relaxed text-white/50 font-medium">
            {formatTimestamp(conversation.timestamp)}
          </CardDescription>
        </div>
        <div className="flex gap-[5px]">
          <div className='relative'>
            <button
              onClick={handleCopyTranscript}
              onMouseEnter={() => setCopyTooltipState('active')}
              onMouseLeave={() => setCopyTooltipState('idle')}
              className="text-muted-foreground transition-colors duration-200 flex items-center justify-center hover:text-brand"
            >
              <ClipboardIcon width={24} height={24} className="" />
              <Tooltip type="copy" state={copyTooltipState} />
            </button>
          </div>
          <DeleteConversationDialog onDelete={() => onDelete(conversation.id)} />
        </div>
      </div>
    </div>
  )
}

interface UnsummarizedContentProps {
  transcript: string;
  onViewTranscript: () => void;
  searchQuery: string;
}

const UnsummarizedContent: React.FC<UnsummarizedContentProps> = ({ transcript, onViewTranscript, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  return (
    <div 
      className="relative space-y-4 cursor-pointer group"
      onClick={onViewTranscript}
    >
      <div className="relative h-[275px] bg-background-100 rounded-lg transition-all duration-200 group-hover:bg-background-200/50">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-100 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div 
          ref={scrollRef} 
          className="scrollbar-hide h-full overflow-y-auto p-4"
        >
          <p className="select-text pb-0 text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {highlightText(formatTranscript(transcript, "CardTranscript"), searchQuery)}
          </p>
        </div>
      </div>
      <ViewIndicator />
    </div>
  )
}

interface SummarizedContentProps {
  conversation: ConversationData;
  onViewTranscript: () => void;
  searchQuery: string;
}

const SummarizedContent: React.FC<SummarizedContentProps> = ({ conversation, onViewTranscript, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  return (
    <div 
      className="relative space-y-4 cursor-pointer group"
      onClick={onViewTranscript}
    >
      <Badge className="mb-2">
        Summarized
      </Badge>
      <div className="relative h-[225px] bg-background-100 rounded-lg transition-all duration-200 group-hover:bg-background-200/50">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-100 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div 
          ref={scrollRef} 
          className="scrollbar-hide h-full overflow-y-auto p-4"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-1">Summary:</h3>
          <p className="select-text text-[15px] leading-normal text-white">
            {highlightText(conversation.summary, searchQuery)}
          </p>
        </div>
      </div>
      <ViewIndicator />
    </div>
  );
};

const ViewIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-2 right-2">
      <div className="flex items-center text-sm font-medium text-foreground/70 group-hover:text-foreground bg-background/10 backdrop-blur-sm px-2 py-1 rounded-lg">
        <span className="mr-1">View</span>
        <ChevronRightIcon className="w-4 h-4" />
      </div>
    </div>
  );
};

export default ConversationCard
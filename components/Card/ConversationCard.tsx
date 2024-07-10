import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";
import useScrollGradient from "@/hooks/useScrollGradient";
import { formatTimestamp, getRelativeTimeString } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { getTextPredictionFromHighlight } from "@/services/highlightService";
import { GeneratedPrompt } from "@/types/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProcessingDialog from "@/components/Dialogue/ProcessingDialog";
import { mockProcessConversation } from "@/services/mockProcessingService";
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons'

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdate: (updatedConversation: ConversationData) => void
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onUpdate, onDelete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'hiding'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

  const handleProcessConversation = async () => {
    console.log("Processing started");
    setIsProcessing(true);
    try {
      const processedConversation = await mockProcessConversation(conversation);
      onUpdate(processedConversation);
    } catch (error) {
      console.error("Error processing conversation:", error);
    } finally {
      console.log("Processing finished");
      setIsProcessing(false);
    }
  };

  const toggleTranscript = () => {
    setIsTranscriptExpanded(!isTranscriptExpanded);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [conversation.timestamp]);

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(conversation.transcript)
      .then(() => {
        setCopyState('copied');
        setTimeout(() => setCopyState('hiding'), 1500); // Start hiding after 1.5s
        setTimeout(() => setCopyState('idle'), 1700); // Set to idle after fade out
      })
      .catch((error) => {
        console.error("Failed to copy transcript:", error);
      });
  };

  return (
    <motion.div
    initial={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5 }}
    >
    <Card className="w-full flex flex-col relative bg-background-100">
    <CardHeader>
    <div className="absolute top-4 right-4 flex space-x-3 items-center">
          <button
            onClick={handleCopyTranscript}
            className="text-foreground hover:text-brand transition-colors duration-200 relative"
          >
            <ClipboardIcon
              width={20}
              height={20}
              className="border border-brand"
            />
            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-muted-foreground text-xs py-1 px-2 rounded shadow-md pointer-events-none transition-opacity duration-200 ${
                copyState === 'copied'
                  ? 'animate-fadeIn opacity-100'
                  : copyState === 'hiding'
                  ? 'animate-fadeOut opacity-0'
                  : 'opacity-0'
              }`}
            >
              Copied
            </div>
          </button>
          <button
            onClick={() => onDelete(conversation.id)}
            className="text-foreground hover:text-destructive transition-colors duration-200"
          >
            <TrashIcon
              width={20}
              height={20}
              className="border border-brand"
            />
          </button>
        </div>
      <CardTitle>{relativeTime || 'Untitled Conversation'}</CardTitle>
      <CardDescription>{formatTimestamp(conversation.timestamp)}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
      {conversation.topic && conversation.summary ? (
        <>
            <div className="mb-4">
                <h3 className="font-semibold">Topic:</h3>
                <p>{conversation.topic}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Summary:</h3>
                <p>{conversation.summary}</p>
              </div>
              <div className="mb-4">
                <Button onClick={toggleTranscript} variant="outline" className="w-full">
                  {isTranscriptExpanded ? (
                    <>
                      Hide Transcript <ChevronUpIcon className="ml-2" />
                    </>
                  ) : (
                    <>
                      Show Transcript <ChevronDownIcon className="ml-2" />
                    </>
                  )}
                </Button>
                {isTranscriptExpanded && (
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    <p>{conversation.transcript}</p>
                  </div>
                )}
              </div>
        </>
      ) : (
        <div className="relative mb-4 h-64">
        {showTopGradient && (
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background-100 to-transparent z-10 pointer-events-none" />
        )}
        {showBottomGradient && (
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background-100 to-transparent z-10 pointer-events-none" />
        )}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide"
        >
          <p className="px-1 select-text">{conversation.transcript}</p>
        </div>
      </div>
      )}
          {!conversation.topic && !conversation.summary && (
            <Button
              onClick={handleProcessConversation}
              className="mt-auto bg-brand hover:bg-brand-light active:bg-brand-foreground transition-colors duration-200"
            >
              Process with Highlight
            </Button>
          )}
    </CardContent>
  </Card>
  <ProcessingDialog isProcessing={isProcessing} />
  </motion.div>
);
};

export default ConversationCard;
import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";
import useScrollGradient from "@/hooks/useScrollGradient";
import { formatTimestamp, getRelativeTimeString } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { getTextPrediction } from "@/services/highlightService";
import { GeneratedPrompt } from "@/types/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, TrashIcon } from "@radix-ui/react-icons";

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onDelete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'hiding'>('idle');

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [conversation.timestamp]);

  const handlePromptClick = async () => {
    console.log("Starting text prediction...");
    
    try {
      const generatedPrompts = await getTextPrediction(conversation.
      transcript);
      console.log("Generated prompts:", generatedPrompts);
      setPrompts(generatedPrompts);
    } catch (error) {
      console.error("Error in prompt generation:", error);
    }
  };

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
      <div className="relative">
        <button
          onClick={handleCopyTranscript}
          className="text-muted-foreground hover:text-brand transition-colors duration-200"
        >
          <CopyIcon className="w-4 h-4" />
        </button>
        <div
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-muted-foreground text-xs py-1 px-2 rounded shadow-md pointer-events-none transition-opacity duration-200 ${copyState === 'copied' ? 'animate-fadeIn opacity-100' : copyState === 'hiding' ? 'animate-fadeOut opacity-0' : 'opacity-0'}`}
        >
          Copied
        </div>
      </div>
      <button
        onClick={() => onDelete(conversation.id)}
        className="text-muted-foreground hover:text-destructive transition-colors duration-200"
      >
        <TrashIcon className="w-[20px] h-[20px] transform translate-y-[-2px]" />
      </button>
    </div>
      <CardTitle>{relativeTime || 'Untitled Conversation'}</CardTitle>
      <CardDescription>{formatTimestamp(conversation.timestamp)}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
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
      {/* <Button onClick={handlePromptClick} className="mt-auto bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-light))] active:bg-[hsl(var(--brand-foreground))] transition-colors duration-200">
        Attach to Highlight
      </Button> */}
    </CardContent>
  </Card>
  </motion.div>
);
};

export default ConversationCard;
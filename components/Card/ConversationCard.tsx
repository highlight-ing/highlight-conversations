import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";
import useScrollGradient from "@/hooks/useScrollGradient";
import { formatTimestamp } from "@/utils/dateUtils";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { getTextPrediction } from "@/services/highlightService";
import { GeneratedPrompt } from "@/types/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { getRelativeTimeString } from "@/utils/dateUtils";

  interface ConversationCardProps {
    conversation: ConversationData
    onDelete: (id: string) => void
  }

import { Button } from "@/components/ui/button";

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onDelete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp));

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [conversation.timestamp]);

  const handlePromptClick = async () => {
    console.log("Starting text prediction...");
    
    try {
      const generatedPrompts = await getTextPrediction(conversation.transcript);
      console.log("Generated prompts:", generatedPrompts);
      setPrompts(generatedPrompts);
    } catch (error) {
      console.error("Error in prompt generation:", error);
    }
  };


  return (
    <motion.div
    initial={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    >
    <Card className="w-full flex flex-col relative bg-background-100">
    <CardHeader>
    <button
      onClick={() => onDelete(conversation.id)}
      className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors duration-200"
    >
      <FaTrash size={16} />
    </button>
      <CardTitle>{relativeTime || 'Untitled Conversation'}</CardTitle>
      <CardDescription>{formatTimestamp(conversation.timestamp)}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
      <div className="relative mb-4 h-64">
        {showTopGradient && (
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        )}
        {showBottomGradient && (
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        )}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide"
        >
          <p className="px-1">{conversation.transcript}</p>
        </div>
      </div>
      <Button onClick={handlePromptClick} className="mt-auto bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-light))] active:bg-[hsl(var(--brand-foreground))] transition-colors duration-200">
        Attach to Highlight
      </Button>
    </CardContent>
  </Card>
  </motion.div>
);
};

export default ConversationCard;
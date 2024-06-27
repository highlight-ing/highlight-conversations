import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";
import useScrollGradient from "@/hooks/useScrollGradient";
import { formatTimestamp } from "@/utils/dateUtils";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  interface ConversationCardProps {
    conversation: ConversationData
    onDelete: (id: string) => void
  }

import { Button } from "@/components/ui/button";

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onDelete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  return (
    <motion.div
    initial={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    >
    <Card className="w-full flex flex-col relative">
    <CardHeader>
    <button
      onClick={() => onDelete(conversation.id)}
      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
    >
      <FaTrash size={16} />
    </button>
      <CardTitle>{conversation.topic || 'Untitled Conversation'}</CardTitle>
      <CardDescription>{formatTimestamp(conversation.timestamp)}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
      <div className="relative mb-4 h-64">
        {showTopGradient && (
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
        )}
        {showBottomGradient && (
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        )}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide"
        >
          <p className="px-1">{conversation.transcript}</p>
        </div>
      </div>
      <Button className="mt-auto bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))*1.1]">
        Prompt
      </Button>
    </CardContent>
  </Card>
  </motion.div>
);
};

export default ConversationCard;
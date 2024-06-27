import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";
import useScrollGradient from "@/hooks/useScrollGradient";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  interface ConversationCardProps {
    conversation: ConversationData;
  }

import { Button } from "@/components/ui/button";

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  return (
    <Card className="w-full flex flex-col">
    <CardHeader>
      <CardTitle>{conversation.topic || 'Untitled Conversation'}</CardTitle>
      <CardDescription>{conversation.timestamp}</CardDescription>
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
);
};

  export default ConversationCard;
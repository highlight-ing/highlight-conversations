import React, { useEffect, useRef, useState } from "react";
import { ConversationData } from "@/data/conversations";

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
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  const handleScroll = () => {
    const element = scrollRef.current
    if (element) {
      setShowTopGradient(element.scrollTop > 0)
      setShowBottomGradient(
        element.scrollHeight - element.clientHeight > element.scrollTop
      )
    }
  };

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      element.addEventListener("scroll", handleScroll)
      handleScroll()
    }
    return () => element?.removeEventListener("scroll", handleScroll)
  }, [conversation.transcript])

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
          onScroll={handleScroll}
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
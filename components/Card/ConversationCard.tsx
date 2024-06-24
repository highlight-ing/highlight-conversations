import React, { useState } from "react";
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

  const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{conversation.topic || 'Untitled Conversation'}</CardTitle>
          <CardDescription>{conversation.timestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto">
            <p>{conversation.transcript}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  export default ConversationCard;
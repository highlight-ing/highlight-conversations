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

  const ConversationCard = ({ conversation }: ConversationCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{conversation.summary}</CardTitle>
                <CardDescription>{conversation.timestamp}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{conversation.transcript}</p>
            </CardContent>
        </Card>
    )
  }

  export default ConversationCard;
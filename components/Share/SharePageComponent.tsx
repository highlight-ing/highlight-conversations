import React from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { ConversationData } from '@/data/conversations'
import ScrollableTranscript from './ScrollableTranscript'

interface SharePageComponentProps {
  conversation: ConversationData;
}

const SharePageComponent: React.FC<SharePageComponentProps> = ({ conversation }) => {
  const relativeTime = getRelativeTimeString(conversation.timestamp);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
      <Card className="flex-shrink-0 mb-2 bg-background-100">
        <CardHeader>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            {conversation.title || relativeTime}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatTimestamp(conversation.timestamp)}
          </p>
          {conversation.topic && (
            <p className="text-sm text-foreground/70">
              Topics: {conversation.topic}
            </p>
          )}
        </CardHeader>
      </Card>

      {conversation.summarized && conversation.summary && (
        <Card className="flex-shrink-0 mb-2 bg-background-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h2 className="text-xl font-semibold">Summary</h2>
          </CardHeader>
          <CardContent>
            <p className="select-text text-foreground/80">{conversation.summary}</p>
          </CardContent>
        </Card>
      )}

      <Card className="flex-grow flex flex-col min-h-0 mb-2 bg-background-100">
        <CardHeader>
          <h2 className="text-xl font-semibold">Transcript</h2>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollableTranscript transcript={conversation.transcript} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SharePageComponent;
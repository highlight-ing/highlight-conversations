'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { ConversationData } from '@/data/conversations'
import ScrollableTranscript from './ScrollableTranscript'
import { trackEvent } from '@/lib/amplitude'
import { ClipboardIcon } from '@/components/ui/icons'
import { Tooltip, TooltipState } from '@/components/Tooltip/Tooltip'

interface SharePageComponentProps {
  conversation?: ConversationData;
  error?: string;
}

const SharePageComponent: React.FC<SharePageComponentProps> = ({ conversation, error }) => {
  const [copyTooltipState, setCopyTooltipState] = useState<TooltipState>('idle')

  useEffect(() => {
    if (conversation) {
      trackEvent('share_page_viewed', { status: 'success' });
    } else if (error) {
      trackEvent('share_page_viewed', { status: 'error', error });
    }
  }, [conversation, error]);

  const handleCopyTranscript = () => {
    if (conversation) {
      navigator.clipboard
        .writeText(conversation.transcript)
        .then(() => {
          setCopyTooltipState('success')
          setTimeout(() => setCopyTooltipState('hiding'), 1500)
          setTimeout(() => setCopyTooltipState('idle'), 1700)
        })
        .catch((error) => {
          console.error('Failed to copy transcript:', error)
          setCopyTooltipState('idle')
        })
    }
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Oops!</h1>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error === 'Conversation not found' 
                ? "Looks like this conversation is no longer available."
                : "An error occurred while trying to load the conversation. The owner made this conversation private."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversation) {
    return null; // Or a loading state if appropriate
  }

  const relativeTime = getRelativeTimeString(conversation.timestamp);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
      <Card className="flex-shrink-0 mt-4 mb-2 bg-background-100">
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

      <Card className="flex-grow flex flex-col min-h-0 bg-background-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold">Transcript</h2>
          <div className="relative">
            <button
              onClick={handleCopyTranscript}
              onMouseEnter={() => setCopyTooltipState('active')}
              onMouseLeave={() => setCopyTooltipState('idle')}
              className="flex items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-brand"
            >
              <ClipboardIcon width={24} height={24} className="" />
              <Tooltip type="copy" state={copyTooltipState} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollableTranscript transcript={conversation.transcript} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SharePageComponent;
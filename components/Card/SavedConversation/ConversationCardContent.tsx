import React from 'react'
import { CardContent } from '@/components/ui/card'
import { ConversationData } from '@/data/conversations'
import { SummarizedContent } from './SummarizedContent'
import { UnsummarizedContent } from './UnsummarizedContent'

interface ConversationCardContentProps {
  conversation: ConversationData
  onViewTranscript: () => void
  searchQuery: string
}

export const ConversationCardContent: React.FC<ConversationCardContentProps> = ({
  conversation,
  onViewTranscript,
  searchQuery
}) => (
  <CardContent className="flex flex-grow flex-col px-4">
    {conversation.summarized ? (
      <SummarizedContent
        conversation={conversation}
        onViewTranscript={onViewTranscript}
        searchQuery={searchQuery}
      />
    ) : (
      <UnsummarizedContent
        transcript={conversation.transcript}
        onViewTranscript={onViewTranscript}
        searchQuery={searchQuery}
      />
    )}
  </CardContent>
)

export default ConversationCardContent
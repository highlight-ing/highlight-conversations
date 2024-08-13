import React from 'react'
import { ViewTranscriptContent } from './ViewTranscriptContent'

interface ViewTranscriptUnsummarizedContentProps {
  transcript: string;
  scrollRef: React.RefObject<HTMLDivElement>;
  showTopGradient: boolean;
  showBottomGradient: boolean;
}

export const ViewTranscriptUnsummarizedContent: React.FC<ViewTranscriptUnsummarizedContentProps> = ({
  transcript,
  scrollRef,
  showTopGradient,
  showBottomGradient
}) => (
  <div className="flex-grow flex flex-col min-h-0">
    <h3 className="text-lg font-semibold mb-2 text-foreground flex-shrink-0">Transcript</h3>
    <ViewTranscriptContent
      transcript={transcript}
      scrollRef={scrollRef}
      showTopGradient={showTopGradient}
      showBottomGradient={showBottomGradient}
    />
  </div>
);
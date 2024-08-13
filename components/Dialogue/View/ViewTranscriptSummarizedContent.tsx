import React from 'react'
import { ViewTranscriptContent } from './ViewTranscriptContent'

interface ViewTranscriptSummarizedContentProps {
    summary: string;
    transcript: string;
    scrollRef: React.RefObject<HTMLDivElement>;
    showTopGradient: boolean;
    showBottomGradient: boolean;
  }
  
  export const ViewTranscriptSummarizedContent: React.FC<ViewTranscriptSummarizedContentProps> = ({
    summary,
    transcript,
    scrollRef,
    showTopGradient,
    showBottomGradient
  }) => (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Summary</h3>
        <p className="text-sm text-foreground/80">{summary}</p>
      </div>
      <div className="h-px bg-white/10 my-2 w-full flex-shrink-0" />
      <div className="flex-grow flex flex-col min-h-0">
        <h3 className="text-lg font-semibold mb-2 text-foreground flex-shrink-0">Transcript</h3>
        <ViewTranscriptContent
          transcript={transcript}
          scrollRef={scrollRef}
          showTopGradient={showTopGradient}
          showBottomGradient={showBottomGradient}
        />
      </div>
    </div>
  );
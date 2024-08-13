import React from 'react'
import { formatTranscript } from '@/data/conversations'

interface ViewTranscriptContentProps {
    transcript: string;
    scrollRef: React.RefObject<HTMLDivElement>;
    showTopGradient: boolean;
    showBottomGradient: boolean;
  }
  
  export const ViewTranscriptContent: React.FC<ViewTranscriptContentProps> = ({
    transcript,
    scrollRef,
    showTopGradient,
    showBottomGradient
  }) => (
    <div className="relative flex-grow overflow-hidden">
      {showTopGradient && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent" />
      )}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto scrollbar-hide">
        <p className="select-text text-sm font-regular text-foreground/60 whitespace-pre-wrap leading-relaxed p-4">
          {formatTranscript(transcript, "DialogueTranscript")}
        </p>
      </div>
      {showBottomGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
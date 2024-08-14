'use client'

import React, { useRef } from 'react'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTranscript } from '@/data/conversations'

interface ScrollableTranscriptProps {
  transcript: string;
}

const ScrollableTranscript: React.FC<ScrollableTranscriptProps> = ({ transcript }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  return (
    <div className="relative flex flex-col h-full">
      {showTopGradient && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
      )}
      {showBottomGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background-100 to-transparent" />
      )}
      <div ref={scrollRef} className="custom-scrollbar overflow-y-auto h-full">
        <p className="select-text whitespace-pre-wrap text-foreground/80 leading-relaxed">
          {formatTranscript(transcript, "DialogueTranscript")}
        </p>
      </div>
    </div>
  );
};

export default ScrollableTranscript;
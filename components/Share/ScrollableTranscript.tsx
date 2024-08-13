'use client'

import React, { useRef, useEffect } from 'react'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTranscript } from '@/data/conversations'

interface ScrollableTranscriptProps {
  transcript: string;
  searchQuery: string;
  onSearchResults: (count: number) => void;
}

const ScrollableTranscript: React.FC<ScrollableTranscriptProps> = ({ transcript, searchQuery, onSearchResults }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef);

  useEffect(() => {
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'gi');
      const matches = transcript.match(regex);
      const resultsCount = matches ? matches.length : 0;
      onSearchResults(resultsCount);

      // Scroll to the first match
      if (matches && matches.length > 0 && scrollRef.current) {
        const firstMatchIndex = transcript.toLowerCase().indexOf(searchQuery.toLowerCase());
        const textBeforeMatch = transcript.slice(0, firstMatchIndex);
        const lineHeight = 24; // Adjust this value based on your actual line height
        const approximateScrollPosition = (textBeforeMatch.split('\n').length - 1) * lineHeight;
        scrollRef.current.scrollTop = approximateScrollPosition - 100; // Scroll a bit above the match
      }
    } else {
      onSearchResults(0);
    }
  }, [searchQuery, transcript, onSearchResults]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-brand/80 text-background">{part}</span> : part
    );
  };

  return (
    <div className="relative flex flex-col h-full">
      {showTopGradient && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
      )}
      {showBottomGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background-100 to-transparent" />
      )}
      <div ref={scrollRef} className="custom-scrollbar overflow-y-auto h-full px-6 py-4">
        <p className="select-text whitespace-pre-wrap text-foreground/80 leading-relaxed">
          {highlightText(formatTranscript(transcript, "DialogueTranscript"), searchQuery)}
        </p>
      </div>
    </div>
  );
};

export default ScrollableTranscript;
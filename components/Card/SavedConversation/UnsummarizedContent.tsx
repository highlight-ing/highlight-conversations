import React, { useRef } from 'react'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTranscript } from '@/data/conversations'
import { highlightText } from '@/utils/textUtils'
import ViewIndicator from './ViewIndicator'

interface UnsummarizedContentProps {
    transcript: string
    onViewTranscript: () => void
    searchQuery: string
  }
  
  export const UnsummarizedContent: React.FC<UnsummarizedContentProps> = ({ transcript, onViewTranscript, searchQuery }) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)
  
    return (
      <div className="group relative cursor-pointer" onClick={onViewTranscript}>
        <div className="relative h-[275px] rounded-lg bg-background-100 transition-all duration-200 group-hover:bg-background-200/50">
          {showTopGradient && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
          )}
          {showBottomGradient && (
            <div className="z-100 pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background-100 to-transparent" />
          )}
          <div ref={scrollRef} className="custom-scrollbar h-full overflow-y-auto p-4">
            <p className="select-text whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
              {highlightText(formatTranscript(transcript, 'CardTranscript'), searchQuery)}
            </p>
          </div>
        </div>
        <ViewIndicator />
      </div>
    )
  }
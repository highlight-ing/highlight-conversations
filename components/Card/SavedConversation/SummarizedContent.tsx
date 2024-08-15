import React, { useRef } from 'react'
import { ConversationData } from '@/data/conversations'
import useScrollGradient from '@/hooks/useScrollGradient'
import { highlightText } from '@/utils/textUtils'
import ViewIndicator from './ViewIndicator'

interface SummarizedContentProps {
    conversation: ConversationData
    onViewTranscript: () => void
    searchQuery: string
  }
  
  export const SummarizedContent: React.FC<SummarizedContentProps> = ({ conversation, onViewTranscript, searchQuery }) => {
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
            <h3 className="mb-1 text-sm font-semibold text-white/60">Summary:</h3>
            <p className="select-text text-[15px] leading-normal text-white">
              {highlightText(conversation.summary, searchQuery)}
            </p>
          </div>
        </div>
        <ViewIndicator />
      </div>
    )
  }
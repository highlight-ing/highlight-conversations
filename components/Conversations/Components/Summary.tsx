import React, { useState, useEffect } from 'react'
import { summarizeConversation } from '@/services/highlightService'

interface SummaryProps {
  transcript: string
  onSummaryGenerated: (summary: string) => void
  conversationId: string
  existingSummary?: string | null
}

const Summary: React.FC<SummaryProps> = ({ transcript, onSummaryGenerated, conversationId, existingSummary }) => {
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(existingSummary || null)

  const handleSummarizeClick = async () => {
    setIsSummarizing(true)
    try {
      const result = await summarizeConversation(transcript)
      setGeneratedSummary(result.summary)
      onSummaryGenerated(result.summary)
    } catch (error) {
      console.error('Error summarizing transcript:', error)
    } finally {
      setIsSummarizing(false)
    }
  }

  // Reset summary when conversationId changes
  useEffect(() => {
    setGeneratedSummary(existingSummary || null)
  }, [conversationId])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-xl font-semibold leading-tight text-[#eeeeee]">Summary</div>
      {/* Generated Summary */}
      {generatedSummary ? (
        <div className="text-sm text-[#eeeeee] sm:text-base">{generatedSummary}</div>
      ) : (
        <button
          onClick={handleSummarizeClick}
          disabled={isSummarizing}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4ceda0]/20 px-8 py-3.5 text-[17px] font-medium leading-tight text-[#4bec9f] hover:bg-[#4ceda0]/30"
        >
          {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
        </button>
      )}
    </div>
  )
}

export default Summary

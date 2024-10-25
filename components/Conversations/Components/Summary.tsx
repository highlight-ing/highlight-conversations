import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { summarizeConversation } from '@/services/highlightService'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { ClipboardText } from 'iconsax-react'

interface SummaryProps {
  transcript: string
  onSummaryGenerated: (summary: string) => void
  conversationId: string
  existingSummary?: string | null
}

const Summary: React.FC<SummaryProps> = ({ transcript, onSummaryGenerated, conversationId, existingSummary }) => {
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(existingSummary || null)
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')

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

  const buttons = useTranscriptButtons({
    message: generatedSummary ?? '',
    // buttonTypes: ['Copy', 'Share', 'Save', 'SendFeedback']
    buttonTypes: ['Copy'] // TODO: Add other buttons
  })

    // Function to copy transcript to clipboard
    const copyToClipboard = () => {
      navigator.clipboard
        .writeText(generatedSummary ?? '')
        .then(() => {
          setCopyStatus('success')
          setTimeout(() => setCopyStatus('default'), 2000) // Reset status after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy summary: ', err)
        })
    }

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight text-[#eeeeee]">
        <span>Summary</span>
        <button onClick={copyToClipboard} className="flex h-5 w-5">
          {generatedSummary && <ClipboardText
                variant="Bold"
                size={20}
                className={`text-subtle transition-colors transition-transform duration-200 ${
                  copyStatus === 'success' ? 'animate-gentle-scale scale-110' : ''
                } hover:text-primary`}
            />}
        </button>
      </h2>
      {/* Generated Summary */}
      {generatedSummary ? (
        <div className="text-sm text-[#eeeeee] sm:text-base">{generatedSummary}</div>
      ) : (
        <AnimatePresence>
          {!generatedSummary && (
            <motion.button
              onClick={handleSummarizeClick}
              disabled={isSummarizing}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4ceda0]/20 px-8 py-3.5 text-[17px] font-medium leading-tight text-[#4bec9f] hover:bg-[#4ceda0]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}  
              transition={{ duration: 0.3 }}
            >
              {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default Summary

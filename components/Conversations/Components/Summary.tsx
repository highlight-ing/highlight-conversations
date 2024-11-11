import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardText } from 'iconsax-react';
import { summarizeConversation } from '@/services/highlightService';
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons';

// Types and Interfaces

interface SummaryProps {
  /** The transcript text to be summarized */
  transcript: string;
  /** Optional custom prompt for the summarization */
  customPrompt?: string;
  /** Callback function when summary is generated */
  onSummaryGenerated: (summary: string) => void;
  /** Unique identifier for the conversation */
  conversationId: string;
  /** Pre-existing summary if available */
  existingSummary?: string | null;
}

type CopyStatus = 'default' | 'success';

// Animation Constants
const ANIMATIONS = {
  button: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  copyIcon: {
    success: 'animate-gentle-scale scale-110',
    default: ''
  }
};

// Custom Hook for Summary Logic

function useSummary(props: SummaryProps) {
  const {
    transcript,
    customPrompt,
    onSummaryGenerated,
    conversationId,
    existingSummary
  } = props;

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(existingSummary || null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('default');

  /**
   * Handles the generation of summary
   */
  const handleSummarizeClick = async () => {
    setIsSummarizing(true);
    try {
      const result = await summarizeConversation(transcript, customPrompt);
      setGeneratedSummary(result.summary);
      onSummaryGenerated(result.summary);
    } catch (error) {
      console.error('Error summarizing transcript:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  /**
   * Copies the generated summary to clipboard
   */
  const copyToClipboard = async () => {
    if (!generatedSummary) return;

    try {
      await navigator.clipboard.writeText(generatedSummary);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('default'), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  // Reset summary when conversation changes
  useEffect(() => {
    setGeneratedSummary(existingSummary || null);
  }, [conversationId, existingSummary]);

  return {
    isSummarizing,
    generatedSummary,
    copyStatus,
    handleSummarizeClick,
    copyToClipboard
  };
}

// Component

const Summary: React.FC<SummaryProps> = (props) => {
  const {
    isSummarizing,
    generatedSummary,
    copyStatus,
    handleSummarizeClick,
    copyToClipboard
  } = useSummary(props);

  // Initialize transcript buttons
  const buttons = useTranscriptButtons({
    message: generatedSummary ?? '',
    buttonTypes: ['Copy']
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header Section */}
      <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight text-[#eeeeee]">
        <span>Summary</span>
        {generatedSummary && (
          <button 
            onClick={copyToClipboard} 
            className="flex h-5 w-5"
            aria-label="Copy summary to clipboard"
          >
            <ClipboardText
              variant="Bold"
              size={20}
              className={`
                text-subtle transition-colors transition-transform duration-200
                ${copyStatus === 'success' ? ANIMATIONS.copyIcon.success : ''}
                hover:text-primary
              `}
            />
          </button>
        )}
      </h2>

      {/* Content Section */}
      {generatedSummary ? (
        // Display generated summary
        <div className="text-sm text-[#eeeeee] sm:text-base select-text">
          {generatedSummary}
        </div>
      ) : (
        // Display summarize button if no summary exists
        <AnimatePresence>
          {!generatedSummary && (
            <motion.button
              onClick={handleSummarizeClick}
              disabled={isSummarizing}
              className="
                inline-flex w-full cursor-pointer items-center justify-center gap-2 
                rounded-xl bg-[#4ceda0]/20 px-8 py-3.5 text-[17px] font-medium 
                leading-tight text-[#4bec9f] hover:bg-[#4ceda0]/30
                disabled:cursor-not-allowed disabled:opacity-50
              "
              {...ANIMATIONS.button}
            >
              {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Summary;
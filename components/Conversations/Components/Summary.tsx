import React, { useState } from 'react'
import { summarizeConversation } from '@/services/highlightService'

interface SummaryProps {
  transcript: string;
  onSummaryGenerated: (summary: string) => void;
}

const Summary: React.FC<SummaryProps> = ({ transcript, onSummaryGenerated }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const handleSummarizeClick = async () => {
    setIsSummarizing(true);
    try {
      console.log('Starting summarization...');
      const result = await summarizeConversation(transcript);
      console.log('Summarization result:', result);
      setGeneratedSummary(result.summary);
      onSummaryGenerated(result.summary);
    } catch (error) {
      console.error('Error summarizing transcript:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
        <div className="text-[#eeeeee] text-xl font-semibold leading-tight">
          Summary
        </div>
      <div className="w-[712px] px-8 py-3.5 bg-[#00dbfb]/20 rounded-xl justify-center items-center gap-2 inline-flex">
        {!generatedSummary && (
          <button
            onClick={handleSummarizeClick}
            disabled={isSummarizing}
            className="text-[#00e6f5] text-[17px] font-medium leading-tight"
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
          </button>
        )}
      </div>

      {/* Generated Summary */}
      {generatedSummary && (
        <div className="w-[624px] text-[#eeeeee] text-sm sm:text-base">
          {generatedSummary}
        </div>
      )}
    </>
  );
};

export default Summary;

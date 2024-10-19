import React, { useState } from 'react'
import { summarizeConversation } from '@/services/highlightService'

interface SummaryProps {
  summary: string;
  transcript: string;
}

const Summary: React.FC<SummaryProps> = ({ summary, transcript }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(summary); 

  const handleSummarizeClick = async () => {
    setIsSummarizing(true);
    try { 
      const result = await summarizeConversation(transcript);
      setGeneratedSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing transcript:', error);
    } finally {
      setIsSummarizing(false); 
    }
  };

  return (
    <div className="space-y-4">
    <h2 className="text-[#eeeeee] text-xl font-semibold font-inter leading-tight">Summary</h2>
    <div className="w-full px-4 sm:px-6 md:px-8 py-3.5 bg-[#00dbfb]/20 rounded-xl flex justify-center items-center">
      <button
        onClick={handleSummarizeClick}
        disabled={isSummarizing}
        className="text-[#00e6f5] text-base sm:text-lg font-medium font-inter leading-tight"
      >
        {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
      </button>
    </div>
    {generatedSummary && (
      <div className="mt-4 text-[#eeeeee] text-sm sm:text-base">{generatedSummary}</div>
    )}
  </div>
  ); 
}

export default Summary
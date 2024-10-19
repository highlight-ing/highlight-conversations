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
    <div>
      <div className="text-[#eeeeee] text-xl font-semibold font-inter leading-tight">Summary</div>
      <div className="w-[712px] h-12 px-8 py-3.5 bg-[#00dbfb]/20 rounded-xl justify-center items-center gap-2 inline-flex">
        <button
          onClick={handleSummarizeClick}
          disabled={isSummarizing}
          className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight"
        >
          {isSummarizing ? 'Summarizing...' : 'Summarize Transcript'}
        </button>
      </div>
      <div className="mt-4 text-[#eeeeee]">{generatedSummary}</div>
    </div>
  ); 
}

export default Summary
import React from 'react'

interface SummaryProps {
  summary: string
}

const Summary: React.FC<SummaryProps> = ({ summary }) => (
  <div>
    <div className="text-[#eeeeee] text-xl font-semibold font-inter leading-tight">Summary</div>
    <div className="w-[712px] h-12 px-8 py-3.5 bg-[#00dbfb]/20 rounded-xl justify-center items-center gap-2 inline-flex">
      <div className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight">Summarize Transcript</div>
    </div>
  </div>
)

export default Summary
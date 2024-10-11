import React from 'react'

interface SummaryProps {
  summary: string
}

const Summary: React.FC<SummaryProps> = ({ summary }) => (
  <p className="text-gray-600 mb-4">{summary}</p>
)

export default Summary
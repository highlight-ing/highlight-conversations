import React from 'react'
import { ConversationData } from '@/data/conversations'

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  if (!conversation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Select a conversation to view details</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{conversation.title}</h1>
      <p className="text-gray-600 mb-4">{conversation.summary}</p>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
        <p className="whitespace-pre-wrap">{conversation.transcript}</p>
      </div>
    </div>
  )
}

export default ConversationDetail

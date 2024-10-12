import React from 'react'
import { ConversationData } from '@/data/conversations'
import Header from '../Components/Header'
import Transcript from '../Components/Transcript'
import Summary from '../Components/Summary'

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
    <div className="p-6"
      style={{
        background: 'var(--Background-primary, #0F0F0F)',
        minHeight: '100vh',
      }}
    >
      <Header title={conversation.title} startedAt={conversation.startedAt} endedAt={conversation.endedAt} />
      <Summary summary={conversation.summary} />
      <Transcript transcript={conversation.transcript} />
    </div>
  )
}

export default ConversationDetail

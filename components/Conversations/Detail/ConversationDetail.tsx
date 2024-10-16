import React from 'react'
import { ConversationData } from '@/data/conversations'
import Header from '../Components/Header'
import Transcript from '../Components/Transcript'
import Summary from '../Components/Summary'
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled'

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  if (!conversation) {
    // change this into different scenarios 
    return (
      <TranscriptionDisabled />
    )
  }

  return (
    <div className="p-6"
      style={{
        background: 'var(--Background-primary, #0F0F0F)',
        minHeight: '100vh',
      }}
    >
      <Header conversation={conversation} />
      <Summary summary={conversation.summary} />
      <Transcript transcript={conversation.transcript} />
    </div>
  )
}

export default ConversationDetail

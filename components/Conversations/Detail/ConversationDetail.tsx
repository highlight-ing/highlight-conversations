import React, { useState } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import Header from '../Components/Header'
import Transcript from '../Components/Transcript'
import Summary from '../Components/Summary'
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled'
import NoAudioDetected from './ConversationDetail/NoAudio'
// import CompletedConversation from './ConversationDetail/CompletedConversation'


// TODO: 
// 1. Finish all the possible pages e.g. NoAudioDetected ... etc
// 2. Complete this logic and test things 

type AudioState = 'active' | 'inactive' | 'off' | 'completed';

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const [audioState, setAudioState] = useState<AudioState>('inactive');

  if (!conversation) {
    return <TranscriptionDisabled />
  }

  let content
  switch (audioState) {
    case 'off':
      content = <TranscriptionDisabled />
      break
    case 'inactive':
      content = <NoAudioDetected />
      break
    case 'active':
      content = (
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
      break
    case 'completed':
      // this isnt available 
      content = <CompletedConversation />
      break
    default:
      content = <TranscriptionDisabled />
  }

  return content
}

export default ConversationDetail

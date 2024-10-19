import React from 'react';
import { ConversationData } from '@/data/conversations';
import { useConversations } from '@/contexts/ConversationContext';  
import Header from '../Components/Header';
import Transcript from '../Components/Transcript';
import Summary from '../Components/Summary';
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled';
import NoAudioDetected from './ConversationDetail/NoAudioDetected';
import ActiveConversation from './ConversationDetail/ActiveConversation';

interface ConversationDetailProps {
  conversation: ConversationData | undefined;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const {
    currentConversation,      // Get current conversation from context (used for live convos)
    micActivity,              // Get mic activity (used for live convos)
    isAudioOn,                // Get audio state (on/off) (used for live convos)
  } = useConversations();      // Access all needed state and functions from ConversationContext

  // If a specific conversation is passed (e.g. a past convo), show it directly
  if (conversation) {
    return (
      <div className="p-6" style={{ background: 'black', minHeight: '100vh' }}>
        <Header conversation={conversation} />
        <Summary />
        <Transcript transcript={conversation.transcript} />
      </div>
    );
  }

  // If there's no conversation passed, handle live conversation logic
  

  // Handle live conversation based on mic/audio state
  if (!isAudioOn) {
    // If the microphone is disabled, show TranscriptionDisabled
    return <TranscriptionDisabled />;
  }

  if (isAudioOn && micActivity === 0) {
    // If the microphone is enabled but there's no audio activity, show NoAudioDetected
    return <NoAudioDetected />;
  }

  // Active/live conversation
  return (
    <div className="p-6" style={{ background: '#black', minHeight: '100vh' }}>
      <Header conversation={conversation} icon={<MicrophoneIcon />} />
      <Summary summary={currentConversation.summary} />
      <Transcript transcript={currentConversation.transcript} />
    </div>
  );
};

export default ConversationDetail;

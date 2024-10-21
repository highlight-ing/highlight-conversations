import React from 'react';
import { ConversationData } from '@/data/conversations';
import { useConversations } from '@/contexts/ConversationContext';  
import Header from '../Components/Header';
import Transcript from '../Components/Transcript';
import Summary from '../Components/Summary';
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled';
import NoAudioDetected from './ConversationDetail/NoAudioDetected';
import VoiceSquareIcon from './Icon/VoiceSquareIcon';
import ActiveConversation from './ConversationDetail/ActiveConversation';
import CompletedConversation from './ConversationDetail/CompletedConversation';

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
      <CompletedConversation conversation={conversation}/>

      /**
       * 
        <div className="bg-[#0e0e0e] min-h-screen p-4 sm:p-6 md:p-8 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <Header conversation={conversation} />
          
          <div className="mt-8 sm:mt-12 md:mt-16">
            <div className="flex justify-between items-center mb-4">
            </div>
            <Summary summary={conversation.summary} transcript={conversation.transcript} />
          </div>
          
          <div className="mt-8 sm:mt-12 md:mt-16 border-t border-[#222222]/50 pt-8">
            <div className="flex justify-between items-center mb-6">
            </div>
            <Transcript transcript={conversation.transcript} />
          </div>
        </div>
      </div>
       * 
       */
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
    <div className="bg-[#0e0e0e] min-h-screen p-4 sm:p-6 md:p-8 lg:p-16">
      <div className="max-w-4xl mx-auto">
        <Header conversation={currentConversation} />
      
        
        <div className="mt-8 sm:mt-12 md:mt-16 border-t border-[#222222]/50 pt-8">
          <div className="flex justify-between items-center mb-6">
          </div>
          <Transcript transcript={currentConversation.transcript} />
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;

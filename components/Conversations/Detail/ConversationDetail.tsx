import React from 'react';
import { ConversationData } from '@/data/conversations';
import { useConversations } from '@/contexts/ConversationContext';  
import Header from '../Components/Header';
import Transcript from '../Components/Transcript';
import Summary from '../Components/Summary';
import TranscriptionDisabled from './ConversationDetail/TranscriptionDisabled';
import NoAudioDetected from './ConversationDetail/NoAudioDetected';
import ActiveConversation from './ConversationDetail/ActiveConversation'; 
// import CompletedConversation from './ConversationDetail/CompletedConversation'; 

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  const {
    currentConversation,      // Get current conversation from context
    micActivity,              // Get mic activity
    isAudioOn,                // Get audio state (on/off)
  } = useConversations();      // Access all needed state and functions from ConversationContext

  // Determine what should be displayed based on microphone and conversation state
  if (!isAudioOn) {
    // If the microphone is disabled, show TranscriptionDisabled
    return <TranscriptionDisabled />;
  }

  if (isAudioOn && micActivity === 0) {
    // If the microphone is enabled but there's no audio activity, show NoAudioDetected
    return <NoAudioDetected />;
  }


  /**
   *   if (micActivity > 0) {
    // If the microphone is active and voice is detected, show ActiveConversationComponent
    return (
      <ActiveConversation />
    );
  }
   * 
   * 
   *   if (currentConversation && currentConversation.isCompleted) {
    // If the conversation is completed, show CompletedConversationComponent
    return <CompletedConversation />;
  }
  return (
    <Header conversation={conversation} />


  )
   * 
   */
};

export default ConversationDetail;

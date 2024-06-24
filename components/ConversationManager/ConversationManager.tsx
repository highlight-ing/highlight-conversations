import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTranscript, fetchMicActivity, setTranscriptionCallback, setSegmentStatusCallback } from '../../services/audioService';
import { ConversationData, mockConversations } from '../../data/conversations';
import ConversationGrid from '../Card/ConversationGrid';
import { v4 as uuidv4 } from 'uuid';

const POLL_MIC_INTERVAL = 100; // Poll every 100 ms
const POLL_TRANSCRIPT_INTERVAL = 30000; // Poll every 30 seconds
const IDLE_THRESHOLD = 150; // 15 seconds (150 * 100ms) of low activity to consider conversation ended

interface ConversationsManagerProps {
    onMicActivityChange: (activity: number) => void;
}

const ConversationsManager: React.FC<ConversationsManagerProps> = ({ onMicActivityChange }) => {
  const [currentConversation, setCurrentConversation] = useState('');
  const [conversations, setConversations] = useState<ConversationData[]>(mockConversations);
  const [lastTranscript, setLastTranscript] = useState('');
  const [micActivity, setMicActivity] = useState(0);
  const [remainingSegments, setRemainingSegments] = useState<number>(0);
  const [latestTranscript, setLatestTranscript] = useState<string>('');

  const idleCountRef = useRef(0);

  const pollMicActivity = useCallback(async () => {
    const activity = await fetchMicActivity();
    setMicActivity(activity);
    onMicActivityChange(activity);

    if (activity <= 1) {
      idleCountRef.current += 1;
    } else {
      idleCountRef.current = 0;
    }

    if (idleCountRef.current >= IDLE_THRESHOLD && currentConversation.trim()) {
      const newConversation = createConversation(currentConversation);
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation('');
      idleCountRef.current = 0;
    }
  }, [onMicActivityChange, currentConversation]);

  // const pollTranscription = useCallback(async () => {
  //   const transcript = await fetchTranscript();
    
  //   if (transcript && transcript !== lastTranscript) {
  //     console.log("New Transcript: ", transcript);
  //     setCurrentConversation(prev => prev.trim() + ' ' + transcript.trim());
  //     setLastTranscript(transcript);
  //   }
  // }, [lastTranscript]);

  // Effect for polling mic activity
  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL);
    return () => clearInterval(intervalId);
  }, [pollMicActivity]);

  useEffect(() => {
    console.log("Setting segment status callback inside conversations manager");
    setSegmentStatusCallback((current, total) => {
      console.log("Segments: ", current, total);
    });
  }, []);

  // // Effect for polling transcription
  // useEffect(() => {
  //   const intervalId = setInterval(pollTranscription, POLL_TRANSCRIPT_INTERVAL);
  //   return () => clearInterval(intervalId);
  // }, [pollTranscription]);

  // useEffect(() => {
  //   setupASRCallbacks(
  //     (segments: number) => {
  //       console.log("Segments: ", segments);
  //       setRemainingSegments(segments);
  //     },
  //     (text: string, startTime: number, endTime: number) => {
  //       setCurrentConversation(prev => prev + text);
  //       setLatestTranscript(text);
  //       console.log(`Transcript from ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);
  //     }
  //   );
  // }, []);

  return (
    <ConversationGrid 
      currentConversation={currentConversation}
      conversations={conversations}
      micActivity={micActivity}
    />
  );
};

const createConversation = (transcript: string): ConversationData => {
  let uuid = uuidv4();
  return {
    id: uuid,
    summary: transcript.slice(0, 50),
    topic: uuid.slice(0, 4),
    transcript: transcript,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };
};

export default ConversationsManager;
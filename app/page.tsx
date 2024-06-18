"use client";
import React, { useState, useEffect, useRef } from 'react';
import { fetchTranscript, fetchMicActivity } from '../services/audioService';
import ConversationTable from '../components/table/data-table';
import CurrentTranscriptComponent from '../components/CurrentTranscriptComponent';
import { ConversationData } from '../data/conversations';

const HomePage: React.FC = () => {
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [micActivity, setMicActivity] = useState<number>(0);
  const micActivityRef = useRef<number>(micActivity);
  const activityDurationRef = useRef<number>(0);

  useEffect(() => {
    const pollMicActivity = async () => {
      const activity = await fetchMicActivity();
      setMicActivity(activity);
    };

    const intervalId = setInterval(pollMicActivity, 100); // Poll every 100 ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const checkMicActivity = () => {
      if (micActivityRef.current === 0 || micActivityRef.current === 1) {
        activityDurationRef.current += 1;
      } else {
        activityDurationRef.current = 0;
      }

      if (activityDurationRef.current >= 15) {
        if (timeoutId) clearTimeout(timeoutId);
        const newTimeoutId = setTimeout(() => {
          setIsWaiting(true);
          fetchTranscript(currentTranscript, setCurrentTranscript, setConversations, setIsWaiting, timeoutId, setTimeoutId);
        }, 0);
        setTimeoutId(newTimeoutId);
        activityDurationRef.current = 0;
      }
    };

    const intervalId = setInterval(checkMicActivity, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentTranscript, timeoutId]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-neutral-100">
      <header className="py-4">
        <h1 className="text-center text-3xl font-bold">Conversations</h1>
      </header>
      <div className="p-4">
        <CurrentTranscriptComponent transcript={currentTranscript} isWaiting={isWaiting} />
        <ConversationTable conversations={conversations} />
      </div>
    </div>
  );
};

export default HomePage;
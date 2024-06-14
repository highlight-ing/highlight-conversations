"use client";
import React, { useState, useEffect } from 'react';
import { fetchTranscript } from '../services/audioService';
import ConversationTable from '../components/table/data-table';
import CurrentTranscriptComponent from '../components/CurrentTranscriptComponent';
import { ConversationData } from '../data/conversations';

const HomePage: React.FC = () => {
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTranscript(currentTranscript, setCurrentTranscript, setConversations, setIsWaiting, timeoutId, setTimeoutId);
    }, 30000); // 30 seconds

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
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
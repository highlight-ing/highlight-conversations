"use client"
// pages/index.tsx (or your main page component)
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import ConversationsManager from '@/components/ConversationManager/ConversationManager';
import { setAsrRealtime } from '@/services/audioService';

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState(1);
  const [micActivity, setMicActivity] = useState(0);

  const handleMicActivityChange = (activity: number) => {
    setMicActivity(activity);
  }

  useEffect(() => {
    setAsrRealtime(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        autoClearValue={autoClearValue}
        onAutoClearValueChange={setAutoClearValue}
      />
      <main className="flex-grow p-4">
        <ConversationsManager onMicActivityChange={handleMicActivityChange} />
        <h2>Mic Activity: {micActivity}</h2>
      </main>
    </div>
  );
};

export default MainPage;
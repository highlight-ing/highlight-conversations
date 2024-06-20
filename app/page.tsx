"use client"
// pages/index.tsx (or your main page component)
import React, { useState } from 'react';
import Header from '@/components/Header/Header';
import ConversationGrid from '@/components/Card/ConversationGrid';
import {ConversationData, mockConversations } from '@/data/conversations';

const MainPage: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        autoClearValue={autoClearValue}
        onAutoClearValueChange={setAutoClearValue}
      />
      <main className="flex-grow p-4">
        <ConversationGrid conversations={mockConversations} />
      </main>
    </div>
  );
};

export default MainPage;
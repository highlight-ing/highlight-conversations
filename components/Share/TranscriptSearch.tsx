/*
'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import ScrollableTranscript from './ScrollableTranscript'
import { ConversationData } from '@/data/conversations'

interface TranscriptSearchProps {
  conversation: ConversationData;
}

const TranscriptSearch: React.FC<TranscriptSearchProps> = ({ conversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number>(0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-xl font-semibold">Transcript</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pr-8 bg-background-100/10 border-background-300 focus:border-brand/50"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <CrossCircledIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <span className="text-sm text-muted-foreground min-w-[80px]">
              {searchResults === 0 ? "No results" : `${searchResults} result${searchResults > 1 ? 's' : ''}`}
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <ScrollableTranscript 
          transcript={conversation.transcript} 
          searchQuery={searchQuery}
          onSearchResults={setSearchResults}
        />
      </div>
    </div>
  );
};

export default TranscriptSearch;


'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { ConversationData } from '@/data/conversations'

interface TranscriptSearchUnusedProps {
  conversation: ConversationData;
}

const TranscriptSearchUnused: React.FC<TranscriptSearchUnusedProps> = ({ conversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number>(0);

  useEffect(() => {
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'gi');
      const matches = conversation.transcript.match(regex);
      const resultsCount = matches ? matches.length : 0;
      setSearchResults(resultsCount);
    } else {
      setSearchResults(0);
    }
  }, [searchQuery, conversation.transcript]);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-80 pr-8 bg-background-100/10 border-background-300 focus:border-brand/50"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => setSearchQuery('')}
          >
            <CrossCircledIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <span className="text-sm text-muted-foreground min-w-[80px]">
          {searchResults === 0 ? "No results" : `${searchResults} result${searchResults > 1 ? 's' : ''}`}
        </span>
      )}
    </div>
  );
};

export default TranscriptSearchUnused;
*/
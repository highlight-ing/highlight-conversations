import React from 'react';
import { ConversationData, formatTranscript } from '@/data/conversations';
import { formatTimestamp } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';

interface SharePageComponentProps {
  conversation: ConversationData;
}

const SharePageComponent: React.FC<SharePageComponentProps> = ({ conversation }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{conversation.title || 'Shared Conversation'}</h1>
      <p className="text-gray-500 mb-8">{formatTimestamp(conversation.timestamp)}</p>
      
      {conversation.summarized && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p>{conversation.summary}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Transcript</h2>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {formatTranscript(conversation.transcript, "DialogueTranscript")}
        </pre>
      </div>
      
      <div className="mt-8">
        <Button onClick={() => window.location.href = "https://highlight.ing/download"}>
          Download Highlight
        </Button>
      </div>
    </div>
  );
};

export default SharePageComponent;
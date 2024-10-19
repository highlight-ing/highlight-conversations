import React from 'react';
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons';
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow';
import ClipboardTextIcon from '../Detail/Icon/ClipboardIcon';

interface Message {
  time: string;
  sender: string;
  text: string;
}

const parseTranscript = (transcript: string): Message[] => {
  if (typeof transcript !== 'string') {
    console.error('Invalid transcript provided to parseTranscript:', transcript);
    return [];
  }

  return transcript
    .split('\n')
    .map((line): Message | null => {
      const regex = /^(.+?)\s+(.+?):\s*(.*)$/;
      const match = line.match(regex);
      if (match) {
        const [, time, sender, text] = match;
        return { time, sender, text };
      }
      return null;
    })
    .filter((message): message is Message => message !== null);
};

interface TranscriptProps {
  transcript: string;
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  const messages: Message[] = parseTranscript(transcript);

  const buttons = useTranscriptButtons({
    message: transcript,
    buttonTypes: ['Copy', 'Share', 'Save', 'SendFeedback'],
  });

  return (
    <div className="w-full mt-8 border-t border-[#222222]/50">
      <div className="flex justify-between items-center mt-8 mb-6">
        <h2 className="text-[#eeeeee] text-xl font-semibold font-inter">Transcript</h2>
        <TranscriptButtonRow buttons={buttons} />
      </div>
      <div className="max-h-[calc(100vh-20rem)] overflow-y-auto space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className={`text-[13px] font-medium font-inter leading-tight ${
              message.sender.toLowerCase() === 'me' || message.sender.toLowerCase() === 'self'
                ? "text-[#4ceda0]/40"
                : "opacity-20 text-white"
            }`}>
              {message.time} - {message.sender}:
            </div>
            <div className="text-[#eeeeee] text-[15px] font-normal font-inter leading-normal">
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transcript;
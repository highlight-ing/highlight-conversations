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
    <div className="w-[712px] h-[667px] pt-8 border-t border-[#222222]/50 flex-col justify-start items-start gap-6 inline-flex">
      {/* Header Section */}
      <div className="w-[677px] justify-start items-start gap-4 inline-flex">
        <div className="h-6 justify-between items-center flex">
          <h2 className="text-[#eeeeee] text-xl font-semibold font-inter">Transcript</h2>
          <div className="w-5 h-5 justify-center items-center flex">
            <ClipboardTextIcon />
          </div>
        </div>
      </div>

      {/* Transcript Body */}
      <div className="self-stretch h-[552px] flex-col justify-start items-start gap-6 flex overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="self-stretch h-[120px] flex-col justify-start items-start gap-1 flex">
            <div
              className={`self-stretch text-[13px] font-medium font-inter leading-tight ${
                message.sender.toLowerCase() === 'me' || message.sender.toLowerCase() === 'self'
                  ? 'text-[#4ceda0]/40'
                  : 'opacity-20 text-white'
              }`}
            >
              {message.time} - {message.sender}:
            </div>
            <div className="self-stretch text-[#eeeeee] text-[15px] font-normal font-inter leading-normal">
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Button Row */}
      <TranscriptButtonRow buttons={buttons} />
    </div>
  );
};

export default Transcript;

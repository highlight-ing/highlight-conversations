import React from 'react';
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons';
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow';

interface Message {
  time: string;
  sender: string;
  text: string;
}

// Function to parse the transcript string into messages
const parseTranscript = (transcript: string): Message[] => {
  return transcript
    .split('\n')
    .map((line): Message | null => {
      // Adjusted regex for new format
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

// TranscriptProps interface
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
      <div className="text-[#eeeeee] text-xl font-semibold font-inter">
        Transcript
      </div>
      <div
        className="whitespace-pre-wrap text-primary font-normal text-base leading-7 font-inter"
        style={{
          alignSelf: 'stretch',
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div
              className={
                message.sender.toLowerCase() === 'me' || message.sender.toLowerCase() === 'self'
                  ? "text-[#4ceda0] text-[13px] font-medium font-inter leading-tight"
                  : "opacity-20 text-white text-[13px] font-medium font-inter leading-tight"
              }
            >
              {message.time} - {message.sender}:
            </div>
            <div className="text-[#eeeeee] text-[15px] font-normal font-inter leading-normal">
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <TranscriptButtonRow buttons={buttons} />
    </div>
  );
};

export default Transcript;

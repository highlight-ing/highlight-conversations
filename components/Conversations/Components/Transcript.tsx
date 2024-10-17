import React from 'react'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow'

interface Message {
  time: string;
  sender: 'Me' | 'Others';
  text: string; 
}

interface TranscriptProps {
  messages?: Message[]; 
}

const Transcript: React.FC<TranscriptProps> = ({ messages = [] }) => {
  const buttons = useTranscriptButtons({
    message: messages.map(msg => msg.text).join('\n'),
    buttonTypes: ['Copy', 'Share', 'Save', 'SendFeedback'],
  })

  return (
    <div
      className="flex flex-col items-start gap-3 p-4 rounded-lg"
      style={{
        maxWidth: '100%',
        padding: '16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        borderRadius: '20px',
        background: 'var(--Background-Tertiary, #222)',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      <h2
        className="font-inter text-[13px] font-medium leading-[20px] tracking-tight"
        style={{
          color: 'var(--Text-Secondary, #B4B4B4)',
          letterSpacing: '-0.26px',
        }}
      >
        Transcript
      </h2>
      {messages.map((message, index) => (
        <div key={index} 
            className={`whitespace-pre-wrap text-primary font-normal text-base leading-7 font-inter 
            ${message.sender === 'Me' ? 'text-blue-500' : 'text-gray-500'}`
        }>
          <span className="text-xs text-gray-400">{message.time} - {message.sender}:</span>
          <p>{message.text}</p>
        </div>
      ))}
      <TranscriptButtonRow buttons={buttons} />
    </div>
  )
}

export default Transcript

import React, { useState } from 'react'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow'
import { ClipboardText } from 'iconsax-react'

interface Message {
  time: string
  sender: string
  text: string
}

const parseTranscript = (transcript: string): Message[] => {
  if (typeof transcript !== 'string') {
    console.error('Invalid transcript provided to parseTranscript:', transcript)
    return []
  }

  return transcript
    .split('\n')
    .map((line): Message | null => {
      const regex = /^(.+?)\s+(.+?):\s*(.*)$/
      const match = line.match(regex)
      if (match) {
        const [, time, sender, text] = match
        return { time, sender, text }
      }
      return null
    })
    .filter((message): message is Message => message !== null)
}

interface TranscriptProps {
  transcript: string
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')
  const messages: Message[] = parseTranscript(transcript)

  const buttons = useTranscriptButtons({
    message: transcript,
    buttonTypes: ['Copy', 'Share', 'Save', 'SendFeedback']
  })

  // Function to copy transcript to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        setCopyStatus('success')
        setTimeout(() => setCopyStatus('default'), 2000) // Reset status after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy transcript: ', err)
      })
  }

  return (
    <div className="inline-flex h-[667px] w-[712px] flex-col items-start justify-start gap-6 border-t border-[#222222]/50 pt-8">
      {/* Header Section */}
      <div className="inline-flex w-[677px] items-start justify-start gap-4">
        <div className="flex h-6 w-[132px] items-center justify-between">
          <h2 className="font-inter text-xl font-semibold text-primary">Transcript</h2>
          <button onClick={copyToClipboard} className="flex h-5 w-5 items-center justify-center">
            <ClipboardText
              variant="Bold"
              size={24}
              className={`text-subtle transition-colors transition-transform duration-200 ${
                copyStatus === 'success' ? 'animate-gentle-scale scale-110' : ''
              } hover:text-primary`}
            />
          </button>
        </div>
      </div>

      {/* Transcript Body */}
      <div className="flex h-[552px] flex-col items-start justify-start gap-6 self-stretch overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="flex h-[120px] flex-col items-start justify-start gap-1 self-stretch">
            <div
              className={`font-inter self-stretch text-[13px] font-medium leading-tight ${
                message.sender.toLowerCase() === 'me' || message.sender.toLowerCase() === 'self'
                  ? 'text-[#4ceda0]/40'
                  : 'text-white opacity-20'
              }`}
            >
              {message.time} - {message.sender}:
            </div>
            <div className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee]">
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Button Row */}
      <TranscriptButtonRow buttons={buttons} />
    </div>
  )
}

export default Transcript

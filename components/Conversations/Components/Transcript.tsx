import React, { useState } from 'react'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow'
import { ClipboardText } from 'iconsax-react'
import LoadingSpinner from '../Detail/Icon/Transcript/LoadingSpinnerIcon'

interface Message {
  time: string
  sender: string
  text: string
}

const parseTranscript = (transcript: string): Message[] => {
  // Debug log
  console.log('Incoming transcript:', transcript);

  if (typeof transcript !== 'string') {
    console.error('Invalid transcript provided to parseTranscript:', transcript)
    return []
  }

  return transcript
    .split('\n')
    .map((line): Message | null => {
      // Debug log
      console.log('Processing line:', line);
      
      // Simpler regex that matches time and rest of content
      const regex = /^(\d{2}:\d{2}:\d{2}\s+(?:AM|PM))\s+-\s+(.+?)(?:\s*:\s*|\s+-\s+)(.*)$/
      const match = line.match(regex)
      
      // Debug log
      console.log('Match result:', match);

      if (match) {
        const [, time, sender, text] = match
        const message = { 
          time,
          sender: sender.trim(),
          text: text.trim() || '.' // Use dot if text is empty
        }
        // Debug log
        console.log('Created message:', message);
        return message
      }
      return null
    })
    .filter((message): message is Message => {
      const isValid = message !== null;
      // Debug log
      console.log('Filtering message:', message, 'isValid:', isValid);
      return isValid;
    })
}

interface TranscriptProps {
  transcript: string
  isActive?: boolean
  searchQuery?: string  
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, isActive = false, searchQuery = '' }) => {
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')
  const messages: Message[] = parseTranscript(transcript)

  const buttons = useTranscriptButtons({
    message: transcript,
    // buttonTypes: ['Copy', 'Share', 'Save', 'SendFeedback']
    buttonTypes: ['Copy'] // TODO: Add other buttons
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

  const shouldShowLoadingSpinner = isActive

  return (
    <div className="flex h-fit flex-col items-start justify-start gap-6 border-t border-[#222222]/50 pb-8 pt-8">
      <div className="bg-blue flex items-center justify-between gap-4">
        <h2 className="font-inter text-xl font-semibold text-primary">Transcript</h2>
        <button onClick={copyToClipboard} className="flex h-5 w-5">
          <ClipboardText
            variant="Bold"
            size={20}
            className={`text-subtle transition-colors transition-transform duration-200 ${
              copyStatus === 'success' ? 'animate-gentle-scale scale-110' : ''
            } hover:text-primary`}
          />
        </button>
      </div>
      <div className="flex flex-col items-start justify-start gap-6 self-stretch">
        {shouldShowLoadingSpinner && (
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <LoadingSpinner />
            </div>
            <div className="font-inter text-[15px] font-normal leading-normal text-[#484848]">Taking notes... transcript will update every ~30s</div>
          </div>
        )}
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="flex flex-col items-start justify-start gap-1 self-stretch"
          >
            <div
              className={`font-inter self-stretch text-[13px] font-medium leading-tight select-text ${
                message.sender === 'Me' || message.sender.toLowerCase().includes('self')
                  ? 'text-[#4ceda0]/40'
                  : 'text-white opacity-20'
              }`}
            >
              {message.time} - {message.sender}
            </div>
            <div className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee] select-text">
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <TranscriptButtonRow buttons={buttons} />
    </div>
  )
}

export default Transcript

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardText } from 'iconsax-react'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow'
import LoadingSpinner from '../Detail/Icon/Transcript/LoadingSpinnerIcon'

interface Message {
  time: string
  sender: string
  text: string;
}

const parseTranscript = (transcript: string): Message[] => {
  if (typeof transcript !== 'string') {
    console.error('Invalid transcript provided to parseTranscript:', transcript)
    return []
  }

  return transcript
    .split('\n')
    .map((line): Message | null => {
      const regex = /^(\d{2}:\d{2}:\d{2}\s+(?:AM|PM))\s+-\s+(.+?)(?:\s*:\s*|\s+-\s+)(.*)$/
      const match = line.match(regex)

      if (match) {
        const [, time, sender, text] = match
        return {
          time,
          sender: sender.trim(),
          text: text.trim() || '.'
        };
      }
      return null;
    })
    .filter((message): message is Message => message !== null)
}

interface TranscriptProps {
  transcript: string
  isActive?: boolean
  isEditing?: boolean
  onSave?: (updatedTranscript: string) => void
}

const MessageText = ({ text, isNew }: { text: string; isNew: boolean }) => {
  if (!isNew) {
    return (
      <div className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee] select-text">
        {text}
      </div>
    )
  }

  return (
    <motion.div 
      className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee] select-text"
      initial={{ 
        clipPath: "inset(0 100% 0 0)", 
        filter: "blur(4px)",
        opacity: 0 
      }}
      animate={{ 
        clipPath: "inset(0 0% 0 0)", 
        filter: "blur(0px)",
        opacity: 1 
      }}
      transition={{ 
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.5, delay: 0.2 },
        filter: { duration: 1, delay: 0.2 }
      }}
    >
      {text}
    </motion.div>
  )
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, isActive = false, isEditing = false, onSave }) => {
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')
  const [seenMessageKeys, setSeenMessageKeys] = useState(new Set<string>())
  const [editedTranscript, setEditedTranscript] = useState(transcript)
  const messages = parseTranscript(transcript)
  const hasContent = transcript.trim().length > 0

  useEffect(() => {
    setEditedTranscript(transcript)
  }, [transcript])

  // Create a unique key for each message
  const getMessageKey = (message: Message) => {
    return `${message.time}-${message.sender}-${message.text}`
  }

  // Update seen messages after each animation completes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newSeenMessages = new Set(seenMessageKeys)
      messages.forEach(message => {
        newSeenMessages.add(getMessageKey(message))
      })
      setSeenMessageKeys(newSeenMessages)
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [messages])

  const buttons = useTranscriptButtons({
    message: transcript,
    buttonTypes: ['Copy']
  })

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        setCopyStatus('success')
        setTimeout(() => setCopyStatus('default'), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy transcript: ', err)
      })
  }

  const handleSave = () => {
    onSave?.(editedTranscript)
  }

  if (isEditing) {
    return (
      <div className="flex h-fit flex-col items-start justify-start gap-6 border-t border-[#222222]/50 pb-8 pt-8">
        <div className="flex w-full flex-col gap-4">
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="min-h-[300px] w-full rounded-lg bg-[#222222] p-4 font-inter text-[15px] text-[#eeeeee] focus:outline-none focus:ring-1 focus:ring-[#484848]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditedTranscript(transcript)
                onSave?.(transcript)
              }}
              className="rounded-lg px-4 py-2 font-inter text-[15px] text-[#484848] hover:text-[#eeeeee]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#222222] px-4 py-2 font-inter text-[15px] text-[#eeeeee] hover:bg-[#2a2a2a]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-fit flex-col items-start justify-start gap-6 border-t border-[#222222]/50 pb-8 pt-8">
      <div className="flex flex-col items-start justify-start gap-6 self-stretch">
        {isActive && (
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <LoadingSpinner />
            </div>
            <div className="font-inter text-[15px] font-normal leading-normal text-[#484848]">
              Taking notes... transcript will update every ~30s
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const messageKey = getMessageKey(message);
          const isNewMessage = !seenMessageKeys.has(messageKey);
          
          return (
            <div 
              key={messageKey}
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
              <MessageText text={message.text} isNew={isNewMessage} />
            </div>
          )
        })}
      </div>

      {hasContent && <TranscriptButtonRow buttons={buttons} />}
    </div>
  )
}

export default Transcript
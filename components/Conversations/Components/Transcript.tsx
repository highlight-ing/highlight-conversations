/**
 * @fileoverview Transcript component that displays conversation messages with animation effects.
 * Supports real-time updates, message parsing, and copy functionality.
 * @author Jungyooon Lim, Joanne <joanne@highlight.ing>
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardText } from 'iconsax-react'
import { useTranscriptButtons } from '@/components/Conversations/Detail/TranscriptButtons/useTranscriptButtons'
import { TranscriptButtonRow } from '@/components/Conversations/Detail/TranscriptButtons/TranscriptButtonRow'
import LoadingSpinner from '../Detail/Icon/Transcript/LoadingSpinnerIcon'

/**
 * Represents a single message in the transcript
 */
interface Message {
  time: string          // Timestamp of the message
  sender: string        // Name of the message sender
  text: string          // Content of the message
}

/**
 * Parses raw transcript text into structured Message objects
 * Format: "HH:MM:SS AM/PM - Sender: Message"
 * 
 * @param transcript - Raw transcript string to parse
 * @returns Array of parsed Message objects
 */
const parseTranscript = (transcript: string): Message[] => {
  if (typeof transcript !== 'string') {
    console.error('Invalid transcript provided to parseTranscript:', transcript)
    return []
  }

  return transcript
    .split('\n')
    .map((line): Message | null => {
      // Regex matches format: "12:34:56 AM - Sender: Message" or "12:34:56 AM - Sender - Message"
      const regex = /^(\d{2}:\d{2}:\d{2}\s+(?:AM|PM))\s+-\s+(.+?)(?:\s*:\s*|\s+-\s+)(.*)$/
      const match = line.match(regex)

      if (match) {
        const [, time, sender, text] = match
        return {
          time,
          sender: sender.trim(),
          text: text.trim() || '.'
        }
      }
      return null
    })
    .filter((message): message is Message => message !== null)
}

interface TranscriptProps {
  /** Raw transcript text to display */
  transcript: string
  /** Whether the transcript is currently being updated */
  isActive?: boolean
}

/**
 * Renders a single message with optional animation for new messages
 */
const MessageText = ({ text, isNew }: { text: string; isNew: boolean }) => {
  if (!isNew) {
    return (
      <div className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee] select-text">
        {text}
      </div>
    )
  }

  // Animated entrance for new messages
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

/**
 * Main transcript component that displays conversation messages
 * Supports real-time updates, copy functionality, and message animations
 */
const Transcript: React.FC<TranscriptProps> = ({ transcript, isActive = false }) => {
  // Track copy button state
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')
  // Track which messages have been animated
  const [seenMessageKeys, setSeenMessageKeys] = useState(new Set<string>())
  
  const messages = parseTranscript(transcript)
  const hasContent = transcript.trim().length > 0

  /**
   * Generates a unique key for each message based on its content
   */
  const getMessageKey = (message: Message) => {
    return `${message.time}-${message.sender}-${message.text}`
  }

  // Mark messages as seen after animation completes
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

  // Initialize transcript action buttons
  const buttons = useTranscriptButtons({
    message: transcript,
    buttonTypes: ['Copy']
  })

  /**
   * Handles copying transcript to clipboard
   */
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
  
  return (
    <div className="flex h-fit flex-col items-start justify-start gap-6 border-t border-[#222222]/50 pb-8 pt-8">
      {/* Header Section */}
      <div className="bg-blue flex items-center justify-between gap-4">
        <h2 className="font-inter text-xl font-semibold text-primary">Transcript</h2>
        {hasContent && (
          <button onClick={copyToClipboard} className="flex h-5 w-5">
            <ClipboardText
              variant="Bold"
              size={20}
              className={`text-subtle transition-colors transition-transform duration-200 ${
                copyStatus === 'success' ? 'animate-gentle-scale scale-110' : ''
              } hover:text-primary`}
            />
          </button>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="flex flex-col items-start justify-start gap-6 self-stretch">
        {/* Loading Indicator */}
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

        {/* Message List */}
        {messages.map((message, index) => {
          const messageKey = getMessageKey(message)
          const isNewMessage = !seenMessageKeys.has(messageKey)
          
          return (
            <div 
              key={messageKey}
              className="flex flex-col items-start justify-start gap-1 self-stretch"
            >
              {/* Message Header */}
              <div
                className={`font-inter self-stretch text-[13px] font-medium leading-tight select-text ${
                  message.sender === 'Me' || message.sender.toLowerCase().includes('self')
                    ? 'text-[#4ceda0]/40'
                    : 'text-white opacity-20'
                }`}
              >
                {message.time} - {message.sender}
              </div>
              {/* Message Content */}
              <MessageText text={message.text} isNew={isNewMessage} />
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      {hasContent && <TranscriptButtonRow buttons={buttons} />}
    </div>
  )
}

export default Transcript
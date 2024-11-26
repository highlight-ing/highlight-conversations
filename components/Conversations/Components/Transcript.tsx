import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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

interface InlineEditProps {
  content: string
  isEditing: boolean
  onSave: (content: string) => void
  lastSaved?: Date
}

const InlineEdit: React.FC<InlineEditProps> = ({ content, isEditing, onSave, lastSaved }) => {
  const [editableContent, setEditableContent] = useState(content)
  const editRef = useRef<HTMLDivElement>(null)
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>('')

  useEffect(() => {
    if (lastSaved) {
      const interval = setInterval(() => {
        const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000)
        if (seconds < 60) {
          setTimeSinceLastSave(`${seconds}s ago`)
        } else if (seconds < 3600) {
          setTimeSinceLastSave(`${Math.floor(seconds / 60)}m ago`)
        } else {
          setTimeSinceLastSave(`${Math.floor(seconds / 3600)}h ago`)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lastSaved])

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus()
    }
  }, [isEditing])

  const handleBlur = () => {
    if (editableContent !== content) {
      onSave(editableContent)
    }
  }

  return (
    <div className="relative group">
      {lastSaved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-6 right-0 text-xs text-[#484848]"
        >
          Last saved {timeSinceLastSave}
        </motion.div>
      )}
      <div
        ref={editRef}
        contentEditable={isEditing}
        onBlur={handleBlur}
        onInput={(e) => setEditableContent(e.currentTarget.textContent || '')}
        className={`font-inter text-[15px] leading-normal text-[#eeeeee]
                   transition-all duration-200 ease-in-out
                   ${isEditing 
                     ? 'cursor-text selection:bg-[#4ceda0]/20 selection:text-white' 
                     : 'cursor-default'
                   }
                   focus:outline-none
                   rounded-sm
                   ${isEditing && 'hover:bg-white/[0.02] focus:bg-white/[0.03]'}
                   p-1 -m-1
                   whitespace-pre-wrap`}
        suppressContentEditableWarning={true}
      >
        {content}
      </div>
    </div>
  )
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, isActive = false, isEditing = false, onSave }) => {
  const [seenMessageKeys, setSeenMessageKeys] = useState(new Set<string>())
  const [lastSaved, setLastSaved] = useState<Date>()
  const messages = parseTranscript(transcript)
  const hasContent = transcript.trim().length > 0

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

  const handleSave = (newContent: string) => {
    onSave?.(newContent)
    setLastSaved(new Date())
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
          const messageKey = getMessageKey(message)
          
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
              <InlineEdit 
                content={message.text} 
                isEditing={isEditing}
                onSave={(newText) => {
                  // Update the specific message's text and reconstruct transcript
                  const updatedMessages = [...messages]
                  updatedMessages[index] = { ...message, text: newText }
                  const newTranscript = updatedMessages
                    .map(m => `${m.time} - ${m.sender}: ${m.text}`)
                    .join('\n')
                  handleSave(newTranscript)
                }}
                lastSaved={lastSaved}
              />
            </div>
          )
        })}
      </div>

      {hasContent && <TranscriptButtonRow buttons={buttons} />}
    </div>
  )
}

export default Transcript
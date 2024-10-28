import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
}

interface DisplayedMessage {
  message: Message
  displayedWords: string[]
  firstNewWordIndex: number
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, isActive = false }) => {
  const [copyStatus, setCopyStatus] = useState<'default' | 'success'>('default')
  const messages: Message[] = parseTranscript(transcript)
  const [displayedMessages, setDisplayedMessages] = useState<DisplayedMessage[]>([])
  const [firstNewMessageIndex, setFirstNewMessageIndex] = useState<number>(0);

  // Update displayedMessages when messages change
  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const newMessages = messages.slice(displayedMessages.length).map((message) => ({
        message,
        displayedWords: [],
        firstNewWordIndex: 0,
      }));
      setDisplayedMessages((prev) => [...prev, ...newMessages]);
      setFirstNewMessageIndex(displayedMessages.length);
    }
  }, [messages, displayedMessages]);

  // Update displayed words for each message
  useEffect(() => {
    const updatedDisplayedMessages = displayedMessages.map((item) => {
      const words = item.message.text.split(' ');
      if (words.length > item.displayedWords.length) {
        const newFirstNewWordIndex = item.displayedWords.length;
        return {
          ...item,
          displayedWords: words,
          firstNewWordIndex: newFirstNewWordIndex,
        };
      }
      return item;
    });
    setDisplayedMessages(updatedDisplayedMessages);
  }, [messages, displayedMessages]);

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
            <div className="font-inter text-[15px] font-normal leading-normal text-[#484848]">
              Taking notes... transcript will update every ~30s
            </div>
          </div>
        )}
        {displayedMessages.map((message, messageIndex) => {
          // Determine if this is a new message
          const isNewMessage = messageIndex >= firstNewMessageIndex;

          // Split the message text into words
          const words = message.message.text.split(' ');

          // State to track the index from where new words start (for each message)
          const [displayedWords, setDisplayedWords] = useState<string[]>([]);
          const [firstNewWordIndex, setFirstNewWordIndex] = useState<number>(0);

          useEffect(() => {
            if (words.length > displayedWords.length) {
              const newFirstNewWordIndex = displayedWords.length;
              setDisplayedWords(words);
              setFirstNewWordIndex(newFirstNewWordIndex);
            }
          }, [words, displayedWords.length]);

          return (
            <div
              key={`${message.message.time}-${message.message.sender}-${messageIndex}`}
              className="flex flex-col items-start justify-start gap-1 self-stretch"
            >
              <div
                className={`font-inter self-stretch text-[13px] font-medium leading-tight select-text ${
                  message.message.sender === 'Me' || message.message.sender.toLowerCase().includes('self')
                    ? 'text-[#4ceda0]/40'
                    : 'text-white opacity-20'
                }`}
              >
                {message.message.time} - {message.message.sender}
              </div>
              <div className="font-inter self-stretch text-[15px] font-normal leading-normal text-[#eeeeee] select-text">
                {displayedWords.map((word, wordIndex) => {
                  const isNewWord = isNewMessage && wordIndex >= firstNewWordIndex;
                  return isNewWord ? (
                    <motion.span
                      key={`${messageIndex}-${wordIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: wordIndex * 0.05 }}
                      style={{ display: 'inline-block', marginRight: '4px' }}
                    >
                      {word}{' '}
                    </motion.span>
                  ) : (
                    <span
                      key={`${messageIndex}-${wordIndex}`}
                      style={{ display: 'inline-block', marginRight: '4px' }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <TranscriptButtonRow buttons={buttons} />
    </div>
  );
};

export default Transcript;
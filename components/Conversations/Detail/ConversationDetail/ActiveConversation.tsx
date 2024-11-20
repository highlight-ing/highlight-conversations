/**
 * @fileoverview ActiveConversation component that handles real-time audio transcription display
 * @author Jungyoon Lim, Joanne <joanne@highlight.ing>
 * @created October 2024
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Highlight from '@highlight-ai/app-runtime'
import BigGreenSoundIcon from '../Icon/DetailIcons/ActiveConversationIcon/BigGreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import { ConversationData } from '@/data/conversations'
import Transcript from '../../Components/Transcript'
import { formatTimestampWithTimer } from '@/utils/dateUtils'
import { HighlightEvent } from '@highlight-ai/app-runtime'

// Types
interface SaveButtonProps {
  onClick: () => void
  text: string
}

interface HeaderProps {
  hasTranscription: boolean
  onSave: () => void
}

// Constants
const CLASSES = {
  container: 'relative flex max-h-full flex-col overflow-y-scroll px-16 pt-12',
  header: {
    wrapper: 'mb-6 flex w-full flex-row justify-between',
    iconContainer: 'flex items-center gap-[13px]',
    icon: 'flex h-8 w-8 items-center justify-center',
    title: 'font-inter text-2xl font-semibold leading-[31px] text-white'
  },
  saveButton: {
    base: [
      'flex cursor-pointer items-center justify-center gap-2',
      'rounded-[10px] bg-white/10 px-4 py-1.5',
      'text-[15px] font-medium leading-tight',
      'text-[#b4b4b4] hover:bg-white/20'
    ].join(' '),
    text: {
      desktop: 'hidden lg:block',
      mobile: 'block lg:hidden'
    }
  },
  timer: 'font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]',
  transcript: 'transition-all duration-300 ease-in-out'
} as const

// Components
const SaveButton: React.FC<SaveButtonProps> = ({ onClick, text }) => (
  <button onClick={onClick} className={CLASSES.saveButton.base}>
    <span className={CLASSES.saveButton.text.desktop}>{text}</span>
    <span className={CLASSES.saveButton.text.mobile}>Save</span>
  </button>
)

const Header: React.FC<HeaderProps> = ({ hasTranscription, onSave }) => (
  <div className={CLASSES.header.wrapper}>
    <div className={CLASSES.header.iconContainer}>
      <div className={CLASSES.header.icon}>
        <BigGreenSoundIcon />
      </div>
      <h1 className={CLASSES.header.title}>
        Transcribing...
      </h1>
    </div>
    {hasTranscription && (
      <SaveButton 
        onClick={onSave} 
        text="Save Transcript Now" 
      />
    )}
  </div>
)

// Hooks
const useHighlightEvents = (events: Partial<Record<HighlightEvent, (data?: any) => void>>, deps: any[] = []) => {
  useEffect(() => {
    const cleanupFns = Object.entries(events).map(([event, handler]) => {
      return Highlight.app.addListener(event as HighlightEvent, handler)
    })

    return () => {
      cleanupFns.forEach(cleanup => cleanup())
    }
  }, deps)
}

const useActiveConversation = () => {
  const { 
    currentConversation, 
    saveCurrentConversation, 
    elapsedTime, 
    isAudioOn 
  } = useConversations()
  
  const [startTime, setStartTime] = useState<Date | null>(null)
  const startTimeRef = useRef(startTime)
  const hasTranscription = currentConversation.trim().length > 0

  // Keep ref in sync with state
  useEffect(() => {
    startTimeRef.current = startTime
  }, [startTime])

  // Handle conversation updates
  const handleConversationUpdate = useCallback(() => {
    if (startTimeRef.current === null) {
      setStartTime(new Date())
    }
  }, [])

  // Handle conversation saves
  const handleConversationSave = useCallback(() => {
    setStartTime(null)
  }, [])

  // Setup event listeners
  useHighlightEvents({
    'onCurrentConversationUpdate': handleConversationUpdate,
    'onConversationSaved': handleConversationSave
  }, [isAudioOn])

  const handleSaveTranscript = useCallback(() => {
    saveCurrentConversation()
  }, [saveCurrentConversation])

  return {
    currentConversation,
    hasTranscription,
    startTime,
    elapsedTime,
    handleSaveTranscript
  }
}

/**
 * ActiveConversation component displays the current transcription session
 * including the transcribed text, elapsed time, and save controls.
 */
export const ActiveConversation: React.FC = () => {
  const {
    currentConversation,
    hasTranscription,
    startTime,
    elapsedTime,
    handleSaveTranscript
  } = useActiveConversation()

  // jsx component 
  return (
    <div className={CLASSES.container}>
      <Header 
        hasTranscription={hasTranscription} 
        onSave={handleSaveTranscript} 
      />
      
      <div className={CLASSES.timer}>
        {formatTimestampWithTimer(startTime ?? new Date(), elapsedTime * 1000)}
      </div>
      
      <div className={CLASSES.transcript}>
        <Transcript 
          transcript={currentConversation} 
          isActive={true} 
        />
      </div>
    </div>
  )
}

export default ActiveConversation

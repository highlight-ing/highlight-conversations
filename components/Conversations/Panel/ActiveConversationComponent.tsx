import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'
import { Sound } from 'iconsax-react'
import { cn } from '@/lib/utils'

type AudioState = 'active' | 'inactive' | 'off' | 'noPermissions' | 'saving'

const DEBOUNCE_TIMES = {
  SLOW: 30000,  // 30 seconds
  FAST: 100,    // 100ms
  SAVE: 60000   // 60 seconds
} as const

const useAudioStateManager = () => {
  const [audioState, setAudioState] = useState<AudioState>('inactive')
  const { 
    micActivity, 
    isSaving, 
    isAudioOn, 
    setIsAudioOn, 
    saveCurrentConversation 
  } = useConversations()

  const slowDebounce = useDebouncedCallback(
    () => setAudioState('inactive'),
    DEBOUNCE_TIMES.SLOW
  )

  const fastDebounce = useDebouncedCallback(
    () => setAudioState('active'),
    DEBOUNCE_TIMES.FAST
  )

  const saveDebounce = useDebouncedCallback(
    saveCurrentConversation,
    DEBOUNCE_TIMES.SAVE
  )

  const updateAudioState = useCallback(() => {
    if (!isAudioOn) {
      setAudioState('off')
      saveDebounce.cancel()
      return
    }

    if (isSaving) {
      setAudioState('saving')
      return
    }

    if (micActivity > 0) {
      fastDebounce()
      saveDebounce.cancel()
    } else {
      slowDebounce()
      saveDebounce()
      setAudioState('inactive')
    }
  }, [isAudioOn, micActivity, isSaving, fastDebounce, slowDebounce, saveDebounce])

  useEffect(() => {
    updateAudioState()
  }, [updateAudioState])

  const handleToggle = () => {
    const newIsOn = !isAudioOn
    setIsAudioOn(newIsOn)
    setAudioState(newIsOn ? (micActivity > 0 ? 'active' : 'inactive') : 'off')
    if (!newIsOn) {
      saveDebounce.cancel()
    }
  }

  return {
    audioState,
    isAudioOn,
    handleToggle,
    saveDebounce
  }
}

interface AudioStatusProps {
  audioState: AudioState
  onSelect: () => void
}

const AudioStatus: React.FC<AudioStatusProps> = ({ audioState, onSelect }) => {
  const getStatusMessage = (state: AudioState) => {
    const messages = {
      active: 'Transcribing audio...',
      saving: 'Saving transcript...',
      off: 'Enable Highlight Meetings',
      inactive: 'No audio detected',
      noPermissions: 'Microphone permissions required'
    }
    return messages[state]
  }

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848'
  }

  return (
    <div
      className={cn(
        'flex w-full cursor-pointer flex-col items-start justify-start gap-4 rounded-2xl border px-5 py-4 transition-all duration-500',
        audioState !== 'active' ? 'border-primary/50' : 'border-green/20',
        audioState === 'active' && 'hover:bg-green/20'
      )}
      onClick={audioState !== 'off' ? onSelect : undefined}
    >
      <div className="flex h-6 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-6 w-6 items-center justify-center">
            <Sound color={getSoundIconColor()} />
          </div>
          <div
            className={cn(
              'font-inter text-[15px] font-medium leading-normal transition-all duration-500',
              audioState === 'active' ? 'text-[#eeeeee]' : 'text-[#3a3a3a]'
            )}
          >
            {getStatusMessage(audioState)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface EnableAudioButtonProps {
  isAudioOn: boolean
  onToggle: () => void
}

const EnableAudioButton: React.FC<EnableAudioButtonProps> = ({ isAudioOn, onToggle }) => {
  if (isAudioOn) return null

  return (
    <AnimatePresence>
      <motion.button
        onClick={onToggle}
        className="mt-6 flex w-full flex-col gap-2 rounded-xl bg-[#00dbfb]/20 hover:bg-[#00dbfb]/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex w-full items-center justify-center rounded-xl px-8 py-[14px]">
          <div className="font-inter text-[17px] font-medium leading-tight text-[#00e6f5]">
            Enable Audio Transcription
          </div>
        </div>
      </motion.button>
    </AnimatePresence>
  )
}

export default function ActiveConversationComponent() {
  const { handleCurrentConversationSelect } = useConversations()
  const { audioState, isAudioOn, handleToggle } = useAudioStateManager()

  return (
    <div className="mb-6 flex w-full flex-col">
      <AudioStatus 
        audioState={audioState} 
        onSelect={handleCurrentConversationSelect} 
      />
      <EnableAudioButton 
        isAudioOn={isAudioOn} 
        onToggle={handleToggle} 
      />
    </div>
  )
}
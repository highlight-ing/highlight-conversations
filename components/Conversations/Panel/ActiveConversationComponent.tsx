import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'
import { Sound } from 'iconsax-react'

type AudioState = 'active' | 'inactive' | 'off' | 'noPermissions' | 'saving'

const ACTIVE_LINE_COLOR = 'rgba(76, 237, 160, 1.0)'
const INACTIVE_LINE_COLOR = 'rgba(72, 72, 72, 1)'

export default function ActiveConversationComponent() {
  const [audioState, setAudioState] = useState<AudioState>('inactive')
  const { micActivity, isSaving, isAudioOn, setIsAudioOn, saveCurrentConversation, handleCurrentConversationSelect } =
    useConversations()

  const slowDebounce = useDebouncedCallback(
    () => {
      setAudioState('inactive')
    },
    30000 // 30 seconds debounce for transitioning to inactive
  )

  const fastDebounce = useDebouncedCallback(
    () => {
      setAudioState('active')
    },
    100 // 100ms debounce for transitioning to active
  )

  const saveDebounce = useDebouncedCallback(
    () => {
      saveCurrentConversation()
    },
    60000 // 60 seconds debounce for saving transcript
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

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848'
  }

  return (
    <div className="mb-6 flex w-full flex-col">
      <div
        className={`flex w-full cursor-pointer flex-col items-start justify-start gap-4 rounded-2xl border ${audioState !== 'active' ? 'border-primary/50' : 'border-green/20'} px-5 py-4 transition-all duration-500 ${audioState === 'active' && 'hover:bg-green/20'}`}
        onClick={audioState !== 'off' ? handleCurrentConversationSelect : undefined}
      >
        <div className="flex h-6 w-full items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-6 w-6 items-center justify-center">
                <Sound color={getSoundIconColor()} />
              </div>
              <div
                className={`font-inter duaration-500 text-[15px] font-medium leading-normal ${audioState === 'active' ? 'text-[#eeeeee]' : 'text-[#3a3a3a]'} transition-all`}
              >
                {audioState === 'active' && 'Transcribing audio...'}
                {audioState === 'saving' && 'Saving transcript...'}
                {audioState === 'off' && 'Enable Highlight Meetings'}
                {audioState === 'inactive' && 'No audio detected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isAudioOn && (
          <motion.button
            onClick={handleToggle}
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
        )}
      </AnimatePresence>
    </div>
  )
}

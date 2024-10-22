import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'
import SoundIcon from '../Detail/Icon/SoundIcon'
import GreenSoundIcon from '../Detail/Icon/GreenSoundIcon'
import MicrophoneIcon from '../Detail/Icon/MicrophoneIcon'

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
    <div className="flex h-full w-full flex-col">
      {/* Box 1 */}
      {audioState === 'active' ? (
        <div
          className="flex h-14 w-full cursor-pointer flex-col items-start justify-start gap-4 rounded-2xl border border-[#4ceda0]/20 px-5 py-4"
          onClick={handleCurrentConversationSelect}
        >
          <div className="flex h-6 w-full items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center">
                  <GreenSoundIcon />
                </div>
                <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">
                  Transcribing Audio...
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-[26px] items-center justify-end gap-1.5">
                <div className="font-['Public Sans'] text-right text-xs font-normal leading-snug text-white/40">ON</div>
                <div className="relative h-[26px] w-[49px] rounded-2xl">
                  <div className="absolute h-[26px] w-[49px] rounded-full bg-[#00cc88]" />
                  <div className="absolute left-[24px] top-[1px] h-6 w-6 rounded-full bg-white shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 flex w-full flex-col gap-2 rounded-2xl border border-[#222222] py-2">
          <div className="flex w-full items-center justify-between overflow-hidden rounded-t-2xl px-6 py-2 pr-3">
            <div className="flex w-full items-center gap-4">
              <div className="flex items-center">
                <SoundIcon color={getSoundIconColor()} />
              </div>
              <div className="font-inter text-[15px] font-medium leading-normal text-[#3a3a3a]">
                {audioState === 'saving' && 'Saving transcript...'}
                {audioState === 'off' && <span className="text-[#3a3a3a]">Enable Highlight Audio transcriptions</span>}
                {audioState === 'inactive' && <span className="text-[#3a3a3a]">No active transcription</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Box 3: Enable Audio Transcriptions */}
      <AnimatePresence>
        {!isAudioOn && (
          <motion.button
            onClick={handleToggle}
            className="mb-8 flex w-full flex-col gap-2 rounded-xl bg-[#00dbfb]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-12 w-full items-center justify-center rounded-xl">
              <div className="font-inter text-[17px] font-medium leading-tight text-[#00e6f5]">
                Enable Audio Transcriptions
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}


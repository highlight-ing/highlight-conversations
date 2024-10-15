import React, { useState, useEffect, useCallback, useMemo } from 'react'
import AnimatedVoiceSquare from '@/components/ui/icons/AnimatedVoiceSquare'
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '@/components/ui/button' // Make sure to import the Button component
import SoundIcon from '../Detail/Icon/SoundIcon'

type AudioState = 'active' | 'inactive' | 'off' | 'noPermissions' | 'saving'

const ACTIVE_LINE_COLOR = 'rgba(76, 237, 160, 1.0)'
const INACTIVE_LINE_COLOR = 'rgba(72, 72, 72, 1)'

export default function ActiveConversationComponent() {
  const [audioState, setAudioState] = useState<AudioState>('active')
  const [visualState, setVisualState] = useState<AudioState>('active')
  const { micActivity, elapsedTime, currentConversation, isSaving, isAudioOn, setIsAudioOn, saveCurrentConversation } =
    useConversations()

  const [isActive, setIsActive] = useState(false)

  const slowDebounce = useDebouncedCallback(
    (newState: AudioState) => {
      setVisualState(newState)
    },
    2500, // 2.5 seconds debounce for visual changes
  )

  const fastDebounce = useDebouncedCallback(
    (newState: AudioState) => {
      setAudioState(newState)
      setVisualState(newState)
    },
    100, // 100ms debounce for going to active
  )

  const updateAudioState = useCallback(() => {
    if (!isAudioOn) {
      setAudioState('off')
      setVisualState('off')
      setIsActive(false)
      return
    }

    if (isSaving) {
      setAudioState('saving')
      setVisualState('saving')
      return
    }

    if (micActivity > 0) {
      fastDebounce('active')
      setIsActive(true)
      slowDebounce.cancel() // Cancel any pending slow debounce
    } else {
      setAudioState('inactive')
      slowDebounce('inactive')
      setIsActive(false)
    }
  }, [isAudioOn, micActivity, isSaving, fastDebounce, slowDebounce])

  useEffect(() => {
    updateAudioState()
  }, [updateAudioState])

  const handleToggle = () => {
    const newIsOn = !isAudioOn
    setIsAudioOn(newIsOn)
    setAudioState(newIsOn ? (micActivity > 0 ? 'active' : 'inactive') : 'off')
  }

  const handleSave = async () => {
    await saveCurrentConversation()
  }

  const formatElapsedTime = (seconds: number): string => {
    // bug fix for showing 0s when not being recorded 
    if (seconds < 0) {
      return '0s';
    }
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}min ${remainingSeconds}s`
  }

  const getContent = () => {
    const formattedTime = formatElapsedTime(elapsedTime)

    return (
      <div className="flex-grow flex items-center">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-sm">
          {audioState === 'saving' ? (
            <span className="inline-block">Saving Transcript</span>
          ) : (
            <span className="inline-block">Transcribing | {formattedTime}</span>
          )}
        </p>
      </div>
    )
  }

  const containerClasses = `
    mx-auto flex w-full items-center justify-between rounded-[20px] py-[20px] px-3
    transition-all duration-300 ease-in-out
    ${
      visualState === 'active' || visualState === 'saving'
        ? 'border border-green bg-green-20'
        : 'border border-tertiary bg-primary'
    }
  `

  return (
        <div className="flex flex-col rounded-2xl border mb-8 border-[#222222] gap-px py-2">
            <div className="flex justify-between items-center py-3 px-6 pr-3 rounded-t-2xl overflow-hidden">
        <div className="pr-[222px] justify-start items-center flex">
            <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                <div className="w-6 h-6 justify-center items-center flex">
                <div className="w-6 h-6 justify-center items-center inline-flex">
                        <SoundIcon />
                    </div>
                </div>
                <div className="text-[#3a3a3a] text-[15px] font-medium font-inter leading-normal">No active transcription</div>
            </div>
        </div>
    </div>
</div>

  )
}

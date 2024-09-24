import React, { useState, useEffect, useCallback, useMemo } from 'react'
import AnimatedVoiceSquare from '@/components/Conversations/icons/AnimatedVoiceSquare'
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '@/components/ui/button' // Make sure to import the Button component

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
        <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-xs">
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
    <div className={containerClasses}>
      <div className="flex w-full items-center gap-2">
        <div className="flex-shrink-0">
          <AnimatedVoiceSquare
            width={20}
            height={20}
            backgroundColor="transparent"
            lineColor={visualState === 'active' || visualState === 'saving' ? ACTIVE_LINE_COLOR : INACTIVE_LINE_COLOR}
            shouldAnimate={visualState === 'active' || visualState === 'saving'}
            transitionDuration={2500}
          />
        </div>
        {getContent()}
      </div>
      <div className="flex items-center">
        {(visualState === 'active' || visualState === 'saving') && (
          <Button
            onClick={saveCurrentConversation}
            disabled={isSaving}
            className="px-3 h-[24px] text-[12px] bg-white/10 rounded-[6px] leading-tight"
          >
            {isSaving ? 'Saving...' : 'View'}
          </Button>
        )}
      </div>
    </div>
  )
}

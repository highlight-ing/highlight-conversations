import React, { useState, useMemo, useEffect } from 'react'
import SoundIcon from '../Detail/Icon/SoundIcon'
import GreenSoundIcon from '../Detail/Icon/GreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import AutoSaveSelection from './AutoSaveSelection'
import AutoClearSelection from './AutoClearSelection'
import AsrDurationSelection from './AsrDurationSelection'
import AsrCloudFallbackSelection from './AsrCloudFallbackSelection'

type AudioState = 'active' | 'inactive' | 'off'

const SettingsPage: React.FC = () => {
  // Conversation State
  const { isAudioOn, setIsAudioOn, conversations, deleteAllConversations } = useConversations()
  // Audio Transcription State
  const [audioState, setAudioState] = useState<AudioState>('inactive')
  const [asrDuration, setAsrDuration] = useState<number>(2)

  // Initialize audioState based on isAudioOn
  useEffect(() => {
    setAudioState(isAudioOn ? 'active' : 'off')
  }, [isAudioOn])

  // Toggle Audio Transcription
  const handleToggle = () => {
    const newIsOn = !isAudioOn
    setIsAudioOn(newIsOn)
    setAudioState(newIsOn ? 'active' : 'off')
  }

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848'
  }

  return (
    <>
      {/* Audio Transcription */}
      <div
        className={`mb-8 h-14 w-full rounded-2xl border px-5 py-4 ${
          audioState !== 'off' ? 'border-[#4ceda0]/20' : 'border-[#222222]'
        } flex flex-col items-start justify-start gap-4 transition-all duration-500`}
      >
        <div className="flex h-6 w-full items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-6 w-6 items-center justify-center">
                {audioState === 'active' ? <GreenSoundIcon /> : <SoundIcon color={getSoundIconColor()} />}
              </div>
              <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">
                {audioState === 'active' ? 'Transcribing Audio...' : 'Audio Transcription Off'}
              </div>
            </div>
          </div>

          {/* Toggle Audio Transcription */}
          <div className="flex items-center gap-2">
            <button onClick={handleToggle} className="font-publicsans flex items-center gap-1.5 text-xs">
              <div
                className={`text-right ${
                  audioState !== 'off' ? 'text-[#00cc88]' : 'text-white/40'
                } font-['Public Sans'] text-xs font-normal leading-snug`}
              >
                {audioState !== 'off' ? 'ON' : 'OFF'}
              </div>
              <div className="relative h-[26px] w-[49px] rounded-2xl">
                <div
                  className={`absolute left-0 top-0 h-[26px] w-[49px] ${
                    audioState !== 'off' ? 'bg-[#00cc88]' : 'bg-black'
                  } rounded-full transition-all duration-500`}
                />
                <div
                  className={`absolute h-6 w-6 ${
                    audioState !== 'off' ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
                  } top-[1px] rounded-full shadow transition-all duration-500`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {audioState !== 'off' && (
        <>
          <div className="mb-8 flex flex-col gap-px">
            <div className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white/[0.02] px-6 py-3 pr-3">
              <div className="font-inter text-[15px] font-medium leading-6 text-[#EEEEEE]">Auto Save</div>
              <AutoSaveSelection />
            </div>

            <div className="rounded-b-2xl bg-white/[0.02] px-6 py-4">
              <div className="font-inter text-[15px] font-normal leading-6 text-[#B4B4B4] opacity-50">
                Highlight will automatically save your conversation transcript after this duration of silence
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-px">
            <div className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white/[0.02] px-6 py-3 pr-3">
              <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">Auto Clear</div>
              <AutoClearSelection />
            </div>
            <div className="rounded-b-2xl bg-white/[0.02] px-6 py-4">
              <div className="font-inter shrink grow basis-0 text-[15px] font-normal leading-normal text-[#b4b4b4] opacity-50">
                Highlight will automatically delete all of your conversation transcripts based on this setting
              </div>
            </div>
          </div>
        </>
      )}

      {/* Audio Transcript Duration */}
      <div className="mb-8 flex flex-col gap-px">
        <div className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white/[0.02] px-6 py-3 pr-3">
          <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">
            Audio Transcript Duration
          </div>
          <AsrDurationSelection />
        </div>

        <div className="rounded-b-2xl bg-white/[0.02] px-6 py-4">
          <div className="font-inter shrink grow basis-0 text-[15px] font-normal leading-normal text-[#b4b4b4] opacity-50">
            Length of audio transcript duration that will be stored in memory. In the interest of your privacy, there is
            no data saved anywhere.
          </div>
        </div>
      </div>

      {/* Cloud Transcript */}

      <div className="mb-8 flex flex-col gap-px">
        <div className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white/[0.02] px-6 py-3 pr-3">
          <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">Cloud Transcript</div>
          <AsrCloudFallbackSelection />
        </div>

        <div className="rounded-b-2xl bg-white/[0.02] px-6 py-4">
          <div className="font-inter shrink grow basis-0 text-[15px] font-normal leading-normal text-[#b4b4b4] opacity-50">
            Allow transcription to work in the cloud whenever your device is unable to transcribe your conversations
            locally. No audio or text transcription is stored anywhere to protect your privacy.
          </div>
        </div>
      </div>

      {/* Delete Button */}
      {conversations.length > 0 && (
        <div className="mb-8 flex flex-col gap-px">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#222222] bg-white/[0.02] px-6 py-3 pr-3">
                <div className="font-inter text-[17px] font-medium leading-tight text-[#ff3333]">
                  Delete All Transcripts
                </div>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your transcripts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAllConversations}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  )
}

export default SettingsPage

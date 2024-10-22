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

type AudioState = 'active' | 'inactive' | 'off'

const SettingsPage: React.FC = () => {
  // Conversation State
  const { isAudioOn, setIsAudioOn, conversations } = useConversations()
  // Audio Transcription State
  const [audioState, setAudioState] = useState<AudioState>('inactive')
  const [asrDuration, setAsrDuration] = useState<number>(2)
  const [isCloudTranscriptOn, setIsCloudTranscriptOn] = useState<boolean>(true)
  const { deleteAllConversations } = useConversations()

  // Initialize audioState based on isAudioOn
  useEffect(() => {
    setAudioState(isAudioOn ? 'active' : 'off')
  }, [isAudioOn])

  // Options for the dropdown (box 3)
  const asrDurationOptions = useMemo(() => {
    return [
      { label: '2 hours', value: 2 },
      { label: '4 hours', value: 4 },
      { label: '8 hours', value: 8 },
      { label: '12 hours', value: 12 },
      { label: '24 hours', value: 24 }
    ]
  }, [])
  const handleAsrDurationChange = (option: { value: number }) => {
    setAsrDuration(option.value)
  }

  // Toggle Audio Transcription
  const handleToggle = () => {
    const newIsOn = !isAudioOn
    setIsAudioOn(newIsOn)
    setAudioState(newIsOn ? 'active' : 'off')
  }

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848'
  }

  const handleCloudToggle = () => {
    setIsCloudTranscriptOn(!isCloudTranscriptOn)
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
      {/* <div className="mb-8 flex flex-col gap-px">
        <div className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white/[0.02] px-6 py-3 pr-3">
          <div className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">
            Audio Transcript Duration
          </div>
          <div>
            <Dropdown
              key={asrDuration}
              value={asrDuration}
              onSelect={handleAsrDurationChange}
              options={asrDurationOptions}
              style={{ minWidth: '100px' }}
            />
          </div>
        </div>

        <div className="rounded-b-2xl bg-white/[0.02] px-6 py-4">
          <div className="font-inter shrink grow basis-0 text-[15px] font-normal leading-normal text-[#b4b4b4] opacity-50">
            Length of audio transcript duration that will be stored in memory. In the interest of your privacy, there is
            no data saved anywhere.
          </div>
        </div>
      </div> */}

      {/* Cloud Transcript */}

      {/* <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Cloud Transcript</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCloudToggle}
              className="flex items-center gap-1.5 text-xs font-publicsans"
            >
              <div
                className={`text-right ${
                  isCloudTranscriptOn ? 'text-[#00cc88]' : 'text-white/40'
                } text-xs font-normal font-['Public Sans'] leading-snug`}
              >
                {isCloudTranscriptOn ? 'ON' : 'OFF'}
              </div>
              <div className="w-[49px] h-[26px] relative rounded-2xl">
                <div
                  className={`w-[49px] h-[26px] left-0 top-0 absolute ${
                    isCloudTranscriptOn ? 'bg-[#00cc88]' : 'bg-black'
                  } rounded-full`}
                />
                <div
                  className={`w-6 h-6 absolute ${
                    isCloudTranscriptOn ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
                  } top-[1px] rounded-full shadow`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-white/[0.02] rounded-b-2xl">
          <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">
            Allow transcription to work in the cloud whenever your device is unable to transcribe your conversations locally. No audio or text transcription is stored anywhere to protect your privacy.
          </div>
        </div>
      </div> */}

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

import React, { useState, useMemo, useEffect } from 'react';
import SoundIcon from '../Detail/Icon/SoundIcon'
import { useConversations } from '@/contexts/ConversationContext';
import Dropdown from './Dropdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AudioState = 'active' | 'inactive' | 'off';

const SettingsPage: React.FC = () => {
  // Conversation State 
  const { isAudioOn, setIsAudioOn } = useConversations();
  // Audio Transcription State 
  const [audioState, setAudioState] = useState<AudioState>('inactive');
  const [asrDuration, setAsrDuration] = useState<number>(2);
  const [autoClear, setAutoClear] = useState<number>(2); 
  const [autoSave, setAutoSave] = useState<number>(1); 
  const [isCloudTranscriptOn, setIsCloudTranscriptOn] = useState<boolean>(true);
  const { deleteAllConversations } = useConversations(); 

  // Initialize audioState based on isAudioOn
  useEffect(() => {
    setAudioState(isAudioOn ? 'active' : 'off');
  }, [isAudioOn]);

  // Options for the dropdown (box 1)
  const autoSaveOptions = useMemo(() => {
    return [
      { label: 'After 30 Seconds', value: 0.5 },
      { label: 'After 1 Minute', value: 1 },
      { label: 'After 2 Minutes', value: 2 },
    ]
  }, []);

  // Options for the dropdown (box 2)
  const autoClearOptions = useMemo(() => {
    return [
      { label: 'Every week', value: 1 },
      { label: 'Every 2 weeks', value: 2 },
      { label: 'Every month', value: 4 },
    ]
  }, []);

  // Options for the dropdown (box 3)
  const asrDurationOptions = useMemo(() => {
    return [
      { label: '2 hours', value: 2 },
      { label: '4 hours', value: 4},
      { label: '8 hours', value: 8 },
      { label: '12 hours', value: 12 },
      { label: '24 hours', value: 24 },
    ];
  }, []);

  const handleAutoSaveChange = (option: { value: number }) => {
    setAutoSave(option.value); 
  };
  
  const handleAutoClearChange = (option: { value: number }) => {
    setAutoClear(option.value);
  };
  
  const handleAsrDurationChange = (option: { value: number }) => {
    setAsrDuration(option.value);
  };
  

  // Toggle Audio Transcription 
  const handleToggle = () => {
    const newIsOn = !isAudioOn; 
    setIsAudioOn(newIsOn);
    setAudioState(newIsOn ? 'active' : 'off');
  }

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848';
  };

  const handleCloudToggle = () => {
    setIsCloudTranscriptOn(!isCloudTranscriptOn);
  };

  return (
    <>
      { /* Audio Transcription */ }
      <div
        className={`w-full h-14 px-5 py-4 mb-8 rounded-2xl border ${
          audioState !== 'off' ? 'border-[#4ceda0]/20' : 'border-[#222222]'
        } flex flex-col justify-start items-start gap-4`}
      >
        <div className="w-full h-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex justify-center items-center">
                <SoundIcon color={getSoundIconColor()} />
              </div>
              <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">
                {audioState === 'active' ? 'Transcribing Audio...' : 'Audio Transcription Off'}
              </div>
            </div>
          </div>
          {/* Toggle Audio Transcription */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className="flex items-center gap-1.5 text-xs font-publicsans"
            >
              <div
                className={`text-right ${
                  audioState !== 'off' ? 'text-[#00cc88]' : 'text-white/40'
                } text-xs font-normal font-['Public Sans'] leading-snug`}
              >
                {audioState !== 'off' ? 'ON' : 'OFF'}
              </div>
              <div className="w-[49px] h-[26px] relative rounded-2xl">
                <div
                  className={`w-[49px] h-[26px] left-0 top-0 absolute ${
                    audioState !== 'off' ? 'bg-[#00cc88]' : 'bg-black'
                  } rounded-full`}
                />
                <div
                  className={`w-6 h-6 absolute ${
                    audioState !== 'off' ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
                  } top-[1px] rounded-full shadow`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>


      {/* Auto Save */}
      <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
          <div className="text-[#EEEEEE] text-[15px] font-medium font-inter leading-6">Auto Save</div>
          <Dropdown
            value={autoSave}
            options={autoSaveOptions}
            onSelect={handleAutoSaveChange}
            style={{ minWidth: '100px' }}
            size="medium"
          />
        </div>

        <div className="px-6 py-4 bg-white/[0.02] rounded-b-2xl">
          <div className="opacity-50 text-[#B4B4B4] text-[15px] font-normal font-inter leading-6">
            Highlight will automatically save your conversation transcript after this duration of silence
          </div>
        </div>
      </div>

    {/* Auto Clear */}
    <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
        <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Auto Clear</div>
            <Dropdown
              key={autoClear}
              value={autoClear}
              onSelect={handleAutoClearChange}
              options={autoClearOptions}
              style={{ minWidth: '100px' }}
            />
    </div>
    <div className="px-6 py-4 bg-white/[0.02] rounded-b-2xl">
        <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">Highlight will automatically delete all of your conversation transcripts based on this setting</div>
        </div>
    </div>


    {/* Audio Transcript Duration */}
    <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Audio Transcript Duration</div>
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

        <div className="px-6 py-4 bg-white/[0.02] rounded-b-2xl">
          <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">
            Length of audio transcript duration that will be stored in memory. In the interest of your privacy, there is no data saved anywhere.
          </div>
        </div>
      </div>

    {/* Cloud Transcript */}

      {/* Cloud Transcript */}
      <div className="flex flex-col gap-px mb-8">
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
      </div>

        {/* Delete Button */}
        <div className="flex flex-col gap-px mb-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center justify-center bg-[#222222] py-3 px-6 pr-3 bg-white/[0.02] rounded-xl overflow-hidden inline-flex cursor-pointer">
              <div className="text-[#ff3333] text-[17px] font-medium font-inter leading-tight">Delete All Transcripts</div>
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
      </>
  );
};

export default SettingsPage

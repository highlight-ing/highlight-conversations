import React, { useState, useMemo } from 'react';
import SoundIcon from '../Detail/Icon/SoundIcon'
import { useConversations } from '@/contexts/ConversationContext';
// import Dropdown [ find path ]

type AudioState = 'active' | 'inactive' | 'off';

const SettingsPage: React.FC = () => {
  // Audio Transcription State 
  const [audioState, setAudioState] = useState<AudioState>('inactive');
  // Conversation State 
  const { isAudioOn, setIsAudioOn } = useConversations();

  // Options for the dropdown
  const asrDurationOptions = useMemo(() => {
    return [
      { label: '2 hours', value: 2 },
      { label: '4 hours', value: 4},
      { label: '6 hours', value: 6 },
      { label: '12 hours', value: 12 },
      { label: '24 hours', value: 24 },
    ];
  }, []);

  const [asrDuration, setAsrDuration] = useState(getDefaultAudioTranscriberDuration());

  // handler for dropdown selection
  const handleDurationChange = (option: { value: number }) => {
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

  

  return (
    <>
      { /* Audio Transcription */ }
      <div className="w-full h-14 px-5 py-4 mb-8 rounded-2xl border border-[#4ceda0]/20 flex flex-col justify-start items-start gap-4">
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
          <div className="px-4 py-1.5 bg-white/[0.08] rounded-[10px] flex justify-center items-center">
            <div className="text-[#B4B4B4] text-[15px] font-medium font-inter leading-5">After 2 Minutes</div>
          </div>
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
            <div className="px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 flex">
            <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">Every 2 Weeks</div>
        </div>
    </div>
    <div className="px-6 py-4 bg-white/[0.02] rounded-b-2xl">
        <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">Highlight will automatically delete all of your conversation transcripts based on this setting</div>
        </div>
    </div>


    {/* Audio Transcript Duration */}
    <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Audio Transcript Duration</div>
          <div className="px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 flex">
            <Dropdown
              size="large"
              value={asrDuration}
              onSelect={handleDurationChange}
              options={asrDurationOptions}
              style={{ minWidth: '100px' }}
              disabled={!asrEnabled} 
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
 <div className="flex flex-col gap-px mb-8">
        <div className="flex justify-between items-center py-3 px-6 pr-3 bg-white/[0.02] rounded-t-2xl overflow-hidden">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Cloud Transcript</div>
          <div className="h-[26px] justify-end items-center gap-1.5 flex">
            <div className="text-right text-white/40 text-xs font-normal font-['Public Sans'] leading-snug">ON</div>
            <div className="w-[49px] h-[26px] relative rounded-2xl">
              <div className="w-[49px] h-[26px] left-0 top-0 absolute bg-[#00cc88] rounded-[100px]" />
              <div className="w-6 h-6 left-[24px] top-[1px] absolute bg-white rounded-2xl shadow" />
            </div>
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
            <div className="flex items-center justify-center bg-[#222222] py-3 px-6 pr-3 bg-white/[0.02] rounded-xl overflow-hidden inline-flex">
                <div className="text-[#ff3333] text-[17px] font-medium font-inter leading-tight">Delete All Transcripts</div>
            </div>
        </div>
      </>
  );
};

export default SettingsPage

import React, { useState } from 'react';
import SoundIcon from '../Detail/Icon/SoundIcon'

type AudioState = 'active' | 'inactive' | 'off';

const SettingsPage: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>('inactive');
  const [isAudioOn, setIsAudioOn] = useState(false); 

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
      <div className="flex flex-col w-full h-full">
      <div className="w-full h-14 px-5 py-4 rounded-2xl border border-[#4ceda0]/20 flex flex-col justify-start items-start gap-4">
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
          <div className="flex items-center gap-2">
            <div className="h-[26px] flex justify-end items-center gap-1.5">
              <div className="text-right text-white/40 text-xs font-normal font-['Public Sans'] leading-snug">
                {isAudioOn ? 'ON' : 'OFF'}
              </div>
              <button
                onClick={handleToggle}
                className="w-[49px] h-[26px] relative rounded-2xl flex items-center"
              >
                <div className={`w-[49px] h-[26px] absolute ${isAudioOn ? 'bg-[#00cc88]' : 'bg-[#484848]'} rounded-full`} />
                <div className={`w-6 h-6 absolute top-[1px] bg-white rounded-full shadow transition-transform ${isAudioOn ? 'left-[24px]' : 'left-[1px]'}`} />
              </button>
            </div>
          </div>
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
            <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">8 Hours</div>
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

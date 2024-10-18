import React from 'react';
import ShieldTickIcon from '../Icon/ShieldTickIcon';
import BigSoundIcon from '../Icon/BigSoundIcon';

const NoAudioDetected: React.FC = () => (
  <div className="w-[840px] h-[1829px] relative font-inter">
    <div className="absolute left-[62px] top-[48px] inline-flex items-center gap-[13px]">
      <div className="flex items-center justify-center w-8 h-8">
        <div className="relative w-8 h-8">
          <BigSoundIcon />
        </div>
      </div>
      <div className="text-2xl font-semibold leading-[31px] text-white">
        No Audio Detected...
      </div>
    </div>
    <div className="absolute left-[64px] top-[104px] w-[624px] text-[15px] font-normal leading-normal text-[#484848]">
      Transcript will update every ~30s
    </div>
    <div className="absolute left-[549px] top-[48px] inline-flex items-center gap-4">
      <div className="flex items-center justify-center w-6 h-6 opacity-40">
        <div className="relative w-6 h-6">
        
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-[10px] bg-white/10">
        <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">
          Open
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-[10px] bg-white/10">
        <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">
          Copy Link
        </div>
      </div>
    </div>
    <div className="absolute flex flex-col items-center justify-center gap-2 inline-flex h-40 py-6 pl-0.5 left-[87px] top-[266px] rounded-2xl border border-black">
      <div className="inline-flex items-center justify-center w-6 h-6">
        <div className="relative w-6 h-6">
            <ShieldTickIcon />
        </div>
      </div>
      <div className="text-[15px] font-semibold leading-normal text-[#6e6e6e]">
        Highlight will automatically transcribe your meetings and content
      </div>
      <div className="w-[586px] text-[15px] font-normal leading-normal text-center text-[#484848]">
        All transcriptions are private and only accessible by you on your computer. No audio is stored anywhere and nothing is sent to the cloud without your permission.
      </div>
    </div>
  </div>
);

export default NoAudioDetected;

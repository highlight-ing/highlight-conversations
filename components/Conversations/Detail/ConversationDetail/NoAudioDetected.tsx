import React from 'react'
import GreyShieldTick from '../Icon/GreyShieldTick'
import BigSoundIcon from '../Icon/BigSoundIcon'
import { Trash } from 'iconsax-react'
// import TrashIcon from '../Icon/TrashIcon';

const NoAudioDetected: React.FC = () => (
  <div className="font-inter relative h-[1829px] w-[840px]">
    <div className="absolute left-[62px] top-[48px] inline-flex items-center gap-[13px]">
      <div className="flex h-8 w-8 items-center justify-center">
        <div className="relative h-8 w-8">
          <BigSoundIcon />
        </div>
      </div>
      <div className="text-2xl font-semibold leading-[31px] text-white">No Audio Detected...</div>
    </div>
    <div className="absolute left-[64px] top-[104px] w-[624px] text-[15px] font-normal leading-normal text-[#484848]">
      Transcript will update every ~30s
    </div>
    <div className="absolute left-[549px] top-[48px] inline-flex items-center gap-4">
      <div className="flex h-6 w-6 items-center justify-center opacity-40">
        <div className="relative h-6 w-6">
          <Trash variant="Bold" className="group-hover:text-destructive text-primary" size={24} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5">
        <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5">
        <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Copy Link</div>
      </div>
    </div>
    <div className="absolute left-[87px] top-[266px] flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-black py-6 pl-0.5">
      <div className="inline-flex h-6 w-6 items-center justify-center">
        <div className="relative h-6 w-6">
          <GreyShieldTick />
        </div>
      </div>
      <div className="text-[15px] font-semibold leading-normal text-[#6e6e6e]">
        Highlight will automatically transcribe your meetings and content
      </div>
      <div className="w-[586px] text-center text-[15px] font-normal leading-normal text-[#484848]">
        All transcriptions are private and only accessible by you on your computer. No audio is stored anywhere and
        nothing is sent to the cloud without your permission.
      </div>
    </div>
  </div>
)

export default NoAudioDetected

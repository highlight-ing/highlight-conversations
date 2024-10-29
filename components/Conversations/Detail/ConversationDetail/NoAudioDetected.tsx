import React from 'react'
import GreyShieldTick from '../Icon/GreyShieldTick'
import BigSoundIcon from '../Icon/BigSoundIcon'
import { Trash } from 'iconsax-react'

const NoAudioDetected: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black px-6 py-8 md:px-12 md:py-16 lg:px-20 lg:py-20 max-w-5xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <BigSoundIcon />
            </div>
            <h1 className="text-white text-lg md:text-2xl font-semibold font-inter leading-snug">
              No Audio Detected...
            </h1>
          </div>
          
          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 opacity-40 flex items-center justify-center">
              <Trash variant="Bold" className="text-primary" size={24} />
            </div>
            <button className="px-4 py-1.5 bg-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20">
              <span className="text-[#b4b4b4] text-sm md:text-base font-medium font-inter leading-tight">Open</span>
            </button>
            <button className="px-4 py-1.5 bg-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20">
              <span className="text-[#b4b4b4] text-sm md:text-base font-medium font-inter leading-tight">Copy Link</span>
            </button>
          </div>
        </div>

        {/* Subtitle directly below header */}
        <p className="text-[#484848] text-[14px] md:text-[15px] font-normal font-inter leading-relaxed max-w-lg">
          Transcript will update every ~30s
        </p>
      </div>

      {/* Information Box */}
      <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border border-[#222222]/25 w-full max-w-3xl text-center space-y-3">
        <div className="w-6 h-6 flex items-center justify-center">
          <GreyShieldTick />
        </div>
        <p className="text-[#6e6e6e] text-[15px] font-semibold font-inter leading-normal">
          Highlight will automatically transcribe your meetings and content
        </p>
        <p className="text-[#484848] text-[15px] font-normal font-inter leading-normal max-w-[90%]">
          All transcriptions are private and only accessible by you on your computer. No audio is stored anywhere, and
          nothing is sent to the cloud without your permission.
        </p>
      </div>
    </div>
  )
}

export default NoAudioDetected

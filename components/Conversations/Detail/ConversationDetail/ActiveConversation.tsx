import React from 'react'

import BigGreenSoundIcon from '../Icon/ActiveConversationIcon/BigGreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import Transcript from '../../Components/Transcript'

const ActiveConversation: React.FC = () => {
  const { currentConversation } = useConversations()

  return (
    <div className="relative h-[900px]">
      <div className="font-inter absolute left-[64px] top-[104px] w-[624px] text-[15px] font-normal leading-normal text-[#484848]">
        Transcript will update every ~30s
      </div>

      <div className="absolute left-[549px] top-[48px] inline-flex items-center gap-4">
        <div className="flex items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5">
          <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
        </div>
      </div>

      <div className="absolute left-[63px] top-[48px] flex items-center gap-[13px]">
        <div className="flex h-8 w-8 items-center justify-center">
          <BigGreenSoundIcon />
        </div>

        <div className="font-inter text-2xl font-semibold leading-[31px] text-white">
          <h1 className="font-inter flex items-center text-2xl font-semibold leading-[31px] text-white">
            Transcribing...
          </h1>
        </div>
      </div>
      <div className="absolute left-[64px] w-[624px] transition-all duration-300 ease-in-out" style={{ top: `186px` }}>
        <Transcript transcript={currentConversation} />
      </div>
    </div>
  )
}

export default ActiveConversation

import React from 'react'

import BigGreenSoundIcon from '../Icon/ActiveConversationIcon/BigGreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import Transcript from '../../Components/Transcript'

const ActiveConversation: React.FC = () => {
  const { currentConversation } = useConversations()

  return (
    <div className="relative flex max-h-full flex-col overflow-y-scroll px-16 pt-12">
      <div className="mb-6 flex w-full flex-row justify-between">
        <div className="flex items-center gap-[13px]">
          <div className="flex h-8 w-8 items-center justify-center">
            <BigGreenSoundIcon />
          </div>

          <div className="font-inter text-2xl font-semibold leading-[31px] text-white">
            <h1 className="font-inter flex items-center text-2xl font-semibold leading-[31px] text-white">
              Transcribing...
            </h1>
          </div>
        </div>
        <div className="inline-flex items-center gap-4">
          <div className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 hover:bg-white/20">
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
          </div>
        </div>
      </div>
      <div className="font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]">
        Transcript will update every ~30s
      </div>

      <div className="transition-all duration-300 ease-in-out">
        <Transcript transcript={currentConversation} />
      </div>
    </div>
  )
}

export default ActiveConversation

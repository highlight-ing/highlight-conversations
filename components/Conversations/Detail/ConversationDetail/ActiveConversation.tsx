import React from 'react'

import BigGreenSoundIcon from '../Icon/ActiveConversationIcon/BigGreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import Transcript from '../../Components/Transcript'
import { formatTimestampWithTimer } from '@/utils/dateUtils'

const ActiveConversation: React.FC = () => {
  const { currentConversation, saveCurrentConversation, elapsedTime } = useConversations()
  const isSaveDisabled = currentConversation.trim().length === 0
  const startTime = new Date(Date.now() - elapsedTime)

  // Truncate the save button text for smaller screens
  const TruncateSaveButton = (text: string) => {
    return (
      <>
        <span className="hidden lg:block">{text}</span>
        <span className="block lg:hidden">Save</span>
      </>
    )
  }


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
        <button
          onClick={saveCurrentConversation}
          className={`flex ${!isSaveDisabled && 'cursor-pointer'} items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 text-[15px] font-medium leading-tight text-[#b4b4b4] hover:bg-white/20 disabled:bg-white/5`}
          disabled={isSaveDisabled}
        >
          {TruncateSaveButton('Save Transcript Now')}
        </button>
      </div>
      <div className="font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]">
        {formatTimestampWithTimer(startTime, elapsedTime)}
      </div>
      <div className="transition-all duration-300 ease-in-out">
        <Transcript transcript={currentConversation} isActive={true} />
      </div>
    </div>
  )
}

export default ActiveConversation

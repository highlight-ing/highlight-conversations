import React, { useState, useEffect, useRef } from 'react'
import Highlight from '@highlight-ai/app-runtime'
import BigGreenSoundIcon from '../Icon/DetailIcons/ActiveConversationIcon/BigGreenSoundIcon'
import { useConversations } from '@/contexts/ConversationContext'
import { ConversationData } from '@/data/conversations'
import Transcript from '../../Components/Transcript'
import { formatTimestampWithTimer } from '@/utils/dateUtils'

const ActiveConversation: React.FC = () => {
  const { currentConversation, saveCurrentConversation, elapsedTime, isAudioOn, handleConversationSelect } =
    useConversations()
  const hasTranscription = currentConversation.trim().length > 0
  const [startTime, setStartTime] = useState<Date | null>(null)
  const startTimeRef = useRef(startTime)

  // Keep the ref updated with the latest startTime
  useEffect(() => {
    startTimeRef.current = startTime
  }, [startTime])

  // Store the start time when the conversation starts
  useEffect(() => {
    const removeCurrentConversationListener = Highlight.app.addListener(
      'onCurrentConversationUpdate',
      (conversation: string) => {
        // Only set startTime if it's not already set
        if (startTimeRef.current === null) {
          setStartTime(new Date())
        }
      }
    )
    return () => removeCurrentConversationListener()
  }, [isAudioOn])

  // Reset the startTime when the conversation is saved
  useEffect(() => {
    const removeConversationSavedListener = Highlight.app.addListener('onConversationSaved', () => {
      setStartTime(null)
    })
    return () => removeConversationSavedListener()
  }, [])

  // Function to handle saving the current convo and selecting it if saved successfully 
  const handleSaveConversation = async () => {
    try {
      const savedConversation = await saveCurrentConversation()
      if (savedConversation) {
        handleConversationSelect(savedConversation.id)
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  }

  // Truncate the save button text for smaller screens
  const TruncateSaveButton = (text: string) => {
    return (
      <>
        <span className="hidden lg:block">{text}</span>
        <span className="block lg:hidden">Save</span>
      </>
    )
  }

  // jsx component 
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
        {hasTranscription && (
          <button
            onClick={handleSaveConversation}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 text-[15px] font-medium leading-tight text-[#b4b4b4] hover:bg-white/20"
          >
            {TruncateSaveButton('Save Transcript Now')}
          </button>
        )}
      </div>
      <div className="font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]">
        {formatTimestampWithTimer(startTime ?? new Date(), elapsedTime * 1000)}
      </div>
      <div className="transition-all duration-300 ease-in-out">
        <Transcript transcript={currentConversation} isActive={true} />
      </div>
    </div>
  )
}

export default ActiveConversation

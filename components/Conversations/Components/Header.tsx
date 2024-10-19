import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import FlashIcon from '../Detail/Icon/FlashIcon'
import GreyTrashIcon from '../Detail/Icon/GreyTrashIcon'
import { panelFormatDate } from '@/data/conversations'
import TrashIcon from '../Detail/Icon/TrashIcon'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Pencil1Icon } from '@radix-ui/react-icons'

interface HeaderProps {
    conversation: ConversationData
    icon?: React.ReactNode;  
}

const Header: React.FC<HeaderProps> = ({ conversation, icon }) => {
    const { updateConversation } = useConversations()
    const [title, setTitle] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const updateTitle = useCallback(() => {
        if (!conversation.title || 
            conversation.title.trim() === '' || 
            conversation.title.startsWith('Conversation ended at')) {
            setTitle(getRelativeTimeString(conversation.startedAt))
        } else {
            setTitle(conversation.title)
        }
    }, [conversation.title, conversation.startedAt])

    useEffect(() => {
        updateTitle()
    }, [updateTitle, conversation])

    useEffect(() => {
        const timer = setInterval(updateTitle, 60000) // Update every minute
        return () => clearInterval(timer)
    }, [updateTitle])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleTitleBlur = () => {
        setIsEditing(false)
        if (title.trim() === '') {
            setTitle(getRelativeTimeString(conversation.startedAt))
        } else {
            updateConversation({ ...conversation, title })
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTitleBlur()
        }
    }

    return (
        <div className="w-full bg-black py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[13px]">
              <div className="w-8 h-8 justify-center items-center inline-flex">
                <img className="w-8 h-8" src="https://via.placeholder.com/32x32" alt="Conversation icon" />
              </div>
              <div className="flex flex-col">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    className="text-white text-2xl font-semibold font-inter leading-[31px] bg-transparent outline-none"
                  />
                ) : (
                  <h1
                    className="text-white text-2xl font-semibold font-inter leading-[31px] cursor-pointer flex items-center"
                    onClick={() => setIsEditing(true)}
                  >
                    {title}
                    <Pencil1Icon className="ml-2 h-4 w-4 text-white/50 hover:text-white" />
                  </h1>
                )}
                <span className="text-[#484848] text-[15px] font-normal font-inter leading-normal">
                  {formatTimestamp(conversation.startedAt)} - {formatTimestamp(conversation.endedAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 opacity-40 justify-center items-center inline-flex">
                <TrashIcon className="w-6 h-6" />
              </div>
              <button className="px-4 py-1.5 bg-white/10 rounded-[10px] text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">
                Open
              </button>
              <button className="px-4 py-1.5 bg-white/10 rounded-[10px] text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    export default Header;
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import FlashIcon from '../Detail/Icon/FlashIcon'
import TrashIcon from '../Detail/Icon/TrashIcon'
import ClipboardTextIcon from '../Detail/Icon/ClipboardIcon'
import { panelFormatDate } from '@/data/conversations'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { ConversationsIcon } from '@/components/ui/icons/ConversationIcon' // Import your dynamic icon component

interface HeaderProps {
    conversation: ConversationData
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
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

    const { startedAt, endedAt } = conversation

    return (
        <div
            className="relative max-w-full h-[48px] border-b border-black mb-4 flex items-center gap-3 px-4 box-border overflow-hidden"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            {/* Title and Date Information */}
            <div className="flex-grow min-w-0">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleKeyDown}
                        className="text-white text-2xl font-semibold font-inter leading-[31px]"
                    />
                ) : (
                    <>
                        <h1
                            className="text-white text-2xl font-semibold font-inter leading-[31px]"
                            onClick={() => setIsEditing(true)}
                        >
                            {title}
                            <Pencil1Icon className="ml-2 inline-block h-3 w-3 text-white/50 transition-colors duration-200 group-hover:text-white" />
                        </h1>

         
          
                    </>
                )}

                <span className="font-inter text-[8px] font-medium text-white opacity-30 leading-normal m-0">
                    {panelFormatDate(conversation.startedAt)} - {panelFormatDate(conversation.endedAt)}
                </span>
            </div>

            {/* Icons on the right, aligned horizontally */}
            <div
                className="flex gap-3 ml-auto flex-shrink-0"
                style={{
                    display: 'flex',
                    gap: '12px',
                    marginLeft: 'auto',
                    flexShrink: 0,
                }}
            >
                <TrashIcon />
                <div className="flex items-center gap-2 mt-2">
                            <div className="h-8 px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 inline-flex">
                                <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">
                                    Open
                                </div>
                            </div>
                            <div className="h-8 px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 inline-flex">
                                <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">
                                    Copy Link
                                </div>
                            </div>

                            <div className="w-6 h-6 opacity-40 justify-center items-center inline-flex">
                                <div className="w-6 h-6 relative">
                                    {/* You can add an icon or image here */}
                                </div>
                            </div>
                        </div>
            </div>
        </div>
    )
}

export default Header

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import FlashIcon from '../Detail/Icon/flash'
import TrashIcon from '../Detail/Icon/trash'
import ClipboardTextIcon from '../Detail/Icon/clipboard-text'
import { panelFormatDate } from '@/data/conversations'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Pencil1Icon } from '@radix-ui/react-icons'

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
            {/* Icon on the left */}
            <div
                className="w-8 h-8 flex-shrink-0 rounded-full bg-[var(--neutrals-background-first-layer,#000)]"
                style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    borderRadius: '100px',
                    background: 'var(--neutrals-background-first-layer, #000)',
                }}
            />

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
                        className="w-full bg-transparent text-[13px] font-medium text-white border-b border-white/20 focus:border-white/50 focus:outline-none"
                    />
                ) : (
                    <h1
                        className="font-inter text-[13px] font-medium text-white leading-tight m-0 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer group"
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                        <Pencil1Icon className="ml-2 inline-block h-3 w-3 text-white/50 transition-colors duration-200 group-hover:text-white" />
                    </h1>
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
                <ClipboardTextIcon />
                <TrashIcon />
                <FlashIcon />
            </div>
        </div>
    )
}

export default Header

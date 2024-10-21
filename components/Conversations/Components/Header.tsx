import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import TrashIcon from '../Detail/Icon/TrashIcon'
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'

interface HeaderProps {
  conversation?: ConversationData
  icon?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ conversation, icon }) => {
  const { updateConversation, deleteConversation } = useConversations()
  const [title, setTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTitle = useCallback(() => {
    if (!conversation) {
      setTitle('')
      return
    }
    if (
      !conversation.title ||
      conversation.title.trim() === '' ||
      conversation.title.startsWith('Conversation ended at')
    ) {
      setTitle(getRelativeTimeString(conversation.startedAt))
    } else {
      setTitle(conversation.title)
    }
  }, [conversation])

  useEffect(() => {
    updateTitle()
  }, [updateTitle])

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
    if (!conversation) return
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

  // handling the trash icon
  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id)
    }
  }

  const formattedTimestamp =
    conversation && conversation.startedAt && conversation.endedAt
      ? formatHeaderTimestamp(conversation.startedAt, conversation.endedAt)
      : ''

  return (
    <div className="w-full bg-[#0e0e0e] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[13px]">
          <div className="inline-flex h-8 w-8 items-center justify-center">
            {icon || <img className="h-8 w-8" src="https://via.placeholder.com/32x32" alt="Conversation icon" />}
          </div>
          {conversation && (
            <div className="flex flex-col">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleKeyDown}
                  className="font-inter bg-transparent text-2xl font-semibold leading-[31px] text-white outline-none"
                />
              ) : (
                <h1
                  className="font-inter flex cursor-pointer items-center text-2xl font-semibold leading-[31px] text-white"
                  onClick={() => setIsEditing(true)}
                >
                  {title}
                  <Pencil1Icon className="ml-2 h-4 w-4 text-white/50 hover:text-white" />
                </h1>
              )}
              <span className="font-inter text-[15px] font-normal leading-normal text-[#484848]">
                {formattedTimestamp}
              </span>
            </div>
          )}
        </div>
        {conversation && (
          <div className="flex items-center gap-4">
            <div
              className="inline-flex h-6 w-6 cursor-pointer items-center justify-center opacity-40 hover:opacity-100"
              onClick={handleDelete}
            >
              <TrashIcon className="h-6 w-6" />
            </div>
            <button className="font-inter rounded-[10px] bg-white/10 px-4 py-1.5 text-[15px] font-medium leading-tight text-[#b4b4b4]">
              Open
            </button>
            <button
              onClick={handleCopyLink}
              className="font-inter rounded-[10px] bg-white/10 px-4 py-1.5 text-[15px] font-medium leading-tight text-[#b4b4b4]"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
      {isDeleteDialogOpen && (
        <DeleteConversationDialog onDelete={handleDelete} onCancel={() => setIsDeleteDialogOpen(false)} />
      )}
    </div>
  )
}

export default Header

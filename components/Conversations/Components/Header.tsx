import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import TrashIcon from '../Detail/Icon/TrashIcon'
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'

interface HeaderProps {
    conversation?: ConversationData
    icon?: React.ReactNode;  
    onTitleUpdate: (newTitle: string) => void; 
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
        if (!conversation.title || 
            conversation.title.trim() === '' || 
            conversation.title.startsWith('Conversation ended at')) {
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

    // handling copy link -- this doesn't work 
    const handleCopyLink = () => {
      if (conversation) {
          const baseUrl = window.location.origin; 
          const conversationUrl = `${baseUrl}/conversations/${conversation.id}`;
          navigator.clipboard.writeText(conversationUrl)
            .then(() => {
              console.log('Link copied to clipboard:', conversationUrl);
            })
            .catch((error) => {
              console.error('Failed to copy link:', error);
            });
      }
    }

    const formattedTimestamp = conversation && conversation.startedAt && conversation.endedAt 
        ? formatHeaderTimestamp(conversation.startedAt, conversation.endedAt)
        : '';

    return (
        <div className="w-full bg-[#0e0e0e] py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[13px]">
              <div className="w-8 h-8 justify-center items-center inline-flex">
                {icon || <img className="w-8 h-8" src="https://via.placeholder.com/32x32" alt="Conversation icon" />}
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
                    {formattedTimestamp}
                  </span>
                </div>
              )}
            </div>
            {conversation && (
              <div className="flex items-center gap-4">
                <div 
                  className="w-6 h-6 opacity-40 justify-center items-center inline-flex cursor-pointer hover:opacity-100"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-6 h-6" />
                </div>
                <button className="px-4 py-1.5 bg-white/10 rounded-[10px] text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">
                  Open
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="px-4 py-1.5 bg-white/10 rounded-[10px] text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
          {isDeleteDialogOpen && (
            <DeleteConversationDialog
              onDelete={handleDelete}
              onCancel={() => setIsDeleteDialogOpen(false)}
            />
          )}
        </div>
    );
};

export default Header;
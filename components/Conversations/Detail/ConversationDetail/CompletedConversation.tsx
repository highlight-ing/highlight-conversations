import React, { useEffect, useState, useCallback, useRef } from 'react'
import Summary from '../../Components/Summary'
import Transcript from '../../Components/Transcript'

import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Toaster, toast } from 'sonner'

import { Pencil1Icon } from '@radix-ui/react-icons'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import VoiceSquareIcon from '../Icon/VoiceSquareIcon'

import { useConversationActions } from '@/components/Card/SavedConversation/useConversationsActions'
import { ShareMenu } from '@/components/Card/SavedConversation/ShareMenu'

interface CompletedConversationProps {
  conversation: ConversationData
}

const CompletedConversation: React.FC<CompletedConversationProps> = ({ conversation }) => {
  const { updateConversation, deleteConversation } = useConversations()
  const {
    localConversation,
    handleShare,
    shareStatus,
    handleGenerateShareLink,
    handleCopyLink,
    isDeleting,
    handleDeleteLink,
    handleDownloadAsFile,
    shareMessage,
    setShareMessage,
    handleAttachment
  } = useConversationActions(conversation, updateConversation, deleteConversation)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (shareMessage) {
      if (shareMessage.type === 'success') {
        toast.success(shareMessage.message, {
          description: shareMessage.description
        })
      } else {
        toast.error(shareMessage.message)
      }
      setShareMessage(null)
    }
  }, [shareMessage, setShareMessage])

  // title update
  const updateTitle = useCallback(() => {
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

  // update the title
  useEffect(() => {
    updateTitle()
  }, [updateTitle])

  // Update every minute
  useEffect(() => {
    const timer = setInterval(updateTitle, 60000)
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

  const formattedTimestamp =
    conversation && conversation.startedAt && conversation.endedAt
      ? formatHeaderTimestamp(conversation.startedAt, conversation.endedAt)
      : ''

  // delete function for the trash icon
  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id)
    }
  }

  // Handle the title blur
  const handleTitleBlur = () => {
    setIsEditing(false)
    if (!conversation) return
    if (title.trim() === '') {
      setTitle(getRelativeTimeString(conversation.startedAt))
    } else {
      updateConversation({ ...conversation, title })
    }
  }

  // Handle the title key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur()
    }
  }

  return (
    <div className="relative flex max-h-full flex-col overflow-y-scroll px-16 pt-12">
      <div className="mb-6 flex w-full flex-row justify-between">
        {/* Title and Editable Logic */}
        <div className="flex items-center gap-[13px]">
          <div className="flex h-8 w-8 items-center justify-center">
            <VoiceSquareIcon />
          </div>

          {/* Title (Editable or Static) */}
          <div className="font-inter text-2xl font-semibold leading-[31px] text-white">
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
          </div>
        </div>
        {/* Delete, Open, Copy Link buttons */}
        <div className="inline-flex items-center gap-4">
          <div className="relative flex h-6 w-6 items-center justify-center">
            <DeleteConversationDialog onDelete={handleDelete} />
          </div>
          <div
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 hover:bg-white/20"
            onClick={handleAttachment}
          >
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
          </div>
          <ShareMenu
            onShare={handleShare}
            isSharing={shareStatus === 'processing'}
            isDeleting={isDeleting}
            hasExistingShareLink={!!localConversation.shareLink}
            onGenerateShareLink={handleGenerateShareLink}
            onCopyLink={handleCopyLink}
            onDeleteLink={handleDeleteLink}
            onDownloadAsFile={handleDownloadAsFile}
          />
        </div>
      </div>
      <div className="font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]">{formattedTimestamp}</div>

      {/* Summary Component */}
      <div className="mb-8 flex w-full flex-col gap-4">
        <Summary
          transcript={conversation.transcript}
          onSummaryGenerated={(summary) => {
            // Update the conversation with the new summary
            updateConversation({ ...conversation, summary })
          }}
          conversationId={conversation.id}
          existingSummary={conversation.summary}
        />
      </div>

      {/* Transcript Component */}
      <div className="transition-all duration-300 ease-in-out">
        <Transcript transcript={conversation.transcript} />
      </div>

      <Toaster theme="dark" className="bg-background text-foreground" />
    </div>
  )
}

export default CompletedConversation
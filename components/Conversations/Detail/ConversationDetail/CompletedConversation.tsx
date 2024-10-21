import React, { useEffect, useState, useCallback, useRef } from 'react'
import Summary from '../../Components/Summary'
import Transcript from '../../Components/Transcript'

import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Toaster, toast } from 'sonner'

import TrashIcon from '../Icon/TrashIcon'
import { Pencil1Icon } from '@radix-ui/react-icons'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import VoiceSquareIcon from '../Icon/VoiceSquareIcon'

import handleCopyTranscript from '@/components/Card/CurrentConversationCard'
import { useConversationActions } from '@/components/Card/SavedConversation/useConversationsActions'
import { ShareButton } from '@/components/Card/SavedConversation/ShareButton'

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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)
  const [summaryHeight, setSummaryHeight] = useState(0)
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

  // Update Summary Height when content changes
  useEffect(() => {
    const updateSummaryHeight = () => {
      if (summaryRef.current) {
        setSummaryHeight(summaryRef.current.offsetHeight)
      }
    }
    updateSummaryHeight()
  }, [conversation])

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

  // Open the delete confirmation dialog
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true)
  }

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
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

  // update summary height when content changes
  useEffect(() => {
    if (summaryRef.current) {
      setSummaryHeight(summaryRef.current.clientHeight)
    }
  }, [summaryRef.current])

  // Debugging log to ensure Transcript top is set dynamically
  useEffect(() => {
    console.log('Transcript top:', 176 + summaryHeight + 20)
  }, [summaryHeight])

  return (
    <div className="relative flex h-[900px] flex-col gap-4">
      <>
        <div className="font-inter absolute left-[64px] top-[104px] w-[624px] text-[15px] font-normal leading-normal text-[#484848]">
          {formattedTimestamp}
        </div>

        {/* Delete, Open, Copy Link buttons */}
        <div className="absolute left-[549px] top-[48px] inline-flex items-center gap-4">
          <div className="relative flex h-6 w-6 items-center justify-center opacity-40">
            {/* Delete Confirmation Dialog */}
            <DeleteConversationDialog onDelete={handleDelete} />
          </div>
          <div
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 hover:bg-white/20"
            onClick={handleAttachment}
          >
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
          </div>
          {/* <div className="flex items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5"> */}
          {/* <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]" onClick={handleShare}>
              Copy Link
            </div> */}
          <ShareButton
            onShare={handleShare}
            isSharing={shareStatus === 'processing'}
            isDeleting={isDeleting}
            hasExistingShareLink={!!localConversation.shareLink}
            onGenerateShareLink={handleGenerateShareLink}
            onCopyLink={handleCopyLink}
            onDeleteLink={handleDeleteLink}
            onDownloadAsFile={handleDownloadAsFile}
          />
          {/* </div> */}
        </div>

        {/* Title and Editable Logic */}
        <div className="absolute left-[63px] top-[48px] flex items-center gap-[13px]">
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

        {/* Summary Component */}
        <div ref={summaryRef} className="absolute left-[64px] top-[176px] flex w-[624px] flex-col gap-4">
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
        <div
          className="absolute left-[64px] w-[624px] transition-all duration-300 ease-in-out"
          style={{ top: `${176 + summaryHeight + 20}px` }}
        >
          <Transcript transcript={conversation.transcript} />
        </div>
      </>
      <Toaster theme="dark" className="bg-background text-foreground" />
    </div>
  )
}

export default CompletedConversation

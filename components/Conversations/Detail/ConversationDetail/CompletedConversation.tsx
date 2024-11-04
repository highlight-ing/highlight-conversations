import React, { useEffect, useState, useCallback, useRef } from 'react'
import Summary from '../../Components/Summary'
import Transcript from '../../Components/Transcript'

import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { formatHeaderTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { Toaster, toast } from 'sonner'

import { Pencil1Icon } from '@radix-ui/react-icons'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import VoiceSquareIcon from '../Icon/PanelIcons/ConversationEntry/VoiceSquareIcon'

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
      const relativetime = getRelativeTimeString(conversation.startedAt)
      setTitle(relativetime)
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

  const getDisplayTitle = useCallback(() => {
    return getRelativeTimeString(conversation.startedAt)
  }, [conversation.startedAt])

  useEffect(() => {
    const newTitle = getDisplayTitle()
    setTitle(newTitle)

    // Update every minute to keep the relative time current
    const timer = setInterval(() => {
      setTitle(getDisplayTitle())
    }, 60000)
    return () => clearInterval(timer)
  }, [getDisplayTitle])

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
      const relativeTime = getRelativeTimeString(conversation.startedAt)
      setTitle(relativeTime)
      updateConversation({ ...conversation, title: ''})
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

  // truncate the title
  const truncateTitle = (title: string, isCompact: boolean) => {    
    // More flexible regex that matches the number and unit separately
    const regex = /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)/i;
    const match = title.match(regex);
    
    if (match) {
      const [full, number, unit] = match;
      
      const getCompactUnit = (unit: string) => {
        switch(unit.toLowerCase()) {
          case 'minute':
          case 'minutes':
            return 'min';
          case 'hour':
          case 'hours':
            return 'hr';
          case 'day':
          case 'days':
            return 'day';
          case 'week':
          case 'weeks':
            return 'wks';
          case 'month':
          case 'months':
            return 'mo';
          case 'year':
          case 'years':
            return 'y';
          default:
            return unit;
        }
      };

      // For compact: "40 min..." (with space)
      // For full: "40 minutes ago"
      const result = isCompact 
        ? `${number} ${getCompactUnit(unit)}...`
        : title; // Keep original format for full version
      
      return result;
    }

    // If no match, return the original title
    return title;
  }

  return (
    <div className="relative flex max-h-full flex-col overflow-y-scroll px-16 pt-12">
      <div className="mb-6 flex w-full flex-row justify-between">
        {/* Title and Editable Logic */}
        <div className="flex items-center gap-[13px] max-w-[70%]">
          <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
            <VoiceSquareIcon />
          </div>

          {/* Title (Editable or Static) */}
          <div className="font-inter text-2xl font-semibold leading-[31px] text-white overflow-hidden">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="font-inter bg-transparent text-2xl font-semibold leading-[31px] text-white outline-none w-full"
              />
            ) : (
              <h1
                className="font-inter flex cursor-pointer items-center text-2xl font-semibold leading-[31px] text-white"
                onClick={() => setIsEditing(true)}
              >
                <div className="relative w-full">
                  {/* Full title for larger screens */}
                  <div className="hidden lg:block truncate">
                    {truncateTitle(title, false)}
                  </div>
                  {/* Compact title for smaller screens */}
                  <div className="block lg:hidden truncate">
                    {truncateTitle(title, true)}
                  </div>
                </div>
                <Pencil1Icon className="ml-2 h-4 w-4 text-white/50 hover:text-white flex-shrink-0" />
              </h1>
            )}
          </div>
        </div>
        {/* Delete, Open, Copy Link buttons */}
        <div className="inline-flex items-center gap-4">
          <div className="relative flex h-6 w-6 items-center justify-center opacity-40">
            <DeleteConversationDialog onDelete={handleDelete} />
          </div>
          <div
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 hover:bg-white/20"
            onClick={handleAttachment}
          >
            <div className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Open</div>
          </div>
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
        </div>
      </div>
      <div className="font-inter mb-12 text-[15px] font-normal leading-normal text-[#484848]">
        {formatHeaderTimestamp(conversation.startedAt, conversation.endedAt)}
      </div>

      {/* Summary Component */}
      <div ref={summaryRef} className="mb-8 flex w-full flex-col gap-4">
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

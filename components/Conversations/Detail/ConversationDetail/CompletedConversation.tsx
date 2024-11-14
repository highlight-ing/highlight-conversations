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
  const [displayTitle, setDisplayTitle] = useState('')
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

  // Initialize title from conversation
  useEffect(() => {
    if (conversation.title && conversation.title.trim() !== '') {
      setTitle(conversation.title)
      setDisplayTitle(conversation.title)
    } else {
      const relativeTime = getRelativeTimeString(conversation.startedAt)
      setTitle('') // Keep empty title if none set
      setDisplayTitle(relativeTime) // Use relative time for display only
    }
  }, [conversation])

  // Update display title every minute only if no custom title is set
  useEffect(() => {
    if (!conversation.title || conversation.title.trim() === '') {
      const updateDisplayTitle = () => {
        setDisplayTitle(getRelativeTimeString(conversation.startedAt))
      }
      const timer = setInterval(updateDisplayTitle, 60000)
      return () => clearInterval(timer)
    }
  }, [conversation])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Summary Height 
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

  // deletes conversation when called when passing the id 
  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id)
    }
  }

  // Handles the blur event of a title input field 
  const handleTitleBlur = () => {
    setIsEditing(false)
    if (!conversation) return

    const newTitle = title.trim()
    if (newTitle === '') {
      setDisplayTitle(getRelativeTimeString(conversation.startedAt))
      updateConversation({ ...conversation, title: '' })
    } else {
      setDisplayTitle(newTitle)
      updateConversation({ ...conversation, title: newTitle })
    }
  }

  // Listens for keyboard events on an HTML input field
  // when the enter key is pressed, calls for the function  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur()
    }
  }

<<<<<<<<< Temporary merge branch 1
  const truncateTitle = (title: string, isCompact: boolean) => {
    const regex = /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)/i
    const match = title.match(regex)

    if (match) {
      const [full, number, unit] = match

      const getCompactUnit = (unit: string) => {
        switch (unit.toLowerCase()) {
          case 'minute':
          case 'minutes':
            return 'min'
          case 'hour':
          case 'hours':
            return 'hr'
          case 'day':
          case 'days':
            return 'day'
          case 'week':
          case 'weeks':
            return 'wks'
          case 'month':
          case 'months':
            return 'mo'
          case 'year':
          case 'years':
            return 'y'
          default:
            return unit
        }
      }

      return isCompact ? `${number} ${getCompactUnit(unit)}...` : title
    }

    return title
  }

  return (
    <div className="relative flex max-h-full flex-col overflow-y-scroll px-16 pt-12">
      <div className="mb-6 flex w-full flex-row justify-between">
        <div className="flex max-w-[70%] items-center gap-[13px]">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <VoiceSquareIcon />
          </div>

          <div className="font-inter overflow-hidden text-2xl font-semibold leading-[31px] text-white">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="font-inter w-full bg-transparent text-2xl font-semibold leading-[31px] text-white outline-none"
              />
            ) : (
              <h1
                className="font-inter flex cursor-pointer items-center text-2xl font-semibold leading-[31px] text-white"
                onClick={() => setIsEditing(true)}
              >
                <div className="relative w-full">
                  <div className="hidden truncate lg:block">{truncateTitle(displayTitle, false)}</div>
                  <div className="block truncate lg:hidden">{truncateTitle(displayTitle, true)}</div>
                </div>
                <Pencil1Icon className="ml-2 h-4 w-4 flex-shrink-0 text-white/50 hover:text-white" />
              </h1>
            )}
          </div>
        </div>

        
        <div className="inline-flex items-center gap-4">
          {/* Delete Button */}
          <div className="relative flex h-6 w-6 items-center justify-center opacity-40">
            <DeleteConversationDialog onDelete={handleDelete} />
          </div>
          <div
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 hover:bg-white/20"
            onClick={() => {
              handleAttachment(conversation.transcript)
            }}
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

      <div ref={summaryRef} className="mb-8 flex w-full flex-col gap-4">
        {/* Summary of the transcript */}
        <Summary
          transcript={conversation.transcript}
          onSummaryGenerated={(summary) => {
            updateConversation({
              ...conversation,
              summary
            })
          }}
          conversationId={conversation.id}
          existingSummary={conversation.summary}
        />
      </div>

          
      <div className="transition-all duration-300 ease-in-out">
        <Transcript transcript={conversation.transcript} />
      </div>

      <Toaster theme="dark" className="bg-background text-foreground" />
    </div>
  )
}

export default CompletedConversation

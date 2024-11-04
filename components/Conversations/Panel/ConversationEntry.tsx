import React, { useEffect, useState } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { getStandardTimezoneAbbr, formatTimestamp, formatTimestampSimple } from '@/utils/dateUtils'
import VoiceSquareIcon from '../Detail/Icon/PanelIcons/ConversationEntry/VoiceSquareIcon'
import { truncateText } from '@/utils/textUtils'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import { useConversationActions } from '@/components/Card/SavedConversation/useConversationsActions'
import { MessageText } from 'iconsax-react'
import { ShareButton } from './ShareButton'
import { toast } from 'sonner'
import NewTooltip from '@/components/Tooltip/newTooltip'
import { formatInTimeZone } from 'date-fns-tz'

interface ConversationEntryProps {
  conversation: ConversationData
  isFirst: boolean
  isLast: boolean
  isMergeActive: boolean
  isSelected: boolean
}

export function ConversationEntry({
  conversation,
  isFirst,
  isLast,
  isMergeActive,
  isSelected
}: ConversationEntryProps) {
  const { getWordCount, handleConversationSelect, selectedConversationId, deleteConversation, updateConversation } =
    useConversations()

  const {
    localConversation,
    handleShare,
    shareStatus,
    handleGenerateShareLink,
    handleCopyLink,
    shareMessage,
    setShareMessage,
    handleAttachment
  } = useConversationActions(conversation, updateConversation, deleteConversation)

  const formatTime = (date: Date) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeStr = formatInTimeZone(new Date(date), userTimeZone, 'h:mma').toLowerCase()
    const tzAbbr = getStandardTimezoneAbbr(userTimeZone)
    return `${timeStr} ${tzAbbr}`
  }

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

  const roundedClasses =
    isFirst && isLast ? 'rounded-[20px]' : isFirst ? 'rounded-t-[20px]' : isLast ? 'rounded-b-[20px]' : ''

  const handleClick = () => {
    handleConversationSelect(conversation.id)
  }

  const isSelectedConversation = isMergeActive ? isSelected : selectedConversationId === conversation.id

  const selectedClass = isSelectedConversation ? 'bg-white/10' : ''

  const isDefaultTitle = conversation.title?.startsWith('Conversation ended at')

  // Changed for a new design 
  const tempTitle = 'Audio Note'

  const displayTitle =
    !conversation.title || isDefaultTitle ? getRelativeTimeString(conversation.timestamp) : conversation.title

  const previewText = conversation.summary
    ? truncateText(conversation.summary, 100)
    : truncateText(removeTimestamps(conversation.transcript), 100)

  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id)
    }
  }

  const [attachmentTooltipState, setAttachmentTooltipState] = useState<'idle' | 'active' | 'success' | 'hiding'>('idle')
  const [deleteTooltipState, setDeleteTooltipState] = useState<'idle' | 'active' | 'success' | 'hiding'>('idle')

  return (
    <div
      className={`h-[84px] p-4 flex flex-col justify-start items-start gap-3 w-full cursor-pointer border-t border-[#010101] bg-tertiary transition-all duration-300 ease-in-out hover:bg-white/10 ${roundedClasses} ${isMergeActive ? 'hover:bg-tertiary-hover cursor-pointer' : ''} ${selectedClass} group`}
      onClick={handleClick}
    >
          {/* Title Row */}
          <div className="w-full pl-0.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 relative">
            <div className="w-6 h-6 left-0 top-0 absolute rounded-lg" />
            <div className="w-6 h-6 left-0 top-0 absolute justify-center items-center inline-flex">
              <div className="w-6 h-6 relative">
                <VoiceSquareIcon />
              </div>
            </div>
          </div>
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">
            Audio Note
          </div>
        </div>

        {/* Action Buttons */}
        {!isMergeActive && (
          <div className="flex gap-3 text-tertiary opacity-0 group-hover:opacity-100">
            <ShareButton
              onShare={handleShare}
              isSharing={shareStatus === 'processing'}
              hasExistingShareLink={!!localConversation.shareLink}
              onGenerateShareLink={handleGenerateShareLink}
              onCopyLink={handleCopyLink}
            />
            <div className="flex gap-3">
              <NewTooltip
                type="save-attachment"
                message="Add Context"
                state={attachmentTooltipState}
              >
                <MessageText
                  variant="Bold"
                  size={20}
                  className="cursor-pointer transition-colors duration-200 hover:text-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttachment();
                  }}
                  onMouseEnter={() => setAttachmentTooltipState('active')}
                  onMouseLeave={() => setAttachmentTooltipState('idle')}
                />
              </NewTooltip>
              <div 
                onMouseEnter={() => setDeleteTooltipState('active')}
                onMouseLeave={() => setDeleteTooltipState('idle')}
              >
                <NewTooltip
                  type="delete"
                  message="Delete"
                  state={deleteTooltipState}
                >
                  <DeleteConversationDialog
                    onDelete={handleDelete}
                    size={20}
                    colorVariant="tertiary"
                  />
                </NewTooltip>
              </div>
            </div>
          </div>
        )}
      </div>
       {/* Metadata Row */}
       <div className="px-1 flex items-center gap-3">
        <div className="text-[#484848] text-[13px] font-medium font-inter leading-none">
          {formatTime(conversation.timestamp)}
        </div>
        <div className="text-[#484848] text-[13px] font-medium font-inter leading-none">
          {Math.round(conversation.duration || 0)} Minutes
        </div>
        <div className="text-[#484848] text-[13px] font-medium font-inter leading-none">
          {getWordCount(conversation.transcript).toLocaleString()} Words
        </div>
      </div>
    </div>
  )
}

function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 300) {
    return 'Moments ago'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

function removeTimestamps(text: string): string {
  return text.replace(/\d{2}:\d{2}:\d{2} [AP]M - (other\(s\)|self):/g, '').trim()
}

export default ConversationEntry

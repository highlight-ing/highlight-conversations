import React, { useEffect, useState } from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { getStandardTimezoneAbbr, formatTimestamp, formatTimestampSimple, getRelativeTimeString } from '@/utils/dateUtils'
import VoiceSquareIcon from '../Detail/Icon/PanelIcons/ConversationEntry/VoiceSquareIcon'
import MeetingIcon from '../Detail/Icon/MeetingIcon'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import { useConversationActions } from '@/components/Card/SavedConversation/useConversationsActions'
import { MessageText } from 'iconsax-react'
import { ShareButton } from './ShareButton'
import { toast } from 'sonner'
import NewTooltip from '@/components/Tooltip/newTooltip'
import { formatInTimeZone } from 'date-fns-tz'

// Conversation Entry Props 
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

  // format timestamp to user's timezone e.g. 11:11 PM KST
  const formatTime = (date: Date) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeStr = formatInTimeZone(new Date(date), userTimeZone, 'h:mma').toLowerCase()
    const tzAbbr = getStandardTimezoneAbbr(userTimeZone)
    return `${timeStr} ${tzAbbr}`
  }

  // Toast Share Message 
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

  // calculate duration of each time, displayed below 
  const calculateDurationInMinutes = (conversation: ConversationData) => {
    if (conversation.startedAt && conversation.endedAt) {
      const start = new Date(conversation.startedAt)
      const end = new Date(conversation.endedAt)
      
      // Always use timestamp difference for consistent results
      const diffMs = end.getTime() - start.getTime()
      const minutes = Math.round(diffMs / 60000)
      
      // Return at least 1 minute (to avoid 0 minutes)
      return Math.max(1, minutes)
    }
    return 0
  }

  const isSelectedConversation = isMergeActive ? isSelected : selectedConversationId === conversation.id

  const selectedClass = isSelectedConversation ? 'bg-white/10' : ''

  const handleDelete = () => {
    if (conversation) {
      deleteConversation(conversation.id)
    }
  }

  const [attachmentTooltipState, setAttachmentTooltipState] = useState<'idle' | 'active' | 'success' | 'hiding'>('idle')
  const [deleteTooltipState, setDeleteTooltipState] = useState<'idle' | 'active' | 'success' | 'hiding'>('idle')

  const isDefaultTitle = (title: string): boolean => title.startsWith('Audio Notes from')

  const displayTitle = isDefaultTitle(conversation.title) ? 'Audio Note' : conversation.title

  return(
      <div
        className={`min-h-[56px] w-full cursor-pointer border-t border-[#010101] bg-tertiary ${roundedClasses} ${isMergeActive ? 'hover:bg-tertiary-hover' : 'hover:bg-white/10'} ${selectedClass} group`}
        onClick={handleClick}
      >
        {/* Main Content Container */}
        <div className="px-4 py-4 flex flex-col gap-3">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 relative flex-shrink-0">
              {conversation.meeting ? (
                <MeetingIcon meeting={conversation.meeting} size={24} />
              ) : (
                <VoiceSquareIcon />
              )}
              </div>
              <span className="text-[15px] font-medium text-[#eeeeee]">
                {displayTitle}
              </span>
            </div>
    
            {/* Action Buttons - Only show on hover */}
            {!isMergeActive && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                <ShareButton
                  onShare={handleShare}
                  isSharing={shareStatus === 'processing'}
                  hasExistingShareLink={!!localConversation.shareLink}
                  onGenerateShareLink={handleGenerateShareLink}
                  onCopyLink={handleCopyLink}
                />
                <NewTooltip
                  type="save-attachment"
                  message="Add Context"
                  state={attachmentTooltipState}
                >
                  <MessageText
                    variant="Bold"
                    size={18}
                    className="cursor-pointer text-[#484848] hover:text-gray-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAttachment();
                    }}
                    onMouseEnter={() => setAttachmentTooltipState('active')}
                    onMouseLeave={() => setAttachmentTooltipState('idle')}
                  />
                </NewTooltip>
                <NewTooltip
                  type="delete"
                  message="Delete"
                  state={deleteTooltipState}
                >
                  <div 
                    onMouseEnter={() => setDeleteTooltipState('active')}
                    onMouseLeave={() => setDeleteTooltipState('idle')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DeleteConversationDialog
                      onDelete={handleDelete}
                      size={18}
                      colorVariant="tertiary"
                    />
                  </div>
                </NewTooltip>
              </div>
            )}
          </div>
    
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#484848]">
            <span className="whitespace-nowrap">{formatTime(conversation.timestamp)}</span>
            <span className="whitespace-nowrap">
              {calculateDurationInMinutes(conversation)} Minute{calculateDurationInMinutes(conversation) > 1 ? 's' : ''}
            </span>
            <span className="whitespace-nowrap">
              {getWordCount(conversation.transcript).toLocaleString()} Words
            </span>
          </div>
        </div>
      </div>
    )
}

export default ConversationEntry

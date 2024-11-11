import React, { useEffect, useState } from 'react'
import { formatInTimeZone } from 'date-fns-tz'
import { MessageText } from 'iconsax-react'
import { toast } from 'sonner'

import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import { getStandardTimezoneAbbr, getRelativeTimeString } from '@/utils/dateUtils'
import { useConversationActions } from '@/components/Card/SavedConversation/useConversationsActions'
import VoiceSquareIcon from '../Detail/Icon/PanelIcons/ConversationEntry/VoiceSquareIcon'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import { ShareButton } from './ShareButton'
import NewTooltip from '@/components/Tooltip/newTooltip'

interface ConversationEntryProps {
  conversation: ConversationData
  isFirst: boolean
  isLast: boolean  
  isMergeActive: boolean
  isSelected: boolean
}

type TooltipState = 'idle' | 'active' | 'success' | 'hiding'

const formatTime = (date: Date) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const timeStr = formatInTimeZone(new Date(date), userTimeZone, 'h:mma').toLowerCase()
  const tzAbbr = getStandardTimezoneAbbr(userTimeZone)
  return `${timeStr} ${tzAbbr}`
}

const calculateDurationInMinutes = (conversation: ConversationData) => {
  if (!conversation.startedAt || !conversation.endedAt) return 0
  
  const diffMs = new Date(conversation.endedAt).getTime() - new Date(conversation.startedAt).getTime()
  const minutes = Math.round(diffMs / 60000)
  return Math.max(1, minutes)
}

const isDefaultTitle = (title: string) => title.startsWith('Audio Notes from')

export const ConversationEntry: React.FC<ConversationEntryProps> = ({
  conversation,
  isFirst,
  isLast,
  isMergeActive,
  isSelected
}) => {
  const [attachmentTooltipState, setAttachmentTooltipState] = useState<TooltipState>('idle')
  const [deleteTooltipState, setDeleteTooltipState] = useState<TooltipState>('idle')

  const { 
    getWordCount, 
    handleConversationSelect, 
    selectedConversationId, 
    deleteConversation, 
    updateConversation 
  } = useConversations()

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

  useEffect(() => {
    if (!shareMessage) return
    
    if (shareMessage.type === 'success') {
      toast.success(shareMessage.message, { description: shareMessage.description })
    } else {
      toast.error(shareMessage.message)
    }
    setShareMessage(null)
  }, [shareMessage, setShareMessage])

  const roundedClasses = isFirst && isLast 
    ? 'rounded-[20px]' 
    : isFirst 
    ? 'rounded-t-[20px]' 
    : isLast 
    ? 'rounded-b-[20px]' 
    : ''

  const isSelectedConversation = isMergeActive ? isSelected : selectedConversationId === conversation.id
  const selectedClass = isSelectedConversation ? 'bg-white/10' : ''
  const displayTitle = isDefaultTitle(conversation.title) 
    ? `Last Updated ${getRelativeTimeString(conversation.timestamp)}` 
    : conversation.title

  const handleClick = () => handleConversationSelect(conversation.id)
  const handleDelete = () => deleteConversation(conversation.id)

  return (
    <div
      className={`min-h-[56px] w-full cursor-pointer border-t border-[#010101] bg-tertiary ${roundedClasses} ${isMergeActive ? 'hover:bg-tertiary-hover' : 'hover:bg-white/10'} ${selectedClass} group`}
      onClick={handleClick}
    >
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative flex-shrink-0">
              <VoiceSquareIcon />
            </div>
            <span className="text-[15px] font-medium text-[#eeeeee]">
              {displayTitle}
            </span>
          </div>

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
                    e.stopPropagation()
                    handleAttachment()
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
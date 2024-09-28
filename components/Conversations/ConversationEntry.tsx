import React from 'react'
import { ConversationData } from '@/data/conversations'
import { useConversations } from '@/contexts/ConversationContext'
import Highlight from '@highlight-ai/app-runtime'
import { ConversationsIcon } from '@/components/ui/icons/ConversationIcon'
import { truncateText } from '@/utils/textUtils'
interface ConversationEntryProps {
  conversation?: ConversationData
  isFirst: boolean
  isLast: boolean
  isShowMore?: boolean
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

export function ConversationEntry({ conversation, isFirst, isLast, isShowMore = false }: ConversationEntryProps) {
  const { getWordCount } = useConversations()
  const roundedClasses = isFirst ? 'rounded-t-[20px]' : isLast ? 'rounded-b-[20px]' : ''

  const handleShowMore = () => {
    // TODO: If we find there are too many cells, we'll do an accordion thing
  }

  const handleShare = async () => { 

  }

  if (isShowMore) {
    return (
      <div
        className={`w-full border-t border-[#0F0F0F] bg-tertiary p-6 transition-all duration-300 ease-in-out ${roundedClasses}`}
      >
        <div className="flex justify-center">
          <button
            onClick={handleShowMore}
            className="rounded-[6px] bg-tertiary px-5 py-2 font-medium text-secondary transition-colors duration-200 hover:bg-white/20"
          >
            Show More
          </button>
        </div>
      </div>
    )
  }

  const isDefaultTitle = conversation?.title.startsWith('Conversation ended at')
  const displayTitle =
    isDefaultTitle || conversation?.title === ''
      ? getRelativeTimeString(conversation?.timestamp ?? new Date())
      : conversation?.title

  const previewText = conversation?.summary 
    ? truncateText(conversation.summary, 100) 
    : truncateText(conversation?.transcript ?? '', 100)

  return (
    <div
      className={`w-full border-t border-[#010101] bg-tertiary p-4 transition-all duration-300 ease-in-out ${roundedClasses}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <ConversationsIcon width={24} height={24} color="#4D8C6E" />
          <h3 className="text-[15px] font-medium text-primary">{displayTitle}</h3>
        </div>
        <button
          onClick={handleShare}
          className="px-3 h-[24px] text-[13px] text-primary bg-white/10 rounded-[6px] leading-tight hover:bg-white/20"
        >
          Share
        </button>
      </div>
      <p className="text-[13px] text-secondary line-clamp-2">{previewText}</p>
      <div className="flex justify-between items-center mt-2 text-[12px] text-muted-foreground">
        <span>{getWordCount(conversation?.transcript ?? '')} words</span>
        {/* <span>{formatDate(conversation.timestamp)}</span> */}
      </div>
    </div>
  )
}

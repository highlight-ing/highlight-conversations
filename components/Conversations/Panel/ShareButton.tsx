import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

interface ShareButtonProps {
  onShare: () => void
  isSharing: boolean
  hasExistingShareLink: boolean
  onGenerateShareLink: () => void
  onCopyLink: () => void
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  isSharing,
  hasExistingShareLink,
  onGenerateShareLink
}) => {
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSharing) return
    if (hasExistingShareLink) {
      onGenerateShareLink()
    } else {
      onGenerateShareLink()
    }
  }

  return (
    <div
      onClick={onClick}
      className="flex h-[20px] cursor-pointer items-center justify-center rounded-[6px] bg-white/[0.08] px-2 text-[13px] text-secondary transition-colors duration-200 hover:bg-white/20 hover:text-secondary"
    >
      {isSharing && !hasExistingShareLink ? (
        <>
          <span className="border-brand mr-2 inline-block animate-spin rounded-full border-2 border-solid border-r-transparent align-[-0.125em] text-secondary" />
          Generating...
        </>
      ) : (
        <span className="text-[15px] font-medium leading-tight text-[#b4b4b4]">
          {hasExistingShareLink ? 'Copy Link' : 'Share'}
        </span>
      )}
    </div>
  )
}

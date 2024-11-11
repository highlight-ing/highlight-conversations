import React from 'react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ShareOptionsMenu } from './ShareOptionsMenu'

interface ShareButtonProps {
  onShare: () => void
  isSharing: boolean
  isDeleting: boolean
  hasExistingShareLink: boolean
  onGenerateShareLink: () => void
  onDownloadAsFile: () => void
  onCopyLink: () => void
  onDeleteLink: () => void
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  isSharing,
  isDeleting,
  hasExistingShareLink,
  onGenerateShareLink,
  onDownloadAsFile,
  onCopyLink,
  onDeleteLink,
}) => (
  <div className="relative">
    <Button
      onClick={onShare}
      disabled={isSharing || isDeleting}
      className="hover:text-brand flex h-auto w-auto items-center justify-center gap-2 rounded-[10px] bg-white/10 px-4 py-1.5 transition-colors duration-200 hover:bg-white/20"
    >
      {isSharing && !hasExistingShareLink ? (
        <>
          <span className="border-brand mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent align-[-0.125em]" />
          Generating...
        </>
      ) : isDeleting ? (
        <>
          <span className="border-brand mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent align-[-0.125em]" />
          Deleting...
        </>
      ) : (
        <span className="text-[15px] font-medium leading-tight text-[#b4b4b4]">Share</span>
      )}
    </Button>
    <HoverCard openDelay={0} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div className="absolute inset-0" />
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-0">
        <ShareOptionsMenu
          hasExistingShareLink={hasExistingShareLink}
          onGenerateShareLink={onGenerateShareLink}
          onDownloadAsFile={onDownloadAsFile}
          onCopyLink={onCopyLink}
          onDeleteLink={onDeleteLink}
        />
      </HoverCardContent>
    </HoverCard>
  </div>
)

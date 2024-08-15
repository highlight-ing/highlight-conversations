import React from 'react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ShareOptionsMenu } from './ShareOptionsMenu'

interface ShareButtonProps {
  onShare: () => void;
  isSharing: boolean;
  hasExistingShareLink: boolean;
  onGenerateShareLink: () => void;
  onDownloadAsFile: () => void;
  onCopyLink: () => void;
  onDeleteLink: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  isSharing,
  hasExistingShareLink,
  onGenerateShareLink,
  onDownloadAsFile,
  onCopyLink,
  onDeleteLink
}) => (
  <HoverCard openDelay={0} closeDelay={150}>
    <HoverCardTrigger asChild>
      <Button
        onClick={onShare}
        disabled={isSharing}
        className="flex-1 items-center justify-center rounded-lg bg-background p-2 text-[15px] font-semibold text-foreground transition-colors duration-200 hover:bg-background hover:text-brand"
      >
        {isSharing && !hasExistingShareLink ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-brand border-r-transparent align-[-0.125em]"></span>
            Generating...
          </>
        ) : (
          <span className="flex items-center gap-2">Share</span>
        )}
      </Button>
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
)
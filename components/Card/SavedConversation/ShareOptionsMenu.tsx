import React from 'react'
import { Link1Icon, DownloadIcon, LinkBreak2Icon } from '@radix-ui/react-icons'

interface ShareOptionsMenuProps {
  hasExistingShareLink: boolean;
  onGenerateShareLink: () => void;
  onDownloadAsFile: () => void;
  onCopyLink: () => void;
  onDeleteLink: () => void;
}

const MenuOption: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
)

export const ShareOptionsMenu: React.FC<ShareOptionsMenuProps> = ({
  hasExistingShareLink,
  onGenerateShareLink,
  onDownloadAsFile,
  onCopyLink,
  onDeleteLink
}) => (
  <div className="rounded-md border border-border bg-background p-1 shadow-md">
    {!hasExistingShareLink ? (
      <>
        <MenuOption
          icon={<Link1Icon className="h-4 w-4" />}
          label="Generate Share Link"
          onClick={onGenerateShareLink}
        />
        <div className="my-1 h-px bg-border" />
        <MenuOption
          icon={<DownloadIcon className="h-4 w-4" />}
          label="Download as file"
          onClick={onDownloadAsFile}
        />
      </>
    ) : (
      <>
        <MenuOption
          icon={<Link1Icon className="h-4 w-4" />}
          label="Copy Link"
          onClick={onCopyLink}
        />
        <div className="my-1 h-px bg-border" />
        <MenuOption
          icon={<DownloadIcon className="h-4 w-4" />}
          label="Download as file"
          onClick={onDownloadAsFile}
        />
        <div className="my-1 h-px bg-border" />
        <MenuOption
          icon={<LinkBreak2Icon className="h-4 w-4" />}
          label="Delete Link"
          onClick={onDeleteLink}
        />
      </>
    )}
  </div>
)
import React, { useState } from 'react'
import { DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShareDialogContentProps {
  status: 'idle' | 'processing' | 'success' | 'error'
  url: string
  onClose: () => void
}

const ShareDialogContent: React.FC<ShareDialogContentProps> = ({ status, url, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          onClose();
        }, 500); // Close dialog after 1.5 seconds
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <DialogDescription asChild>
      <div className={`w-full ${status === 'processing' ? 'min-w-[300px]' : ''}`}>
        {status === 'processing' && <ProcessingContent />}
        {status === 'success' && <SuccessContent url={url} onCopy={handleCopyShareUrl} isCopied={isCopied} />}
        {status === 'error' && <ErrorContent />}
      </div>
    </DialogDescription>
  )
}

const ProcessingContent: React.FC = () => (
  <div className="flex justify-center items-center h-24">
    <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full"></div>
  </div>
)

const SuccessContent: React.FC<{ url: string; onCopy: () => void; isCopied: boolean }> = ({ url, onCopy, isCopied }) => (
  <div className="py-4">
    <TooltipProvider>
      <Tooltip open={isCopied}>
        <TooltipTrigger asChild>
          <div 
            onClick={onCopy}
            className="text-foreground select-text hover:text-brand cursor-pointer whitespace-nowrap overflow-x-auto max-w-full"
          >
            {url}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>{isCopied ? "Copied!" : "Click to copy"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)

const ErrorContent: React.FC = () => (
  <div className="py-4 text-destructive">
    Failed to share conversation. Please try again.
  </div>
)

export default ShareDialogContent
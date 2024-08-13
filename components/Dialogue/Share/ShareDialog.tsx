import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ShareDialogContent from './ShareDialogContent'

interface ShareDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  status: 'idle' | 'processing' | 'success' | 'error'
  url: string
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onOpenChange, status, url }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-auto">
        <DialogHeader>
          <DialogTitle>
            {status === 'processing' && 'Generating...'}
            {status === 'success' && 'Share Link Ready 🎉'}
            {status === 'error' && 'Error with Share Link'}
          </DialogTitle>
        </DialogHeader>
        <ShareDialogContent status={status} url={url} />
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
'use client'

import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { trackEvent } from '@/lib/amplitude'

type PageType = 'SharePage' | 'NotFoundPage'

interface DownloadButtonProps {
  page: PageType
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ page }) => {

  const handleDownload = useCallback(() => {
    trackEvent(`${page}: Download Button Clicked`, {});
    window.open("https://highlight.ing/apps/conversations", "_blank", "noopener,noreferrer");
  }, [page])
  
  return (
    <Button 
      onClick={handleDownload}
      className="bg-brand text-background font-bold hover:bg-brand-light"
    >
      Download Conversations
    </Button>
  )
}

export default DownloadButton
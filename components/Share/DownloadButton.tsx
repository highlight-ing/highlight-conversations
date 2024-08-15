'use client'

import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { trackEvent } from '@/lib/amplitude'

const DownloadButton: React.FC = () => {

  const handleDownload = useCallback(() => {
    trackEvent('Share Page: Download Button Clicked', {});
    window.open("https://highlight.ing/apps/conversations", "_blank", "noopener,noreferrer");
  }, [])
  
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
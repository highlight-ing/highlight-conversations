import React from 'react'
import { Separator } from "@/components/ui/separator"
import DownloadButton from '@/components/Share/DownloadButton'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background">
      <Separator />
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
        <p className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
          <span className="sm:hidden">
            Create and share your own transcripts,<br />securely and for free
          </span>
          <span className="hidden sm:inline">
            Create and share your own transcripts, securely and for free
          </span>
        </p>
        <DownloadButton />
      </div>
    </footer>
  )
}

export default Footer
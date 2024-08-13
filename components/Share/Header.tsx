import React from 'react'
import { Separator } from "@/components/ui/separator"
import DownloadButton from '@/components/Share/DownloadButton'

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 bg-background">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h2 className="text-lg font-bold">
          Created with Conversations, by Highlight
        </h2>
        <DownloadButton />
      </div>
      <Separator className="mt-4" />
    </header>
  )
}

export default Header
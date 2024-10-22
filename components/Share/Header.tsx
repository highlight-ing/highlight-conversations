import React from 'react'
import { Separator } from '@/components/ui/separator'
import DownloadButton from '@/components/Share/DownloadButton'

const Header: React.FC = () => {
  return (
    <header className="w-full bg-background">
      <div className="mx-auto flex max-w-[calc(100vw-2rem)] flex-col items-center justify-between space-y-4 py-4 sm:max-w-2xl sm:flex-row sm:space-y-0 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <h2 className="w-full text-center text-lg font-medium sm:w-auto sm:text-left">
          <span className="sm:hidden">
            Create and share your own transcripts,
            <br />
            securely and for free
          </span>
          <span className="hidden sm:inline">Create and share your own transcripts, securely and for free</span>
        </h2>
        <DownloadButton page="SharePage" />
      </div>
      <Separator />
    </header>
  )
}

export default Header

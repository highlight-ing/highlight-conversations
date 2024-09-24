import React from 'react'
import { Trash, Setting2 } from 'iconsax-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const PanelHeader: React.FC = () => {
  const handleDeleteAll = () => {
    // Implement delete all conversations logic
  }

  const handleSettings = () => {
    // Implement settings logic
  }

  return (
    <div className="flex items-center justify-between border-b border-tertiary">
      <h1 className="text-primary text-lg font-medium py-6 pl-5">
        Conversations
      </h1>
      <div className="flex items-center gap-5 py-5 pr-[30px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDeleteAll}
                className="text-[#EEEEEE] hover:text-[#FF395D]"
              >
                <Trash variant="Bold" size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete all Conversations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSettings}
                className="text-[#EEEEEE] hover:text-[#FFA500]"
              >
                <Setting2 variant="Bold" size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default PanelHeader
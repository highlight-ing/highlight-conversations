import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface IconButtonProps {
  icon: React.ReactNode
  onClick: () => void
  tooltip: string
  className?: string
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, tooltip, className = '' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`text-[#EEEEEE] transition-colors duration-200 ease-in-out ${className}`}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
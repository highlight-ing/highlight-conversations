import React from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'

const ViewIndicator: React.FC = () => (
  <div className="absolute bottom-2 right-2">
    <div className="flex items-center rounded-lg bg-background/10 px-2 py-1 text-sm font-medium text-foreground/70 backdrop-blur-sm group-hover:text-foreground">
      <span className="mr-1">View</span>
      <ChevronRightIcon className="h-4 w-4" />
    </div>
  </div>
)

export default ViewIndicator
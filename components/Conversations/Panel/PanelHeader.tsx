import React from 'react'
import HighlightGreenLogo from '../Detail/Icon/HighlightGreenLogo'

interface PanelHeaderProps {
  onMergeActivate: () => void
  isMergeActive: boolean
  setIsSettingsActive: (isActive: boolean) => void; 
}

const PanelHeader: React.FC<PanelHeaderProps> = () => {
  return (
    <div className="flex items-center justify-between border-b border-tertiary">
      <div className="flex items-center ml-6">
        <HighlightGreenLogo />
        <h1 className="text-primary text-lg font-medium py-3 pl-2">
          Highlight Audio
        </h1>
      </div>
      <div className="flex items-center gap-5 py-5 pr-[30px]">
      </div>
    </div>
  )
}

export default PanelHeader



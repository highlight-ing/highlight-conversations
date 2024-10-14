import React from 'react'
import HighlightGreenLogo from '../Detail/Icon/HighlightGreenLogo'

interface PanelHeaderProps {
  onMergeActivate: () => void
  isMergeActive: boolean
  setIsSettingsActive: (isActive: boolean) => void; 
}

interface HighLightGreenLogoProps {
  className?: string; 
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ onMergeActivate, isMergeActive, setIsSettingsActive }) => {
  const handleDeleteAll = () => {
    // Implement delete all conversations logic
  }

  const handleSettings = () => {
    setIsSettingsActive(true); 
  }

  return (
    <div className="flex items-center justify-between border-b border-tertiary">
      <div className="flex items-center ml-6">
        <HighlightGreenLogo />
        <h1 className="text-primary text-lg font-medium py-3 pl-2">
          Highlight Meetings
        </h1>
      </div>
      <div className="flex items-center gap-5 py-5 pr-[30px]">
      </div>
    </div>
  )
}

export default PanelHeader


/**
 *      <IconButton
          icon={<ForwardItem variant={isMergeActive ? "Bold" : "Linear"} size={24} />}
          onClick={onMergeActivate}
          tooltip={isMergeActive ? 'Cancel Merge' : 'Merge Conversations'}
          className={isMergeActive ? 'text-[#4CEDA0]' : 'text-[#EEEEEE] hover:text-[#4CEDA0]'}
        />

        <IconButton
          icon={<Trash variant="Bold" size={24} />}
          onClick={handleDeleteAll}
          tooltip="Delete all Conversations"
          className="text-[#EEEEEE] hover:text-[#FF395D]"
        />

        <IconButton
          icon={<Setting2 variant="Bold" size={24} />}
          onClick={handleSettings}
          tooltip="Settings"
          className="text-[#EEEEEE] hover:text-[#4CEDA0]"
        />
 */
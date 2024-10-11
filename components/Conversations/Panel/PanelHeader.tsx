import React, { useEffect, useState } from 'react'
import { Trash, Setting2, ForwardItem } from 'iconsax-react'
import { IconButton } from '@/components/ui/IconButton'

interface PanelHeaderProps {
  onMergeActivate: () => void
  isMergeActive: boolean
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ onMergeActivate, isMergeActive }) => {
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
        <IconButton
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
      </div>
    </div>
  )
}

export default PanelHeader
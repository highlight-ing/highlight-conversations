// components/Header.tsx
import React from 'react'
import AutoClearSelection from './AutoClearSelection'
import AudioSwitch from './AudioSwitch'
import AutoSaveSelection from './AutoSaveSelection'
import DeleteAllButton from './DeleteAllButton'

interface HeaderProps {
  autoClearValue: number
  isAudioOn: boolean
  autoSaveValue: number
  onAutoClearValueChange: (value: number) => void
  onAudioSwitch: (isOn: boolean) => void
  onAutoSaveChange: (value: number) => void
  onDeleteAllConversations: () => void
}

const Header: React.FC<HeaderProps> = ({
  autoClearValue,
  isAudioOn,
  autoSaveValue,
  onAutoClearValueChange,
  onAudioSwitch,
  onAutoSaveChange,
  onDeleteAllConversations
}) => {
  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
        <div className="flex-1 flex items-center justify-center space-x-4">
          <AutoSaveSelection value={autoSaveValue} onIdleTimerChange={onAutoSaveChange}/>
          <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
        </div>
        <DeleteAllButton onDeleteAllConversations={onDeleteAllConversations} />
      </div>
    </div>
  )
}

export default Header
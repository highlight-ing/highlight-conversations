import React from 'react'
import { useAppSettings } from '@/contexts/AppSettingsContext'
import AutoClearSelection from './AutoClearSelection'
import AudioSwitch from './AudioSwitch'
import AutoSaveSelection from './AutoSaveSelection'
import DeleteAllButton from './DeleteAllButton'

const Header: React.FC<HeaderProps> = () => {
  const { 
    isAudioOn, 
    setIsAudioOn, 
    autoClearValue, 
    setAutoClearValue, 
    autoSaveValue, 
    setAutoSaveValue 
  } = useAppSettings();

  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <AudioSwitch isAudioOn={isAudioOn} onSwitch={setIsAudioOn} />
        <div className="flex-1 flex items-center justify-center space-x-4">
          <AutoSaveSelection value={autoSaveValue} onIdleTimerChange={setAutoSaveValue}/>
          <AutoClearSelection value={autoClearValue} onChange={setAutoClearValue} />
        </div>
        <DeleteAllButton />
      </div>
    </div>
  )
}

export default Header
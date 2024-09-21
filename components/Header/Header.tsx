import React from 'react'
import { useAppSettings } from '@/contexts/AppSettingsContext'
import { useConversations } from '@/contexts/ConversationContext'
import AutoClearSelection from './AutoClearSelection'
import AudioSwitch from './AudioSwitch'
import AutoSaveSelection from './AutoSaveSelection'
import DeleteAllButton from './DeleteAllButton'

const Header: React.FC = () => {
  const { 
    autoSaveTime, 
    setAutoSaveTime, 
    autoClearDays, 
    setAutoClearDays 
  } = useConversations();

  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <AudioSwitch/>
        <div className="flex-1 flex items-center justify-center space-x-4">
          <AutoSaveSelection value={autoSaveTime} onIdleTimerChange={setAutoSaveTime}/>
          <AutoClearSelection value={autoClearDays} onChange={setAutoClearDays} />
        </div>
        <DeleteAllButton />
      </div>
    </div>
  )
}

export default Header
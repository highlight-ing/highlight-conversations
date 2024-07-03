// components/Header.tsx
import React from 'react'
import AutoClearSelection from './AutoClearSelection'
import AudioSwitch from './AudioSwitch'
import AutoSaveSelection from './AutoSaveSelection'
import InfoTooltip from './InfoTooltip'
import { TOOLTIP_CONTENT } from '@/constants/tooltipConstants'

interface HeaderProps {
  autoClearValue: number
  isAudioOn: boolean
  characterCount: number
  autoSaveValue: number
  onAutoClearValueChange: (value: number) => void
  onAudioSwitch: (isOn: boolean) => void
  onAutoSaveChange: (value: number) => void
}

const Header: React.FC<HeaderProps> = ({
  autoClearValue,
  isAudioOn,
  autoSaveValue,
  onAutoClearValueChange,
  onAudioSwitch,
  onAutoSaveChange
}) => {
  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
          <InfoTooltip content={TOOLTIP_CONTENT.AUDIO_SWITCH} />
        </div>
        <div className="flex items-center">
          <AutoSaveSelection value={autoSaveValue} onIdleTimerChange={onAutoSaveChange} />
          <InfoTooltip content={TOOLTIP_CONTENT.AUTO_SAVE} />
        </div>
        <div className="flex items-center">
          <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
          <InfoTooltip content={TOOLTIP_CONTENT.AUTO_CLEAR} />
        </div>
      </div>
    </div>
  )
}

export default Header

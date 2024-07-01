// components/Header.tsx
import React from "react"
import AutoClearSelection from "./AutoClearSelection"
import AudioSwitch from "./AudioSwitch"
import CharacterCountSelection from "./CharacterCountSelection"
import IdleTimerSelection from "./IdleTimerSelection"
import InfoTooltip from "./InfoTooltip"
import { TOOLTIP_CONTENT } from "@/constants/tooltipConstants"

interface HeaderProps {
  autoClearValue: number
  isAudioOn: boolean
  characterCount: number
  idleTimerValue: number
  onAutoClearValueChange: (value: number) => void
  onAudioSwitch: (isOn: boolean) => void
  onCharacterCountChange: (value: number) => void
  onIdleTimerChange: (value : number) => void
}

const Header: React.FC<HeaderProps> = ({
  autoClearValue,
  characterCount,
  isAudioOn,
  idleTimerValue,
  onAutoClearValueChange,
  onAudioSwitch,
  onCharacterCountChange,
  onIdleTimerChange,
}) => {
  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
          <InfoTooltip content={TOOLTIP_CONTENT.AUDIO_SWITCH} />
        </div>
        <div className="flex items-center">
          <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
          <InfoTooltip content={TOOLTIP_CONTENT.AUTO_CLEAR} />
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <CharacterCountSelection value={characterCount} onCharacterCountChange={onCharacterCountChange} />
          <InfoTooltip content={TOOLTIP_CONTENT.CHARACTER_COUNT} />
        </div>
        <div className="flex items-center">
          <IdleTimerSelection value={idleTimerValue} onIdleTimerChange={onIdleTimerChange} />
          <InfoTooltip content={TOOLTIP_CONTENT.IDLE_TIMER} />
        </div>
      </div>
    </div>
  );
};

export default Header;
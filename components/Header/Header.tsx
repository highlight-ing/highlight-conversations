// components/Header.tsx
import React from "react"
import AutoClearSelection from "./AutoClearSelection"
import AudioSwitch from "./AudioSwitch"
import CharacterCountSelection from "./CharacterCountSelection"
import IdleTimerSelection from "./IdleTimerSelection"
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
        <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
        <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
        {/* Add more components to this row */}
      </div>
      <div className="flex items-center justify-between p-4">
        <CharacterCountSelection value={characterCount} onCharacterCountChange={onCharacterCountChange} />
        <IdleTimerSelection value={idleTimerValue} onIdleTimerChange={onIdleTimerChange} />
      </div>
      {/* Add more rows as needed */}
    </div>
  );
};

export default Header;
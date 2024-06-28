// components/Header.tsx
import React from "react";
import AutoClearSelection from "./AutoClearSelection";
import AudioSwitch from "./AudioSwitch"

interface HeaderProps {
  autoClearValue: number;
  isAudioOn: boolean;
  onAutoClearValueChange: (value: number) => void;
  onAudioSwitch: (isOn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ autoClearValue, onAutoClearValueChange, isAudioOn, onAudioSwitch }) => {
  return (
    <div className="w-full flex items-center justify-between p-4 border-b">
      <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
      <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
    </div>
  );
};

export default Header;
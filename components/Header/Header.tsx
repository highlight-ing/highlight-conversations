// components/Header.tsx
import React from "react";
import AutoClearSelection from "./AutoClearSelection";
import AudioSwitch from "./AudioSwitch";
// Import other components as needed

interface HeaderProps {
  autoClearValue: number;
  isAudioOn: boolean;
  onAutoClearValueChange: (value: number) => void;
  onAudioSwitch: (isOn: boolean) => void;
  // Add other props as needed
}

const Header: React.FC<HeaderProps> = ({
  autoClearValue,
  onAutoClearValueChange,
  isAudioOn,
  onAudioSwitch,
  // Destructure other props
}) => {
  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between p-4">
        <AudioSwitch isAudioOn={isAudioOn} onSwitch={onAudioSwitch} />
        <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
        {/* Add more components to this row */}
      </div>
      <div className="flex items-center justify-between p-4">
        {/* Add another row of components */}
        {/* <OtherComponent1 /> */}
        {/* <OtherComponent2 /> */}
      </div>
      {/* Add more rows as needed */}
    </div>
  );
};

export default Header;
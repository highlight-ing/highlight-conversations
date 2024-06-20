// components/Header.tsx
import React from "react";
import AutoClearSelection from "./AutoClearSelection";

interface HeaderProps {
  autoClearValue: number;
  onAutoClearValueChange: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ autoClearValue, onAutoClearValueChange }) => {
  return (
    <div className="w-full flex items-center justify-between p-4">
      <h1 className="px-2 text-left">Conversations</h1>
      <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
    </div>
  );
};

export default Header;
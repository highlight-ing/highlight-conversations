// components/Header.tsx
import React from "react";
import AutoClearSelection from "./AutoClearSelection";

interface HeaderProps {
  autoClearValue: number;
  onAutoClearValueChange: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ autoClearValue, onAutoClearValueChange }) => {
  return (
    <div className="w-full flex items-center justify-between p-4 border-b">
      <h1 className="text-4xl font-bold px-5 text-left">Conversations</h1>
      <AutoClearSelection value={autoClearValue} onChange={onAutoClearValueChange} />
    </div>
  );
};

export default Header;
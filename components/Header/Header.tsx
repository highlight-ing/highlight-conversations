// components/Header.tsx
import React, { useState } from "react";
import AutoClearSelection from "./AutoClearSelection";

const Header: React.FC = () => {
  const [autoClearValue, setAutoClearValue] = useState(1);

  return (
    <div className="fixed left-0 right-0 top-0 flex w-full items-center justify-between p-4 flex-col">
      <h1 className="px-2 text-left">Conversations</h1>
      <AutoClearSelection value={autoClearValue} onChange={setAutoClearValue} />
    </div>
  );
};

export default Header;

import React, { useState } from 'react';

interface MyTranscriptPanelProps {
    setIsSettingsActive: (isActive: boolean) => void; 
    isSettingsActive: boolean; 
}

const MyTranscriptPanel: React.FC<MyTranscriptPanelProps> = ({ setIsSettingsActive, isSettingsActive }) => {
    const handleSettingsClick = () => {
        setIsSettingsActive(true);
    }

    const handleTranscriptsClick = () => {
        setIsSettingsActive(false); 
    }

    return (
        <div className="w-[531px] h-[52px] px-5 py-3 border-b border-white/5 justify-start items-center gap-1.5 inline-flex">
            <div className="justify-start items-center gap-3 flex">
                {/* My Transcripts Button */}
                <div 
                    className={`px-2 py-1.5 rounded-md justify-center items-center gap-2.5 flex cursor-pointer ${!isSettingsActive ? 'text-white' : 'text-gray-500'}`}
                    onClick={handleTranscriptsClick}
                >
                    <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-none">My Transcripts</div>
                </div>

                {/* Settings Button */}
                <div 
                   className={`px-2 py-1.5 rounded-lg justify-center items-center gap-2.5 flex cursor-pointer ${isSettingsActive ? 'text-white' : 'text-[#484848]'}`}
                    onClick={handleSettingsClick}
                >
                    <div className="text-[#484848] text-[15px] font-medium font-inter leading-none">Settings</div>
                </div>
            </div>
        </div>
    );
};

export default MyTranscriptPanel;

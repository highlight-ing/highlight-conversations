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
        <div className="w-full h-[52px] px-5 py-3 border-b border-white/5 flex items-center">
            <div className="flex w-full">
                {/* My Transcripts Button */}
                <div 
                    className="h-7 px-2 py-1.5 rounded-lg justify-center items-center gap-2.5 inline-flex cursor-pointer"
                    onClick={handleTranscriptsClick}
                >
                    <div className="text-[#484848] text-[15px] font-medium font-inter leading-none">
                        My Transcripts
                    </div>
                </div>

                {/* Settings Button */}
                <div 
                    className="h-7 px-2 py-1.5 rounded-md justify-center items-center gap-2.5 inline-flex cursor-pointer"
                    onClick={handleSettingsClick}
                >
                    <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-none">
                        Settings
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTranscriptPanel;

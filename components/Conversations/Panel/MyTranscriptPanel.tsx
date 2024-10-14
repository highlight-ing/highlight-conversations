import React from 'react';

const MyTranscriptPanel: React.FC = () => {
    return (
        <div className="w-[531px] h-[52px] px-5 py-3 border-b border-white/5 justify-start items-center gap-1.5 inline-flex">
            <div className="justify-start items-center gap-3 flex">
                <div className="px-2 py-1.5 rounded-md justify-center items-center gap-2.5 flex">
                    <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-none">My Transcripts</div>
                </div>
                <div className="px-2 py-1.5 rounded-lg justify-center items-center gap-2.5 flex">
                    <div className="text-[#484848] text-[15px] font-medium font-inter leading-none">Settings</div>
                </div>
            </div>
        </div>
    );
};

export default MyTranscriptPanel;

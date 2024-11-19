import React from 'react'
import { motion } from 'framer-motion'

interface MyTranscriptPanelProps {
    setIsSettingsActive: (isActive: boolean) => void; 
    isSettingsActive: boolean; 
}

const animationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
}

const MyTranscriptPanel: React.FC<MyTranscriptPanelProps> = ({ setIsSettingsActive, isSettingsActive }) => {
    const handleSettingsClick = () => {
        setIsSettingsActive(true)
    }

    const handleTranscriptsClick = () => {
        setIsSettingsActive(false)
    }

    return (
        <div className="w-full h-[52px] px-5 py-3 border-b border-white/5 flex items-center">
            <div className="flex w-full">
                    {/* My Transcripts Button */}
                    <motion.div 
                        className="h-7 px-2 py-1.5 rounded-lg justify-center items-center gap-2.5 inline-flex cursor-pointer mr-4 hover:bg-white/5"
                        onClick={handleTranscriptsClick}
                        {...animationProps}
                    >
                        {/* If the settings is clicked, it should be white, else grey  */}
                        <div className={`text-[15px] font-medium font-inter leading-none ${isSettingsActive ? 'text-white/70' : 'text-[#eeeeee]'}`}>
                            My Transcripts
                        </div>
                    </motion.div>

                    {/* Settings Button */}
                    <motion.div 
                        className="h-7 px-2 py-1.5 rounded-md justify-center items-center gap-2.5 inline-flex cursor-pointer hover:bg-white/5"
                        onClick={handleSettingsClick}
                        {...animationProps}
                    >
                    <div className={`text-[15px] font-medium font-inter leading-none ${!isSettingsActive ? 'text-white/70' : 'text-[#eeeeee]'}`}>
                        Settings
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default MyTranscriptPanel

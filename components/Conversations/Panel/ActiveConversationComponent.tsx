import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversations } from '@/contexts/ConversationContext';
import { useDebouncedCallback } from 'use-debounce';
import SoundIcon from '../Detail/Icon/SoundIcon';
import GreenSoundIcon from '../Detail/Icon/GreenSoundIcon';
import MicrophoneIcon from '../Detail/Icon/MicrophoneIcon';

type AudioState = 'active' | 'inactive' | 'off' | 'noPermissions' | 'saving';

const ACTIVE_LINE_COLOR = 'rgba(76, 237, 160, 1.0)';
const INACTIVE_LINE_COLOR = 'rgba(72, 72, 72, 1)';

export default function ActiveConversationComponent() {
  const [audioState, setAudioState] = useState<AudioState>('inactive');
  const { micActivity, isSaving, isAudioOn, setIsAudioOn, saveCurrentConversation } = useConversations();

  const slowDebounce = useDebouncedCallback(
    () => {
      setAudioState('inactive');
    },
    30000 // 30 seconds debounce for transitioning to inactive
  );

  const fastDebounce = useDebouncedCallback(
    () => {
      setAudioState('active');
    },
    100 // 100ms debounce for transitioning to active
  );

  const saveDebounce = useDebouncedCallback(
    () => {
      saveCurrentConversation();
    },
    60000 // 60 seconds debounce for saving transcript
  );

  const updateAudioState = useCallback(() => {
    if (!isAudioOn) {
      setAudioState('off');
      saveDebounce.cancel();
      return;
    }

    if (isSaving) {
      setAudioState('saving');
      return;
    }

    if (micActivity > 0) {
      fastDebounce();
      saveDebounce.cancel();
    } else {
      slowDebounce();
      saveDebounce();
    }
  }, [isAudioOn, micActivity, isSaving, fastDebounce, slowDebounce, saveDebounce]);

  useEffect(() => {
    updateAudioState();
  }, [updateAudioState]);

  const handleToggle = () => {
    const newIsOn = !isAudioOn;
    setIsAudioOn(newIsOn);
    setAudioState(newIsOn ? (micActivity > 0 ? 'active' : 'inactive') : 'off');
    if (!newIsOn) {
      saveDebounce.cancel();
    }
  };

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848';
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Box 1 */}
      {audioState === 'active' ? (
        <div className="w-full h-14 px-5 py-4 rounded-2xl border border-[#4ceda0]/20 flex flex-col justify-start items-start gap-4">
          <div className="w-full h-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex justify-center items-center">
                  <GreenSoundIcon />
                </div>
                <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">
                  Transcribing Audio...
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[26px] flex justify-end items-center gap-1.5">
                <div className="text-right text-white/40 text-xs font-normal font-['Public Sans'] leading-snug">
                  ON
                </div>
                <div className="w-[49px] h-[26px] relative rounded-2xl">
                  <div className="w-[49px] h-[26px] absolute bg-[#00cc88] rounded-full" />
                  <div className="w-6 h-6 absolute left-[24px] top-[1px] bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded-2xl border border-[#222222] w-full mb-8 gap-2 py-2">
          <div className="flex justify-between items-center px-6 pr-3 py-2 rounded-t-2xl overflow-hidden w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center">
                <SoundIcon color={getSoundIconColor()} />
              </div>
              <div className="text-[#3a3a3a] text-[15px] font-medium font-inter leading-normal">
                {audioState === 'saving' && 'Saving transcript...'}
                {audioState === 'off' && (
                  <span className="text-[#3a3a3a]">
                    Enable Highlight Audio transcriptions
                  </span>
                )}
                {audioState === 'inactive' && (
                  <span className="text-[#3a3a3a]">No active transcription</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Box 2: Microphone Control */}
      {audioState !== 'active' && (
        <div className="flex flex-col rounded-2xl border border-[#222222] w-full mb-8 gap-2 py-2">
          <div className="flex justify-between items-center px-6 pr-3 py-2 rounded-t-2xl overflow-hidden w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center">
                <MicrophoneIcon />
              </div>
              <AnimatePresence mode="wait">
                {isAudioOn ? (
                  <motion.div
                    key="enabled"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.2 }}
                    className="text-[15px] font-medium font-inter leading-normal text-[#eeeeee]"
                  >
                    Microphone Enabled
                  </motion.div>
                ) : (
                  <motion.div
                    key="enable"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.2 }}
                    className="text-[15px] font-medium font-inter leading-normal text-[#b4b4b4]"
                  >
                    Enable Microphone
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggle}
                className="flex items-center gap-1.5 text-xs font-publicsans"
              >
                <motion.div
                  className={`text-right ${
                    isAudioOn ? 'text-[#00cc88]' : 'text-white/40'
                  } text-xs font-normal font-['Public Sans'] leading-snug`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAudioOn ? 'ON' : 'OFF'}
                </motion.div>
                <div className="w-[49px] h-[26px] relative rounded-2xl">
                  <motion.div
                    className={`w-[49px] h-[26px] left-0 top-0 absolute ${
                      isAudioOn ? 'bg-[#00cc88]' : 'bg-black'
                    } rounded-full`}
                    layout
                    transition={{ 
                      type: 'spring', 
                      stiffness: 700, 
                      damping: 30 
                    }}
                  />
                  <motion.div
                    className={`w-6 h-6 absolute ${
                      isAudioOn ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
                    } top-[1px] rounded-full shadow`}
                    layout
                    transition={{ 
                      type: 'tween', 
                      duration: 0.3, 
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Box 3: Enable Audio Transcriptions */}
      <AnimatePresence>
        {!isAudioOn && (
          <motion.button
            onClick={handleToggle}
            className="flex flex-col w-full rounded-xl mb-8 bg-[#00dbfb]/20 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center items-center w-full h-12 rounded-xl">
              <div className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight">
                Enable Audio Transcriptions
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

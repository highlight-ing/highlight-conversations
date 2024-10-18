import React, { useState, useEffect, useCallback } from 'react';
import { useConversations } from '@/contexts/ConversationContext';
import { useDebouncedCallback } from 'use-debounce';
import SoundIcon from '../Detail/Icon/SoundIcon';
import MicrophoneIcon from '../Detail/Icon/MicrophoneIcon';

type AudioState = 'active' | 'inactive' | 'off' | 'noPermissions' | 'saving';

const ACTIVE_LINE_COLOR = 'rgba(76, 237, 160, 1.0)';
const INACTIVE_LINE_COLOR = 'rgba(72, 72, 72, 1)';

export default function ActiveConversationComponent() {
  const [audioState, setAudioState] = useState<AudioState>('inactive');
  const [visualState, setVisualState] = useState<AudioState>('inactive');
  const { micActivity, elapsedTime, isSaving, isAudioOn, setIsAudioOn, saveCurrentConversation } = useConversations();

  const slowDebounce = useDebouncedCallback(
    (newState: AudioState) => {
      setVisualState(newState);
    },
    2500 // 2.5 seconds debounce for visual changes
  );

  const fastDebounce = useDebouncedCallback(
    (newState: AudioState) => {
      setAudioState(newState);
      setVisualState(newState);
    },
    100 // 100ms debounce for going to active
  );

  const updateAudioState = useCallback(() => {
    if (!isAudioOn) {
      setAudioState('off');
      setVisualState('off');
      return;
    }

    if (isSaving) {
      setAudioState('saving');
      setVisualState('saving');
      return;
    }

    if (micActivity > 0) {
      fastDebounce('active');
    } else {
      setAudioState('inactive');
      slowDebounce('inactive');
    }
  }, [isAudioOn, micActivity, isSaving, fastDebounce, slowDebounce]);

  useEffect(() => {
    updateAudioState();
  }, [updateAudioState]);

  const handleToggle = () => {
    const newIsOn = !isAudioOn;
    setIsAudioOn(newIsOn);
    setAudioState(newIsOn ? (micActivity > 0 ? 'active' : 'inactive') : 'off');
  };

  const handleSave = async () => {
    await saveCurrentConversation();
  };

  const formatElapsedTime = (seconds: number): string => {
    if (seconds < 0) {
      return '0s';
    }
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min ${remainingSeconds}s`;
  };

  const getSoundIconColor = () => {
    return audioState === 'active' ? '#4CEDA0' : '#484848';
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Box 1 */}
      {audioState === 'active' ? (
        // New layout when microphone is enabled and audio is active
        <div className="w-full h-14 px-5 py-4 rounded-2xl border border-[#4ceda0]/20 flex flex-col justify-start items-start gap-4">
          <div className="w-full h-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex justify-center items-center">
                  <SoundIcon color={getSoundIconColor()} />
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
        // Existing layout for other audio states
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
              <div
                className={`text-[15px] font-medium font-inter leading-normal ${
                  isAudioOn ? 'text-[#eeeeee]' : 'text-[#b4b4b4]'
                }`}
              >
                {isAudioOn ? 'Microphone Enabled' : 'Enable Microphone'}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggle}
                className="flex items-center gap-1.5 text-xs font-publicsans"
              >
                <div
                  className={`text-right ${
                    isAudioOn ? 'text-[#00cc88]' : 'text-white/40'
                  } text-xs font-normal font-['Public Sans'] leading-snug`}
                >
                  {isAudioOn ? 'ON' : 'OFF'}
                </div>
                <div className="w-[49px] h-[26px] relative rounded-2xl">
                  <div
                    className={`w-[49px] h-[26px] left-0 top-0 absolute ${
                      isAudioOn ? 'bg-[#00cc88]' : 'bg-black'
                    } rounded-full`}
                  />
                  <div
                    className={`w-6 h-6 absolute ${
                      isAudioOn ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
                    } top-[1px] rounded-full shadow`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Box 3: Enable Audio Transcriptions */}
      {!isAudioOn && (
        <button
          onClick={handleToggle}
          className="flex flex-col w-full rounded-xl mb-8 bg-[#00dbfb]/20 gap-2"
        >
          <div className="flex justify-center items-center w-full h-12 rounded-xl">
            <div className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight">
              Enable Audio Transcriptions
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

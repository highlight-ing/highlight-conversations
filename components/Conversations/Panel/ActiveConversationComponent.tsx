import React, { useState, useEffect, useCallback } from 'react';
import AnimatedVoiceSquare from '@/components/ui/icons/AnimatedVoiceSquare';
import { useConversations } from '@/contexts/ConversationContext';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
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
      {/* Box 1: No Audio Detected */}
      <div className="flex flex-col rounded-2xl border border-[#222222] w-full mb-8 gap-2 py-2">
        <div className="flex justify-between items-center px-6 pr-3 py-2 rounded-t-2xl overflow-hidden w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center">
              <SoundIcon color={getSoundIconColor()} />
            </div>
            <div className="text-[#3a3a3a] text-[15px] font-medium font-inter leading-normal">
              {audioState === 'inactive' && 'No Audio Detected'}
              {audioState === 'active' && 'Transcribing...'}
              {audioState === 'saving' && 'Saving transcript...'}
            </div>
          </div>
        </div>
      </div>


      {/* Box 2: Enable Microphone */}
      <div className="flex flex-col rounded-2xl border border-[#222222] w-full mb-8 gap-2 py-2">
        <div className="flex justify-between items-center px-6 pr-3 py-2 rounded-t-2xl overflow-hidden w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center">
              <MicrophoneIcon />
            </div>
            <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-normal">
              Enable Microphone
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleToggle} className="flex items-center gap-1.5 text-xs font-publicsans">
              {/* Toggle status text */}
              <div className={`text-right ${audioState !== 'off' ? 'text-[#00cc88]' : 'text-white/40'} text-xs font-normal font-['Public Sans'] leading-snug`}>
                {audioState !== 'off' ? 'ON' : 'OFF'}
              </div>
              {/* Toggle switch */}
              <div className="w-[49px] h-[26px] relative rounded-2xl">
                {/* Background of the switch */}
                <div className={`w-[49px] h-[26px] left-0 top-0 absolute ${audioState !== 'off' ? 'bg-[#00cc88]' : 'bg-black'} rounded-full`} />
                {/* Circle that moves based on audioState */}
                <div className={`w-6 h-6 absolute ${audioState !== 'off' ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'} top-[1px] rounded-full shadow`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Box 3: Enable Audio Transcriptions */}
      {(audioState === 'off' || audioState === 'inactive') && (
        <div className="flex flex-col w-full rounded-2xl mb-8 bg-[#00dbfb]/20 gap-2">
          <div className="flex justify-center items-center w-full h-12 rounded-xl">
            <div className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight">
              Enable Audio Transcriptions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

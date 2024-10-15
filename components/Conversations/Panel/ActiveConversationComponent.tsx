import React, { useState, useEffect, useCallback } from 'react';
import AnimatedVoiceSquare from '@/components/ui/icons/AnimatedVoiceSquare';
import { useConversations } from '@/contexts/ConversationContext';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import SoundIcon from '../Detail/Icon/SoundIcon';
import MicrophoneIcon from '../Detail/Icon/MicrophoneIcon'

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
    <>
      {/* Box 1: No Audio Detected */}
      <div className="flex flex-col rounded-2xl border mb-8 border-[#222222] gap-px py-2">
        <div className="flex justify-between items-center py-2 px-6 pr-3 rounded-t-2xl overflow-hidden">
          <div className="pr-[222px] justify-start items-center flex">
            <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
              <div className="w-6 h-6 justify-center items-center flex">
                <div className="w-6 h-6 justify-center items-center inline-flex">
                  <SoundIcon color={getSoundIconColor()} />
                </div>
              </div>
              <div className="text-[#3a3a3a] text-[15px] font-medium font-inter leading-normal">
                {audioState === 'inactive' && 'No Audio Detected'}
                {audioState === 'active' && 'Transcribing...'}
                {audioState === 'saving' && 'Saving transcript...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box 2: Enable Microphone */}
      {(audioState === 'off' || audioState === 'inactive') && (
        <div className="flex flex-col rounded-2xl border mb-8 border-[#222222] gap-px py-2">
          <div className="flex justify-between items-center py-2 px-6 pr-3 rounded-t-2xl overflow-hidden">
            <div className="pr-[169px] justify-start items-center flex">
              <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                <div className="w-6 h-6 justify-center items-center flex">
                  <MicrophoneIcon />
                </div>
                <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-normal">
                  Enable Microphone
                </div>
              </div>
            </div>
            <div className="justify-start items-center gap-4 flex">
              <div className="justify-start items-center gap-2 flex">
                <div className="h-[26px] justify-end items-center gap-1.5 flex">
                  <div className="text-right text-white/40 text-xs font-normal font-publicsans leading-snug">
                    OFF
                  </div>
                  <div className="w-[49px] h-[26px] relative rounded-2xl">
                    <div className="w-[49px] h-[26px] left-0 top-0 absolute bg-black rounded-[100px]" />
                    <div className="w-6 h-6 left-[1px] top-[1px] absolute bg-white/40 rounded-2xl shadow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Box 3: Enable Audio Transcriptions - Full Width, Light Blue Background */}
      {(audioState === 'off' || audioState === 'inactive') && (
        <div className="flex flex-col rounded-2xl mb-8 bg-[#00dbfb]/20 gap-px">
          <div className="flex justify-center items-center py-1 px-6 pr-3 rounded-t-2xl overflow-hidden">
            <div className="w-full h-12 px-8 py-2.5 rounded-xl justify-center items-center gap-2 flex">
              <div className="text-[#00e6f5] text-[17px] font-medium font-inter leading-tight">
                Enable Audio Transcriptions
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

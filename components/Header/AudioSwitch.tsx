import React, { useState, useEffect } from "react";
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import InfoTooltip from './InfoTooltip'
import { TOOLTIP_CONTENT } from '@/constants/tooltipConstants'
import { trackEvent } from '@/lib/amplitude'

interface AudioSwitchProps {
    isAudioOn: boolean;
    onSwitch: (isOn: boolean) => void;
  }
  
  const AudioSwitch: React.FC<AudioSwitchProps> = ({ isAudioOn, onSwitch }) => {
    const [isChecked, setIsChecked] = useState(isAudioOn);
  
    useEffect(() => {
      setIsChecked(isAudioOn);
    }, [isAudioOn]);
  
    const handleToggle = () => {
      const newState = !isChecked;
      setIsChecked(newState);
      onSwitch(newState);
      trackEvent('Conversations Interaction', {
        action: 'Microphone Input',
        state: newState ? 'On' : 'Off'
      });
    };
  
    return (
      <div className="flex items-center space-x-2">
        <InfoTooltip type='AUDIO_SWITCH' content={TOOLTIP_CONTENT.AUDIO_SWITCH}>
          <Label className="text-muted-foreground cursor-help" htmlFor="audio-switch">Microphone Input</Label>
        </InfoTooltip>
        <Switch
          checked={isChecked}
          onCheckedChange={handleToggle}
          id="audio-switch"
        />
      </div>
    );
  };
  
  export default AudioSwitch;
import React, { useState, useEffect } from "react";
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

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
    };
  
    return (
      <div className="flex items-center space-x-2">
        <Label className="text-muted-foreground" htmlFor="audio-switch">Microphone Input</Label>
        <Switch
          checked={isChecked}
          onCheckedChange={handleToggle}
          id="audio-switch"
        />
      </div>
    );
  };
  
  export default AudioSwitch;
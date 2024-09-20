import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import InfoTooltip from './InfoTooltip'
import { TOOLTIP_CONTENT } from '@/constants/tooltipConstants'
import { trackEvent } from '@/lib/amplitude'
import { useAudioPermission } from '@/hooks/useAudioPermission'

const AudioSwitch: React.FC = () => {
  const { isAudioPermissionEnabled, toggleAudioPermission } = useAudioPermission()

  const handleToggle = (checked: boolean) => {
    toggleAudioPermission(checked)
    trackEvent('Changed Mic Input', {
      state: checked ? 'On' : 'Off'
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <InfoTooltip type="AUDIO_SWITCH" content={TOOLTIP_CONTENT.AUDIO_SWITCH}>
        <Label className="cursor-help text-muted-foreground" htmlFor="audio-switch">
          Microphone Input
        </Label>
      </InfoTooltip>
      <Switch checked={isAudioPermissionEnabled} onCheckedChange={handleToggle} id="audio-switch" />
    </div>
  )
}

export default AudioSwitch

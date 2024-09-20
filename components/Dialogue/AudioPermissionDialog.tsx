import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoCircle } from 'iconsax-react'
import { setAudioSuperpowerEnabled } from '@/services/highlightService'

interface AudioPermissionDialogProps {
  isAudioPermissionGranted: boolean | null
  onTogglePermission: (enable: boolean) => Promise<void>
}

const AudioPermissionDialog: React.FC<AudioPermissionDialogProps> = ({
  isAudioPermissionGranted,
  onTogglePermission
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAudioPermissionEnabled, setIsAudioPermissionEnabled] = useState(false)

  useEffect(() => {
    if (isAudioPermissionGranted === false) {
      setIsOpen(true)
      setIsAudioPermissionEnabled(false)
    } else if (isAudioPermissionGranted === true) {
      setIsOpen(false)
      setIsAudioPermissionEnabled(true)
    }
  }, [isAudioPermissionGranted])

  const handleAudioPermissionToggle = async (checked: boolean) => {
    await onTogglePermission(checked)
    setIsAudioPermissionEnabled(checked)
    if (checked) {
      setIsOpen(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if the permission is enabled
    if (!open && isAudioPermissionEnabled) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent isAudioPermissionDialog className="p-8 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Grant Permissions</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span>Enable Audio Permission:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle size="20" className="ml-2 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Conversations needs your permission to use your microphone and system audio to create transcripts
                      of your audio. No audio data is stored, and transcripts are generated and stored locally.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch checked={isAudioPermissionEnabled} onCheckedChange={handleAudioPermissionToggle} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AudioPermissionDialog

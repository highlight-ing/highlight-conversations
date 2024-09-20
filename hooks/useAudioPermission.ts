import { useState, useEffect } from 'react'
import { addAudioPermissionListener } from '@/services/highlightService'

export const useAudioPermission = () => {
  const [isAudioPermissionEnabled, setIsAudioPermissionEnabled] = useState<boolean>(false)

  const toggleAudioPermission = async (enable: boolean) => {
    // @ts-ignore
    globalThis.highlight?.internal?.setAudioTranscriptEnabled(enable)
  }

  useEffect(() => {
    const removeListener = addAudioPermissionListener((event: 'locked' | 'detect' | 'attach') => {
      if (event === 'locked') {
        setIsAudioPermissionEnabled(false)
      } else {
        setIsAudioPermissionEnabled(true)
      }
    })

    return () => removeListener()
  }, [])

  return { isAudioPermissionEnabled, toggleAudioPermission }
}

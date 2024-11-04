import { useState } from 'react'
import { TranscriptButtonType, TranscriptButtonConfig, TranscriptButtonStatus } from '@/types/types'
import { useAmplitude } from '@/hooks/useAmplitude'

type UseTranscriptButtonsOptions = {
  message: string
  buttonTypes: TranscriptButtonType[]
}

export const useTranscriptButtons = ({
  message,
  buttonTypes,
}: UseTranscriptButtonsOptions): TranscriptButtonConfig[] => {
  // Initialize button statuses using Object.fromEntries
  // This creates an object with each button type as a key and 'idle' as the initial status
  const [buttonStatuses, setButtonStatuses] = useState<
    Record<TranscriptButtonType, TranscriptButtonStatus>
  >(
    Object.fromEntries(buttonTypes.map((type) => [type, 'idle'])) as Record<
      TranscriptButtonType,
      TranscriptButtonStatus
    >,
  )

  const { trackEvent } = useAmplitude()

  // Update button status and reset to 'idle' after 1 second if status is 'success'
  const updateButtonStatus = (type: TranscriptButtonType, status: TranscriptButtonStatus) => {
    setButtonStatuses((prev) => ({ ...prev, [type]: status }))
    if (status === 'success') {
      setTimeout(() => setButtonStatuses((prev) => ({ ...prev, [type]: 'idle' })), 1000)
    }
  }

  const shareMessage = `${message}\n\nCreated with Highlight`

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareMessage)
      .then(() => {
        updateButtonStatus('Copy', 'success')
        trackEvent('Share Assistant Message Copied', { status: 'success' })
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        trackEvent('Share Assistant Message Copy Error', { error: err.message })
      })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Shared Message',
          text: shareMessage,
          url: window.location.href,
        })
        .then(() => {
          updateButtonStatus('Share', 'success')
          trackEvent('Share Assistant Message Shared', { status: 'success' })
        })
        .catch((error) => {
          console.error('Error sharing:', error)
          trackEvent('Share Assistant Message Share Error', { error: error.message })
        })
    } else {
      console.log('Share functionality not available')
      trackEvent('Share Assistant Message Share Unavailable', {})
    }
  }

  const handleSave = () => {
    try {
      const blob = new Blob([shareMessage], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'saved_message.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      updateButtonStatus('Save', 'success')
      trackEvent('Share Assistant Message Saved', { status: 'success' })
    } catch (error) {
      console.error('Error saving:', error)
      trackEvent('Share Assistant Message Save Error', { error: error })
    }
  }

  const handleSendFeedback = () => {
    setTimeout(() => {
      updateButtonStatus('SendFeedback', 'success')
      trackEvent('Share Assistant Message Feedback Sent', { status: 'success' })
    }, 500)
  }

  // Define button actions for each button type
  const buttonActions: Record<TranscriptButtonType, Pick<TranscriptButtonConfig, 'onClick'>> = {
    Copy: { onClick: handleCopy },
    Share: { onClick: handleShare },
    Save: { onClick: handleSave },
    SendFeedback: { onClick: handleSendFeedback },
  }

  // Create button configurations by mapping over buttonTypes
  const buttons: TranscriptButtonConfig[] = buttonTypes.map((type) => ({
    type,
    onClick: buttonActions[type].onClick,
    status: buttonStatuses[type],
  }))

  return buttons
}

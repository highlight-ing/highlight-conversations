import React from 'react'
import { Copy, Send2, ExportCircle, Flag2 } from 'iconsax-react'
import { TranscriptButtonType, TranscriptButtonStatus } from '@/types/types'

interface TranscriptButtonProps {
  type: TranscriptButtonType
  onClick: () => void
  status: TranscriptButtonStatus
}

const TranscriptButton: React.FC<TranscriptButtonProps> = ({ type, onClick, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'Copy':
        return <Copy variant="Bold" size={16} />
      case 'Share':
        return <Send2 variant="Bold" size={16} />
      case 'Save':
        return <ExportCircle variant="Bold" size={16} />
      case 'SendFeedback':
        return <Flag2 variant="Bold" size={16} />
    }
  }

  const getText = () => {
    if (status === 'success') {
      switch (type) {
        case 'Copy':
          return 'Copied!'
        case 'Share':
          return 'Shared!'
        case 'Save':
          return 'Saved!'
        case 'SendFeedback':
          return 'Sent!'
      }
    }
    return type
  }

  const buttonClass = `group flex items-center transition-colors duration-300 
    ${status === 'success' ? 'animate-gentle-scale' : ''}`

  const iconClass = `text-tertiary transition-colors group-hover:text-green 
    ${status === 'success' ? 'text-green' : ''}`

  const textClass = `ml-2 text-[13px] font-medium text-tertiary transition-colors group-hover:text-green 
    ${status === 'success' ? 'text-green' : ''}`

  return (
    <button onClick={onClick} className={buttonClass}>
      <span className={iconClass}>{getIcon()}</span>
      <span className={textClass}>{getText()}</span>
    </button>
  )
}
export default TranscriptButton

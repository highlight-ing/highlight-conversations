import React from 'react'
import TranscriptButton from './TranscriptButton'
import { TranscriptButtonConfig } from '@/types/types'

interface TranscriptButtonRowProps {
  buttons: TranscriptButtonConfig[]
}

export const TranscriptButtonRow: React.FC<TranscriptButtonRowProps> = ({ buttons }) => {
  return (
    <div className="my-2 mt-4 flex space-x-6">
      {buttons.map((button) => (
        <TranscriptButton key={button.type} type={button.type} onClick={button.onClick} status={button.status} />
      ))}
    </div>
  )
}

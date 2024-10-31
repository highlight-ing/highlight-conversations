import React from 'react'
import Dropdown from './Dropdown'
import { useConversations } from '@/contexts/ConversationContext'

const AsrDurationSelection: React.FC = () => {
  const { asrDuration, setAsrDuration } = useConversations()

  const options = [
    { value: 2, label: '2 hours' },
    { value: 4, label: '4 hours' },
    { value: 8, label: '8 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' }
  ]

  const onSelect = (option: { value: number; label: string }) => {
    try {
      setAsrDuration(option.value)
    } catch (error) {
      console.error('Error setting ASR duration:', error)
    }
  }

  return (
    <Dropdown 
      value={asrDuration} 
      options={options} 
      onSelect={onSelect} 
      style={{ minWidth: '100px' }} 
      size="medium" 
    />
  )
}

export default AsrDurationSelection

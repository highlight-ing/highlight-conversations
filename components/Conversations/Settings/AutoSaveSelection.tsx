import React from 'react'
import Dropdown from './Dropdown'
import { useConversations } from '@/contexts/ConversationContext'

const AutoSaveSelection: React.FC = () => {
  const { autoSaveTime, setAutoSaveTime } = useConversations()

  const options = [
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 180, label: '3 minutes' },
    { value: 240, label: '4 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' }
  ]

  const onSelect = (option: { value: number }) => {
    setAutoSaveTime(option.value)
  }

  return (
    <Dropdown value={autoSaveTime} options={options} onSelect={onSelect} style={{ minWidth: '100px' }} size="medium" />
  )
}

export default AutoSaveSelection

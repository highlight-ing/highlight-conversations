import React from 'react'
import Dropdown from './Dropdown'
import { useConversations } from '@/contexts/ConversationContext'

const AutoClearSelection: React.FC = () => {
  const { autoClearDays, setAutoClearDays } = useConversations()

  const options = [
    { value: 1, label: 'Every Day' },
    { value: 2, label: 'Every 2 Days' },
    { value: 3, label: 'Every 3 Days' },
    { value: 4, label: 'Every 4 Days' },
    { value: 5, label: 'Every 5 Days' },
    { value: 6, label: 'Every 6 Days' },
    { value: 7, label: 'Every Week' },
    { value: 14, label: 'Every 2 Weeks' },
    { value: 21, label: 'Every 3 Weeks' },
    { value: 30, label: 'Every Month' },
    { value: 90, label: 'Every Quarter' },
    { value: 180, label: 'Every 6 Months' },
    { value: 365, label: 'Every Year' }
  ]

  const onSelect = (option: { value: number }) => {
    setAutoClearDays(option.value)
  }

  return (
    <Dropdown value={autoClearDays} options={options} onSelect={onSelect} style={{ minWidth: '100px' }} size="medium" />
  )
}

export default AutoClearSelection

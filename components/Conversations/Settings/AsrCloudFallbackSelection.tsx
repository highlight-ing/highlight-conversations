import React from 'react'
import { useConversations } from '@/contexts/ConversationContext'

const AsrCloudFallbackSelection: React.FC = () => {
  const { asrCloudFallback, setAsrCloudFallback } = useConversations()

  const handleToggle = () => {
    try {
      setAsrCloudFallback(!asrCloudFallback)
    } catch (error) {
      console.error('Error toggling ASR cloud fallback:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleToggle} 
        className="font-publicsans flex items-center gap-1.5 text-xs"
        type="button"
      >
        <div
          className={`text-right ${
            asrCloudFallback ? 'text-[#00cc88]' : 'text-white/40'
          } font-['Public Sans'] text-xs font-normal leading-snug`}
        >
          {asrCloudFallback ? 'ON' : 'OFF'}
        </div>
        <div className="relative h-[26px] w-[49px] rounded-2xl">
          <div
            className={`absolute left-0 top-0 h-[26px] w-[49px] ${
              asrCloudFallback ? 'bg-[#00cc88]' : 'bg-black'
            } rounded-full transition-all duration-500`}
          />
          <div
            className={`absolute h-6 w-6 ${
              asrCloudFallback ? 'left-[24px] bg-white' : 'left-[1px] bg-white/40'
            } top-[1px] rounded-full shadow transition-all duration-500`}
          />
        </div>
      </button>
    </div>
  )
}

export default AsrCloudFallbackSelection
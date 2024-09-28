import React from 'react'
import { Button } from '@/components/ui/button'
import { useConversations } from '@/contexts/ConversationContext'

const FloatingMergeControl: React.FC = () => {
  const { selectedConversations, mergeSelectedConversations } = useConversations()

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 border border-primary bg-green-30/50 backdrop-blur-md shadow-lg rounded-xl p-4 flex items-center justify-between w-[calc(100%-3rem)] max-w-md z-50">
      <p className="text-white font-medium text-[15px] leading-tight">{selectedConversations.length} conversations selected</p>
      <Button 
        onClick={mergeSelectedConversations} 
        disabled={selectedConversations.length < 2}
        className="px-5 h-[26px] text-[13px] text-white bg-white/10 rounded-[6px] leading-tight
                   transition-all duration-300 ease-in-out
                   hover:bg-white/20 hover:scale-105
                   disabled:opacity-50 disabled:hover:bg-white/10 disabled:hover:scale-100
                   [&:disabled]:cursor-not-allowed"
      >
        Merge
      </Button>
    </div>
  )
}

export default FloatingMergeControl
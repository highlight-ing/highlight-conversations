import React from 'react'
import { ConversationData } from '@/data/conversations'

interface ConversationDetailProps {
  conversation: ConversationData | undefined
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation }) => {
  if (!conversation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Select a conversation to view details</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
        <div className="flex items-center justify-between w-[746px] h-[48px] border-b border-black mb-4">
        <h1 className="font-inter text-[13px] font-medium" style={{
          color: 'var(--White, #FFF)',
          lineHeight: 'normal'
        }}>{conversation.title}</h1>
          <div className="flex items-center space-x-4">
          <span className="font-inter text-[13px] font-medium" style={{
            color: 'var(--White, #FFF)',
            lineHeight: 'normal'
          // need to find time for this 
          }}>{conversation.time}</span>
          {/* Add more buttons */}
        </div>
      </div>
      <p className="text-gray-600 mb-4">{conversation.summary}</p>
      <div className="flex flex-col items-start gap-3 p-4 rounded-lg" style={{
        width: '712px',
        background: 'var(--Background-Tertiary, #222)',
        borderRadius: '20px',
        padding: '16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
         <h2 className="font-inter text-[13px] font-medium leading-[20px] tracking-tight" style={{
          color: 'var(--Text-Secondary, #B4B4B4)',
          letterSpacing: '-0.26px'
        }}>Transcript</h2>
        <p className="whitespace-pre-wrap text-primary font-normal text-base leading-7 font-inter" style={{
          alignSelf: 'stretch'
        }}>
          {conversation.transcript}</p>
      </div>
    </div>
  )
}

export default ConversationDetail

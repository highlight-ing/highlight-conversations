import React from 'react'
import { ConversationData, panelFormatDate } from '@/data/conversations'
import ClipboardTextIcon from './Icon/clipboard-text'
import TrashIcon from './Icon/trash'
import FlashIcon from './Icon/flash'

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
    <div className="p-6"
      style={{
        background: 'var(--Background-primary, #0F0F0F)',
        minHeight: '100vh',
      }}
    >
      <div
        className="relative w-[746px] h-[48px] border-b border-black mb-4">
        <h1 className="font-inter text-[13px] font-medium" style={{
          color: 'var(--White, #FFF)',
          lineHeight: 'normal'
        }}>{conversation.title}</h1>
        <div className="flex items-center justify-between">
          <span
            className="font-inter text-[13px] font-medium mt-1"
            style={{
              color: 'var(--White, #FFF)',
              lineHeight: 'normal',
              opacity: 0.3,
            }}
          >
            {panelFormatDate(conversation.startedAt)} - {panelFormatDate(conversation.endedAt)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{conversation.summary}</p>
      <div
        className="flex flex-col items-start gap-3 p-4 rounded-lg"
        style={{
          width: '712px',
          padding: '16px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          borderRadius: '20px',
          background: 'var(--Background-Tertiary, #222)',
          position: 'relative', 
        }}
      >
        <h2
          className="font-inter text-[13px] font-medium leading-[20px] tracking-tight"
          style={{
            color: 'var(--Text-Secondary, #B4B4B4)',
            letterSpacing: '-0.26px',
          }}
        >
          Transcript
        </h2>
        <p
          className="whitespace-pre-wrap text-primary font-normal text-base leading-7 font-inter"
          style={{
            alignSelf: 'stretch',
          }}
        >
          {conversation.transcript}
        </p>
        <div
          className="flex justify-between items-center self-stretch mt-4"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
          }}
        >
          <div
            className="flex items-center gap-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {/* Icons can be added here */}
            <span
              className="font-inter text-[13px] font-medium"
              style={{
                color: 'var(--Text-Subtle, #484848)',
                lineHeight: '20px',
                letterSpacing: '-0.26px',
              }}
            >
              Copy
            </span>
            <span
              className="font-inter text-[13px] font-medium"
              style={{
                color: 'var(--Text-Subtle, #484848)',
                lineHeight: '20px',
                letterSpacing: '-0.26px',
              }}
            >
              Share
            </span>
            <span
              className="font-inter text-[13px] font-medium"
              style={{
                color: 'var(--Text-Subtle, #484848)',
                lineHeight: '20px',
                letterSpacing: '-0.26px',
              }}
            >
              Save
            </span>
          </div>
        </div>
        <span
          className="absolute font-inter text-[13px] font-medium"
          style={{
            color: 'var(--Text-Subtle, #484848)',
            lineHeight: '20px',
            letterSpacing: '-0.26px',
            bottom: '16px', 
            left: '600px',  
          }}
        >
          Send Feedback
        </span>
      </div>
    </div>
  )
}

export default ConversationDetail

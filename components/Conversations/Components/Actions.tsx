import React from 'react'

const Actions: React.FC = () => (
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
)

export default Actions
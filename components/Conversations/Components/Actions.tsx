import React from 'react'

const Actions: React.FC = () => (
  <div
    className="flex justify-between items-center self-stretch mt-4"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: '16px', 
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
      className="font-inter text-[13px] font-medium"
      style={{
        color: 'var(--Text-Subtle, #484848)',
        lineHeight: '20px',
        letterSpacing: '-0.26px',
        position: 'relative', 
        bottom: '0', 
        left: '0', 
      }}
    >
      Send Feedback
    </span>
  </div>
)

export default Actions
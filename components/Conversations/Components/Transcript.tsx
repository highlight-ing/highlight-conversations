import React from 'react'

interface TranscriptProps {
  transcript: string
}

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
  

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => (
  <div
    className="flex flex-col items-start gap-3 p-4 rounded-lg"
    style={{
      maxWidth: '100%',
      padding: '16px',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '12px',
      borderRadius: '20px',
      background: 'var(--Background-Tertiary, #222)',
      position: 'relative',
      overflow: 'auto',
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
      {transcript}
    </p>
    <Actions />
  </div>
)

export default Transcript

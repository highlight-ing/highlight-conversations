import React from 'react'

interface TranscriptProps {
  transcript: string
}

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
  </div>
)

export default Transcript

import React from 'react'
import ShieldTickIcon from '../Icon/ShieldTickIcon'
import CalendarIcon from '../Icon/CalendarIcon'
import VideoPlayIcon from '../Icon/VideoPlayIcon'
import MicrophoneIcon from '../Icon/MicrophoneIcon'
import BigSoundIcon from '../Icon/BigSoundIcon'

const TranscriptionDisabled: React.FC = () => (
  <div className="relative flex flex-col space-y-8 px-6 py-12 md:px-16 lg:px-20 max-w-4xl mx-auto">
    {/* Header Section */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center">
        <BigSoundIcon />
      </div>
      <h1 className="text-white text-2xl font-semibold font-inter leading-[31px]">
        Highlight Audio Transcription
      </h1>
    </div>
    <p className="text-[#484848] text-[15px] font-normal font-inter leading-normal max-w-[39rem]">
      Highlight only captures audio for text-to-speech transcription
    </p>

    {/* Feature Boxes */}
    <FeatureBox
      icon={<ShieldTickIcon />}
      title="Local first and totally private to you"
      description={
        <ul className="list-disc pl-6 space-y-2">
          <li>No audio is captured or stored anywhere</li>
          <li>All transcriptions happen on your computer and cannot be seen or accessed by anyone</li>
          <li>No data is passed to AIs unless you attach them to a chat</li>
        </ul>
      }
    />

    <FeatureBox
      icon={<CalendarIcon />}
      title="Automatically capture meeting notes"
      description="Highlight automatically detects when your meetings are happening and gets you automatic meeting notes that are totally private to you by default and shareable with a click."
    />

    <FeatureBox
      icon={<VideoPlayIcon />}
      title="Transcribe podcasts and YouTube videos"
      description="With audio transcription enabled, Highlight will automatically capture and transcribe anything you’re listening to so you can chat with it using Highlight AI."
    />

    <FeatureBox
      icon={<MicrophoneIcon />}
      title="Capture lecture notes and voice notes"
      description="Capture your microphone audio to capture lecture notes, in-person conversations, and voice notes that you can instantly chat with and format with Highlight AI."
    />
  </div>
)

interface FeatureBoxProps {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => (
  <div className="flex flex-col space-y-4 p-5 rounded-[22px] border border-[#222222]/50">
    <div className="flex items-center gap-4">
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">
        {title}
      </h2>
    </div>
    <div className="text-[#6e6e6e] text-[15px] font-normal font-inter leading-normal">
      {description}
    </div>
  </div>
)

export default TranscriptionDisabled

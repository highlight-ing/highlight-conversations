import React from 'react'
import ShieldTickIcon from '../Icon/DetailIcons/TranscriptionDisabled/ShieldTickIcon'
import CalendarIcon from '../Icon/DetailIcons/TranscriptionDisabled/CalendarIcon'
import VideoPlayIcon from '../Icon/DetailIcons/TranscriptionDisabled/VideoPlayIcon'
import MicrophoneIcon from '../Icon/DetailIcons/TranscriptionDisabled/MicrophoneIcon'
import BigSoundIcon from '../Icon/DetailIcons/NoAudioDetected/BigSoundIcon'

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => (
  <div className="flex flex-col space-y-4 rounded-[22px] border border-[#222222]/50 p-5">
    <div className="flex items-center gap-4">
      <div className="flex h-6 w-6 items-center justify-center">
        {icon}
      </div>
      <h2 className="font-inter text-[15px] font-medium leading-normal text-[#eeeeee]">
        {title}
      </h2>
    </div>
    <div className="font-inter text-[15px] font-normal leading-normal text-[#6e6e6e]">
      {description}
    </div>
  </div>
);

const FEATURE_DATA = [
  {
    icon: <ShieldTickIcon />,
    title: "Local first and totally private to you",
    description: (
      <ul className="list-disc space-y-2 pl-6">
        <li>No audio is captured or stored anywhere</li>
        <li>All transcriptions happen on your computer and cannot be seen or accessed by anyone</li>
        <li>No data is passed to AIs unless you attach them to a chat</li>
      </ul>
    )
  },
  {
    icon: <CalendarIcon />,
    title: "Automatically capture meeting notes",
    description: "Highlight automatically detects when your meetings are happening and gets you automatic meeting notes that are totally private to you by default and shareable with a click."
  },
  {
    icon: <VideoPlayIcon />,
    title: "Transcribe podcasts and YouTube videos",
    description: "With audio transcription enabled, Highlight will automatically capture and transcribe anything you're listening to so you can chat with it using Highlight AI."
  },
  {
    icon: <MicrophoneIcon />,
    title: "Capture lecture notes and voice notes",
    description: "Capture your microphone audio to capture lecture notes, in-person conversations, and voice notes that you can instantly chat with and format with Highlight AI."
  }
];

const TranscriptionDisabled: React.FC = () => (
  <div className="relative mx-auto max-w-4xl flex flex-col space-y-8 px-6 py-12 md:px-16 lg:px-20">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center">
        <BigSoundIcon />
      </div>
      <h1 className="font-inter text-2xl font-semibold leading-[31px] text-white">
        Highlight Audio Transcription
      </h1>
    </div>

    <p className="font-inter text-[15px] font-normal leading-normal text-[#484848] max-w-[39rem]">
      Highlight only captures audio for text-to-speech transcription
    </p>

    {FEATURE_DATA.map((feature, index) => (
      <FeatureBox
        key={index}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </div>
);

export default TranscriptionDisabled;
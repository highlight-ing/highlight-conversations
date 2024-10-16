import React from 'react'

const NoAudioDetected: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full p-6">
    <h2 className="text-2xl font-semibold text-gray-400 mb-4">
      No Audio Detected
    </h2>
    <p className="text-gray-500 text-center">
      We couldn't detect any audio. Please speak into the microphone.
    </p>
  </div>
);

export default NoAudioDetected;

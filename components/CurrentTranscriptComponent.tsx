import React, { useState, useEffect } from 'react';
import { fetchMicActivity } from '../services/audioService';
import MicActivityAnimation from './MicActivityAnimation';

type CurrentTranscriptComponentProps = {
  transcript: string;
  isWaiting: boolean;
};

const CurrentTranscriptComponent: React.FC<CurrentTranscriptComponentProps> = ({ transcript, isWaiting }) => {
  const [micActivity, setMicActivity] = useState<number>(0);
  useEffect(() => {
    const pollMicActivity = async () => {
      const activity = await fetchMicActivity();
      setMicActivity(activity);
    };

    const intervalId = setInterval(pollMicActivity, 100); // Poll every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return (
    <div className="current-transcript p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <MicActivityAnimation micActivity={micActivity} />

      <h2 className="text-xl font-bold mb-2 flex items-center">
        Current Transcription ({micActivity})
      </h2>
      <div className="transcript-content mb-4 h-64 overflow-y-auto p-2 border border-gray-700 rounded-lg bg-gray-800">
        {transcript.split('\n').map((line, index) => (
          <p key={index} className="text-sm">
            {line}
          </p>
        ))}
      </div>
      {isWaiting ? (
        <div className="waiting-indicator flex items-center">
          <svg
            className="animate-spin mr-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-400">Waiting for the next batch...</span>
        </div>
      ) : (
        <div className="text-green-400">Receiving audio data...</div>
      )}
    </div>
  );
};

export default CurrentTranscriptComponent;
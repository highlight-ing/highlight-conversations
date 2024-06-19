import React, { useState, useEffect } from "react";
import { fetchMicActivity } from "../services/audioService";
import AnimatedAudioEnergy from "./AnimatedAudioEnergy";

type CurrentTranscriptComponentProps = {
  transcript: string;
  isWaiting: boolean;
};

const CurrentTranscriptComponent: React.FC<CurrentTranscriptComponentProps> = ({
  transcript,
  isWaiting,
}) => {
  const [micActivity, setMicActivity] = useState<number>(0);
  useEffect(() => {
    const pollMicActivity = async () => {
      const activity = await fetchMicActivity();
      setMicActivity(activity);
    };

    const intervalId = setInterval(pollMicActivity, 100); // Poll every 100 ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return (
    <div className="current-transcript rounded-lg p-4 shadow-md">
      <div className="justify-left flex items-center">
        <h2 className="mb-2 flex items-center text-xl font-bold">
          Current Transcription ({micActivity})
        </h2>
        <div className="">
          <AnimatedAudioEnergy maxHeight={20} micActivity={micActivity} />
        </div>
      </div>
      <div className="transcript-content mb-4 h-64 overflow-y-auto rounded-lg border border-gray-700 p-2">
        {transcript.split("\n").map((line, index) => (
          <p key={index} className="text-sm">
            {line}
          </p>
        ))}
      </div>
      {isWaiting ? (
        <div className="waiting-indicator flex items-center">
          <svg
            className="mr-2 h-5 w-5 animate-spin text-gray-400"
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
        <div className="text-brand">Receiving audio data...</div>
      )}
    </div>
  );
};

export default CurrentTranscriptComponent;

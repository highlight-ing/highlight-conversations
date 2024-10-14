import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-5">
      <h2 className="text-white text-xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <div className="text-gray-300">Auto Save</div>
          <div className="text-gray-400">After 2 Minutes</div>
        </div>
        <div>
          <div className="text-gray-300">Auto Clear</div>
          <div className="text-gray-400">Every 2 Weeks</div>
        </div>
        <div>
          <div className="text-gray-300">Audio Transcript Duration</div>
          <div className="text-gray-400">8 Hours</div>
        </div>
        <div>
          <div className="text-gray-300">Cloud Transcript</div>
          <div className="text-green-400">ON</div>
        </div>
        <button className="text-red-500">Delete All Transcripts</button>
      </div>
    </div>
  );
};

export default SettingsPage;

import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getAudioSuperPowerEnabled, setAudioSuperpowerEnabled, addAudioPermissionListener } from '@/services/highlightService';

type PermissionsScreenProps = {
  onPermissionGranted: () => void;
};

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onPermissionGranted }) => {
  const [isPermissionEnabled, setIsPermissionEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkPermission = async () => {
      const enabled = await getAudioSuperPowerEnabled();
      setIsPermissionEnabled(enabled);
    };

    checkPermission();

    const removeListener = addAudioPermissionListener((event: 'locked' | 'detect' | 'attach') => {
      const newPermissionState = event === 'attach';
      setIsPermissionEnabled(newPermissionState);
      if (newPermissionState) {
        onPermissionGranted();
      }
    });

    // return () => removeListener();
  }, [onPermissionGranted]);

  const handleEnablePermission = async () => {
    await setAudioSuperpowerEnabled(true);
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Enable Audio Permission</h2>
      <p className="text-lg mb-8 text-foreground-muted">
        Conversations needs access to your audio to function. Please enable the audio permission.
      </p>
      <Button 
        onClick={handleEnablePermission} 
        disabled={isPermissionEnabled}
        className="w-full max-w-md bg-brand text-background mb-4"
      >
        {isPermissionEnabled ? 'Permission Granted' : 'Enable Audio Permission'}
      </Button>
      {isPermissionEnabled && (
        <Button onClick={onPermissionGranted} className="w-full max-w-md">
          Next
        </Button>
      )}
    </div>
  );
};

export default PermissionsScreen
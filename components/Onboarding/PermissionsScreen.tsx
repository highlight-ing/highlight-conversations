import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getAudioSuperPowerEnabled, setAudioSuperpowerEnabled, addAudioPermissionListener } from '@/services/highlightService';
import OnboardingTemplate, { GradientTexts } from './OnboardingTemplate';
import { Lock1, Unlock } from "iconsax-react";
import { motion } from 'framer-motion';

type PermissionsScreenProps = {
  onPermissionGranted: () => void;
};

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onPermissionGranted }) => {
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const enabled = await getAudioSuperPowerEnabled();
      setIsPermissionEnabled(enabled);
    };

    checkPermission();

    const removeListener = addAudioPermissionListener((event: 'locked' | 'detect' | 'attach') => {
      const newPermissionState = event === 'attach';
      setIsPermissionEnabled(newPermissionState);
      if (newPermissionState) {
        setIsAnimating(true);
      }
    });

    // return () => removeListener();
  }, []);

  const handleButtonClick = async () => {
    if (!isPermissionEnabled) {
      await setAudioSuperpowerEnabled(true);
    } else {
      onPermissionGranted();
    }
  };

  const gradientTexts: GradientTexts = {
    topLeft: "I'll summarize the daily routine",
    topRight: "Can you put that in a Github Issue?",
    bottomLeft: "My dream was so complex",
    bottomRight: "David please make reservations for Tuesday."
  };

  return (
    <OnboardingTemplate 
      gradientTexts={gradientTexts}
      cardClassName={`
        ${isPermissionEnabled ? 'border-brand' :'border-destructive'} 
        ${isPermissionEnabled ? 'bg-background/50' : 'bg-destructive/10'}
        `}
    >
      <motion.div
        initial={false}
        animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <div className="flex items-center justify-center mb-4">
          {isPermissionEnabled ? (
            <Unlock className="text-brand mr-2" size="32" />
          ) : (
            <Lock1 className="text-destructive mr-2" size="32" />
          )}
          <h2 className="text-3xl font-bold text-center">
            {isPermissionEnabled ? "Permissions Enabled" : "Grant Audio Permission"}
          </h2>
        </div>
        <p className="text-xl mt-4 mb-4 text-foreground-muted text-center font-regular leading-relaxed">
          {isPermissionEnabled 
            ? "Conversations is ready to use 🎉"
            : "To use Conversations, you need to enable Audio Transcript permissions for Highlight"}
        </p>
        <Button 
          onClick={handleButtonClick}
          className={`w-full font-semibold text-md p-4 mt-4 mb-4 ${isPermissionEnabled ? 'bg-brand text-background' : 'bg-foreground text-background'}`}
        >
          {isPermissionEnabled ? 'Continue' : 'Enable Audio Permission'}
        </Button>
      </motion.div>
    </OnboardingTemplate>
  );
};

export default PermissionsScreen;
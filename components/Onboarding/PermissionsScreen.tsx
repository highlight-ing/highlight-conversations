import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAudioSuperpowerEnabled, setAudioSuperpowerEnabled, addAudioPermissionListener, requestBackgroundPermission } from '@/services/highlightService';
import OnboardingTemplate, { GradientTexts } from './OnboardingTemplate';
import { Lock1, Unlock, InfoCircle } from "iconsax-react";
import { motion, AnimatePresence } from 'framer-motion';

type PermissionsScreenProps = {
  onPermissionGranted: () => void;
};

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onPermissionGranted }) => {
  const [isAudioPermissionEnabled, setIsAudioPermissionEnabled] = useState(false);
  const [isBackgroundPermissionEnabled, setIsBackgroundPermissionEnabled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const areBothPermissionsEnabled = isAudioPermissionEnabled && isBackgroundPermissionEnabled;

  const checkIfBothPermissionsEnabled = useCallback(() => {
    if (isAudioPermissionEnabled && isBackgroundPermissionEnabled) {
      setIsAnimating(true);
    }
  }, [isAudioPermissionEnabled, isBackgroundPermissionEnabled]);

  useEffect(() => {
    checkIfBothPermissionsEnabled();
  }, [isAudioPermissionEnabled, isBackgroundPermissionEnabled, checkIfBothPermissionsEnabled]);

  useEffect(() => {
    const checkAudioPermission = async () => {
      const audioEnabled = await getAudioSuperpowerEnabled();
      setIsAudioPermissionEnabled(audioEnabled);
    };

    checkAudioPermission();

    const removeListener = addAudioPermissionListener((event: 'locked' | 'detect' | 'attach') => {
      const newPermissionState = ['detect', 'attach'].includes(event);
      setIsAudioPermissionEnabled(newPermissionState);
    });

    // return () => removeListener();
  }, []);

  const handleAudioPermissionToggle = async (checked: boolean) => {
    await setAudioSuperpowerEnabled(checked);
    setIsAudioPermissionEnabled(checked);
  };

  const handleBackgroundPermissionToggle = async (checked: boolean) => {
    if (checked) {
      const isGranted = await requestBackgroundPermission();
      setIsBackgroundPermissionEnabled(isGranted ?? false);
    } else {
      setIsBackgroundPermissionEnabled(false);
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
        ${areBothPermissionsEnabled ? 'border-brand bg-background/50' : 'border-border bg-background'}
      `}
    >
      <motion.div
        initial={false}
        animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setIsAnimating(false)}
        className="w-full max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">
            {areBothPermissionsEnabled ? "Permissions Granted" : "Grant Permissions"}
          </h2>
          {areBothPermissionsEnabled ? (
            <Unlock className="text-brand" size="32" />
          ) : (
            <Lock1 className="text-muted-foreground" size="32" />
          )}
        </div>
        <p className="text-[16px] mt-2 mb-6 text-foreground-muted font-medium leading-relaxed">
          {areBothPermissionsEnabled
            ? "Conversations is ready to use 🎉"
            : "Enable Audio and Background permissions for Highlight"
          }
        </p>
        <div className="space-y-4 mb-8 text-foreground/75">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Enable Audio Permission:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle size="20" className="ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Conversations needs your permission to use your microphone and system audio to create transcripts of your audio. No audio data is stored, and transcripts are generated and stored locally.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              checked={isAudioPermissionEnabled}
              onCheckedChange={handleAudioPermissionToggle}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Enable Background Permission:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle size="20" className="ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Conversations needs your permission to run in the background. This allows Conversations to ambiently record your impromptu conversations and provide real-time insights without manual activation.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              checked={isBackgroundPermissionEnabled}
              onCheckedChange={handleBackgroundPermissionToggle}
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={areBothPermissionsEnabled ? 'enabled' : 'disabled'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={onPermissionGranted}
              className={`w-full font-semibold text-md p-4 ${
                areBothPermissionsEnabled 
                  ? 'bg-brand text-background' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!areBothPermissionsEnabled}
            >
              Continue
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </OnboardingTemplate>
  );
};

export default PermissionsScreen;

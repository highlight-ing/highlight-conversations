import React from 'react';
import { Button } from "@/components/ui/button";
import OnboardingTemplate, { GradientTexts } from './OnboardingTemplate';

type WelcomeScreenProps = {
  onNext: () => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
    const gradientTexts: GradientTexts = {
        topLeft: "I'll summarize the daily routine",
        topRight: "Can you put that in a Github Issue?",
        bottomLeft: "My dream was so complex",
        bottomRight: "David please make reservations for Tuesday."
      };
  return (
    <OnboardingTemplate gradientTexts={gradientTexts}>
      <h1 className="text-4xl font-bold p-4 text-center">Welcome to Conversations</h1>
      <p className="text-xl mt-4 mb-4 text-foreground-muted text-left font-regular leading-relaxed">
        Continuously records your microphone input and system audio, 
        generating transcripts every 30 seconds.<br /><br /> All data is processed 
        locally for your privacy.
      </p>
      <Button onClick={onNext} className="w-full bg-brand text-background font-semibold text-md p-4 mt-4">
        Get Started
      </Button>
    </OnboardingTemplate>
  );
};

export default WelcomeScreen;
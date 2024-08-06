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
      <h1 className="text-3xl font-bold p-4 text-center">Transcribe meetings and calls automatically and securely</h1>
      <p className="text-xl mt-4 mb-4 text-foreground-muted text-center font-regular leading-relaxed">
      All your data is completely private and can never leave
      your computer without your explicit permission
      </p>
      <Button onClick={onNext} className="w-full bg-brand text-background font-semibold text-md p-4 mt-4">
        Get Started
      </Button>
    </OnboardingTemplate>
  );
};

export default WelcomeScreen;
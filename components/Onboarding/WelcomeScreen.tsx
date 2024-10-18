import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import OnboardingTemplate, { GradientTexts } from './OnboardingTemplate';
import { useAmplitude } from '@/hooks/useAmplitude';

type WelcomeScreenProps = {
  onNext: () => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
    const { trackEvent } = useAmplitude()
    const gradientTexts: GradientTexts = {
        topLeft: "I'll summarize the daily routine",
        topRight: "Can you put that in a Github Issue?",
        bottomLeft: "My dream was so complex",
        bottomRight: "David please make reservations for Tuesday."
      };
      // Track event on mount
      useEffect(() => {
        trackEvent('Onboarding: Started Onboarding Flow', {});
      }, [trackEvent]);
  return (
    <OnboardingTemplate gradientTexts={gradientTexts}>
      <h1 className="text-3xl font-bold p-4 text-center">Transcribe meetings and calls automatically and securely</h1>
      <p className="text-xl mt-4 mb-4 text-foreground-muted text-center font-regular leading-relaxed">
      All your data is completely private and can never leave
      your computer without your explicit permission
      </p>
      <Button 
        onClick={onNext} 
        className="w-full font-semibold text-md p-4 mt-4"
        style={{
          backgroundColor: 'rgb(74, 237, 158)',
          color: 'black', 
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(250, 250, 250, 0.9)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(74, 237, 158)'}
      >
        Get Started
      </Button>
    </OnboardingTemplate>
  );
};

export default WelcomeScreen;
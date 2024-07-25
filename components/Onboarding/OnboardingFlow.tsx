import React from 'react';
import WelcomeScreen from './WelcomeScreen';
import PermissionsScreen from './PermissionsScreen';
import ExplanationScreen from './ExplanationScreen';
import FinalScreen from './FinalScreen';

type OnboardingFlowProps = {
    onComplete: (dontShowAgain: boolean) => void;
};

const OnboardingFlow: React.FC<OnboardingFlowProps> = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [audioPermissionEnabled, setAudioPermissionEnabled] = React.useState(false);

  const steps = [
    <WelcomeScreen key="welcome" onNext={() => setCurrentStep(1)} />,
    <PermissionsScreen 
      key="permissions"
      onPermissionGranted={() => {
        setAudioPermissionEnabled(false);
        setCurrentStep(2);
      }} 
    />,
    <ExplanationScreen key="explanation" onNext={() => setCurrentStep(3)} />,
    <FinalScreen key="final" onComplete={(dontShowAgain: boolean) => {
      // Handle completion logic here
      console.log('Onboarding completed, don\'t show again:', dontShowAgain);
    }} />
  ];

  return (
    <div className="bg-background text-foreground">
      {steps[currentStep]}
    </div>
  );
};

export default OnboardingFlow
import React from 'react';
import WelcomeScreen from './WelcomeScreen';
import PermissionsScreen from './PermissionsScreen';

type OnboardingFlowProps = {
    onComplete: () => void;
};

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    <WelcomeScreen key="welcome" onNext={() => setCurrentStep(1)} />,
    <PermissionsScreen
      key="permissions"
      onPermissionGranted={() => {
        console.log('onPermissionGranted callback')
        onComplete();
      }}
    />
  ];

  return (
    <div className="bg-background text-foreground h-screen overflow-hidden">
      {steps[currentStep]}
    </div>
  );
};

export default OnboardingFlow;
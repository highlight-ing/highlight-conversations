  import React, { useEffect, useCallback } from 'react';
  import WelcomeScreen from './WelcomeScreen';
  import PermissionsScreen from './PermissionsScreen';
  import { useAmplitude } from '@/hooks/useAmplitude'

  type OnboardingFlowProps = {
      onComplete: () => void;
  };

  const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const { trackEvent } = useAmplitude()
    const handleNext = useCallback(() => {
      setCurrentStep(1);
      trackEvent('Onboarding: Moved to Permissions Screen', {});
    }, [trackEvent])

    const handleOnPermissionGranted = useCallback(() => {
      trackEvent('Onboarding: Permission Granted Moved to Main App', {});
      onComplete();
    }, [onComplete, trackEvent])

    const steps = [
      <WelcomeScreen key="welcome" onNext={handleNext} />,
      <PermissionsScreen
        key="permissions"
        onPermissionGranted={handleOnPermissionGranted}
      />
    ];

    return (
      <div className="bg-background text-foreground h-screen overflow-hidden">
        {steps[currentStep]}
      </div>
    );
  };

  export default OnboardingFlow;
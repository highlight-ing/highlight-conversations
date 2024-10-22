import React, { useCallback } from 'react'
import WelcomeScreen from './WelcomeScreen'
import { useAmplitude } from '@/hooks/useAmplitude'

type OnboardingFlowProps = {
  onComplete: () => void
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const { trackEvent } = useAmplitude()
  const handleNext = useCallback(() => {
    setCurrentStep(1)
    trackEvent('Onboarding: Get Started Moved to Main App', {})
    onComplete()
  }, [trackEvent])

  const steps = [<WelcomeScreen key="welcome" onNext={handleNext} />]

  return <div className="h-screen overflow-hidden bg-background text-foreground">{steps[currentStep]}</div>
}

export default OnboardingFlow

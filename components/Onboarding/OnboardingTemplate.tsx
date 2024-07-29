// components/OnboardingTemplate.tsx
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Waveform from './Waveform';
import GradientText from './GradientText';

export interface GradientTexts {
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
  }

type OnboardingTemplateProps = {
  children: ReactNode
  gradientTexts: GradientTexts
  cardClassName?: string
};

const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({ children, gradientTexts, cardClassName = '' }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Waveform className="absolute inset-0 z-0 opacity-70 blur-md" />
      
      <Card className={`relative z-10 w-full max-w-[600px] backdrop-filter backdrop-blur bg-opacity-0 ${cardClassName}`}>
        <CardContent className="flex flex-col items-center p-8">
          {children}
        </CardContent>
      </Card>

      <div className="absolute top-8 bottom-8 left-0 right-0 flex justify-between px-8">
        <GradientText text={gradientTexts.topLeft} className="text-left" direction="left-right" />
        <GradientText text={gradientTexts.topRight} className="text-right" direction="right-left" />
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8">
        <GradientText text={gradientTexts.bottomLeft} className="text-left" direction="left-right" />
        <GradientText text={gradientTexts.bottomRight} className="text-right" direction="right-left" />
      </div>
    </div>
  );
};

export default OnboardingTemplate;
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Waveform from './Waveform';
import GradientText from './GradientText';

type WelcomeScreenProps = {
    onNext: () => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Waveform className="absolute inset-0 z-0 opacity-70 blur-md" />
      
      <Card className="relative z-10 w-full max-w-[600px] backdrop-filter backdrop-blur bg-opacity-30">
        <CardContent className="flex flex-col items-center p-8">
          <h1 className="text-4xl font-bold p-4 text-center">Welcome to Conversations</h1>
          <p className="text-xl p-4 text-foreground-muted text-left font-regular leading-relaxed">
            Continuously records your microphone input and system audio, 
            generating transcripts every 30 seconds. All data is processed 
            locally for your privacy.
          </p>
          <Button onClick={onNext} className="w-full bg-brand text-background font-semibold text-md p-4 mt-4">
            Get Started
          </Button>
        </CardContent>
      </Card>

      <div className="absolute top-8 bottom-8 left-0 right-0 flex justify-between px-8">
        <GradientText text="I'll summarize the daily routine" className="text-left" />
        <GradientText text="Can you put that in a Github Issue?" className="text-right" />
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8">
        <GradientText text="My dream was so complex" className="text-left" />
        <GradientText text="David please make reservations for Tuesday." className="text-right" />
      </div>
    </div>
  );
};

export default WelcomeScreen;
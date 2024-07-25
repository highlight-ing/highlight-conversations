import React from 'react';
import { Button } from "@/components/ui/button";

type WelcomeScreenProps = {
    onNext: () => void;
};
  
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => { return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Conversations</h1>
        <p className="text-lg mb-8 text-foreground-muted">
        Conversations continuously records your microphone input and system audio, 
        generating transcripts every 30 seconds. All data is processed locally for your privacy.
        </p>
        <Button onClick={onNext} className="w-full max-w-md bg-brand text-background">
        Get Started
        </Button>
    </div>
    );
};

export default WelcomeScreen
  
import React from 'react'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type FinalScreenProps = {
    onComplete: (dontShowAgain: boolean) => void;
};

export const FinalScreen: React.FC<FinalScreenProps> = ({ onComplete }) => {
    const [dontShowAgain, setDontShowAgain] = React.useState(false);
  
    const handleComplete = () => {
      onComplete(dontShowAgain);
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Start</h2>
      <p className="text-lg mb-8 text-foreground-muted">
        You&apos;re all set to use Conversations. Start recording and transcribing your audio now!
      </p>
      <Button onClick={handleComplete} className="w-full max-w-md bg-brand text-background mb-4">
        Start Conversation
      </Button>
      <div className="flex items-center space-x-2 justify-center mt-4">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <label htmlFor="dontShowAgain" className="text-sm font-medium">
            Don&apos;t show this again
          </label>
        </div>
    </div>
  );
};

export default FinalScreen;
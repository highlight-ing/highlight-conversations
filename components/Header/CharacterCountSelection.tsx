import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from '@/components/ui/label';

interface CharacterCountSelectionProps {
  value: number;
  onCharacterCountChange: (value: number) => void;
}

const CharacterCountSelection: React.FC<CharacterCountSelectionProps> = ({
  value,
  onCharacterCountChange,
}) => {
  const handleSliderChange = (newValue: number[]) => {
    onCharacterCountChange(newValue[0]);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="characterCount">Character Count</Label>
        <span>{value}</span>
      </div>
      <Slider
        id="characterCount"
        value={[value]}
        onValueChange={handleSliderChange}
        min={400}
        max={5000}
        step={200}
        className="w-full"
      />
    </div>
  );
};

export default CharacterCountSelection;
// components/AutoClearSelection.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AutoClearSelectionProps {
  value: number;
  onChange: (value: number) => void;
}

const AutoClearSelection: React.FC<AutoClearSelectionProps> = ({
  value,
  onChange,
}) => {
  const options = Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  return (
    <div>
      <div className="flex flex-row items-center px-4">
        <label className="mr-2" htmlFor="autoClearSelection">Auto Clear Conversations every:</label>
        <Select
          onValueChange={(selectedValue) => onChange(parseInt(selectedValue))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="7" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  <SelectLabel>{option.label}</SelectLabel>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AutoClearSelection;

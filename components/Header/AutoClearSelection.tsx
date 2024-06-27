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
    label: `${i + 1} days`,
    value: i + 1,
  }))

  return (
    <div>
      <div className="flex flex-row items-center px-4">
        <label className="mr-2" htmlFor="autoClearSelection">Auto Clear Conversations every:</label>
        <Select
          onValueChange={(selectedValue) => onChange(parseInt(selectedValue))}
          value={value.toString()}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default AutoClearSelection;

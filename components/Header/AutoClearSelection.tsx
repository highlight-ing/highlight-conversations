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
import { Label } from '@/components/ui/label'

interface AutoClearSelectionProps {
  value: number;
  onChange: (value: number) => void;
}

const AutoClearSelection: React.FC<AutoClearSelectionProps> = ({
  value,
  onChange,
}) => {
  const options = [
    { value: 1, label: "Every Day" },
    { value: 2, label: "Every 2 Days" },
    { value: 3, label: "Every 3 Days" },
    { value: 4, label: "Every 4 Days" },
    { value: 5, label: "Every 5 Days" },
    { value: 6, label: "Every 6 Days" },
    { value: 7, label: "Every Week" },
    { value: 14, label: "Every 2 Weeks" },
    { value: 21, label: "Every 3 Weeks" },
    { value: 30, label: "Every Month" },
    { value: 90, label: "Every Quarter" },
    { value: 180, label: "Every 6 Months" },
    { value: 365, label: "Every Year" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center px-4">
        <Label className="mr-2 text-muted-foreground" htmlFor="autoClearSelection">Auto Clear</Label>
        <Select
          onValueChange={(selectedValue) => onChange(parseInt(selectedValue))}
          value={value.toString()}
        >
          <SelectTrigger className="w-[150px]">
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

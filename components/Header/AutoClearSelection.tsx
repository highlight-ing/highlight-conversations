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

const getAutoClearLabel = (days: number): string => {
  switch (days) {
    case 1:
      return "day";
    case 7:
      return "week";
    case 14:
      return "2 weeks";
    case 21:
      return "3 weeks";
    case 30:
      return "month";
    default:
      return `${days} days`;
  }
};

const AutoClearSelection: React.FC<AutoClearSelectionProps> = ({
  value,
  onChange,
}) => {
  const options = [
    { value: 1, label: "Day" },
    { value: 2, label: "2 Days" },
    { value: 3, label: "3 Days" },
    { value: 4, label: "4 Days" },
    { value: 5, label: "5 Days" },
    { value: 6, label: "6 Days" },
    { value: 7, label: "Week" },
    { value: 14, label: "2 Weeks" },
    { value: 21, label: "3 Weeks" },
    { value: 30, label: "Month" },
  ];

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

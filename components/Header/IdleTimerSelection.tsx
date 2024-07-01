// components/IdleTimerSelection.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label'

interface IdleTimerSelectionProps {
  value: number;
  onIdleTimerChange: (value: number) => void;
}

const IdleTimerSelection: React.FC<IdleTimerSelectionProps> = ({
  value,
  onIdleTimerChange,
}) => {
  const options = [
    { value: 10, label: "10 seconds" },
    { value: 15, label: "15 seconds" },
    { value: 20, label: "20 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 45, label: "45 seconds" },
    { value: 60, label: "60 seconds" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center px-4">
        <Label className="mr-2 text-muted-foreground" htmlFor="idleTimerSelection">Idle Timer</Label>
        <Select
          onValueChange={(selectedValue) => onIdleTimerChange(parseInt(selectedValue))}
          value={value?.toString() ?? ''}
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

export default IdleTimerSelection;
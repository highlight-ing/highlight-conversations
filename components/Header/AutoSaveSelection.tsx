// components/AutoSaveSelection.tsx
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
import InfoTooltip from './InfoTooltip'
import { TOOLTIP_CONTENT } from '@/constants/tooltipConstants'

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
    { value: 20, label: "20 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 45, label: "45 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center px-4">
        <Label className="mr-2 text-muted-foreground" htmlFor="idleTimerSelection">Auto-save after</Label>
        <InfoTooltip type='AUTO_SAVE' content={TOOLTIP_CONTENT.AUTO_SAVE} />
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
        <Label className="m-2 text-muted-foreground">of silence</Label>
      </div>
    </div>
  )
}

export default IdleTimerSelection;
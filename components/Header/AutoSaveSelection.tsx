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
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 180, label: "3 minutes" },
    { value: 240, label: "4 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center px-2">
        <InfoTooltip type='AUTO_SAVE' content={TOOLTIP_CONTENT.AUTO_SAVE}>
          <Label className="mr-1 text-muted-foreground cursor-help" htmlFor="idleTimerSelection">Auto-save after</Label>
        </InfoTooltip>
        <Select
          onValueChange={(selectedValue) => onIdleTimerChange(parseInt(selectedValue))}
          value={value?.toString() ?? ''}
        >
          <SelectTrigger className="w-[125px]">
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
        <Label className="m-1 text-muted-foreground">of silence</Label>
      </div>
    </div>
  )
}

export default IdleTimerSelection;
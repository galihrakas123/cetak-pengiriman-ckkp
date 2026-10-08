import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface props {
  onChangeDate?: (value: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  value?: Date;
}

export function DatePicker({
  onChangeDate,
  disabled,
  placeholder,
  label,
  value,
}: props) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleSelected = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChangeDate?.(selectedDate);
  };

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="grid gap-1 w-full">
          {label && <Label>{label}</Label>}
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "dd/MM/yyyy")
            ) : (
              <span>{placeholder || "Pilih Tanggal"}</span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={date}
          onSelect={handleSelected}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

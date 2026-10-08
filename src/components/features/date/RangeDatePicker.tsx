import * as React from "react";
import { format } from "date-fns";
import { CalendarDays as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface dateValue {
  from?: any;
  to?: any;
}

interface DateProps {
  onChangeDate?: (value: any) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  value?: dateValue;
}

export function RangeDatePicker({
  className,
  onChangeDate,
  disabled,
  placeholder,
  label,
  value,
}: React.HTMLAttributes<HTMLDivElement> & DateProps) {
  const [date, setDate] = React.useState<DateRange>({
    from: value?.from || null,
    to: value?.to || null,
  });

  React.useEffect(() => {
    if (value?.from === null) {
      setDate({
        from: null,
        to: null,
      });
    }
  }, [value]);

  const style = {
    border: "1px solid var(--input) !important",
  };

  const handleSelected = (date: any) => {
    setDate(date);
    onChangeDate?.(date);
  };

  return (
    <>
      <div className={cn("self-end w-full", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <div className="grid gap-1.5 w-full">
              {label && <Label>{label}</Label>}
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "h-10 justify-start text-left font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-white px-3.5 transition-all w-full shadow-none",
                  !date && "text-slate-400"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#08874f] dark:text-emerald-400 stroke-[2.2]" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy")} -{" "}
                      {format(date.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>{placeholder || "Pilih Tanggal"}</span>
                )}
              </Button>
            </div>
          </PopoverTrigger>
          {!disabled && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelected}
                numberOfMonths={1}
              />
            </PopoverContent>
          )}
        </Popover>
      </div>
    </>
  );
}

export default RangeDatePicker;

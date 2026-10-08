import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

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
  className?: string;
  buttonClassName?: string;
  allowClear?: boolean;
}

export function DatePicker({
  onChangeDate,
  disabled,
  placeholder,
  label,
  value,
  className,
  buttonClassName,
  allowClear = true,
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
        <div className={cn("grid gap-1.5 w-full", className)}>
          {label && <Label>{label}</Label>}
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "h-10 justify-start text-left font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 px-3.5 transition-all shadow-none relative",
              !date && "text-slate-400",
              buttonClassName
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#08874f] dark:text-emerald-400 stroke-[2.2] shrink-0" />
            <span className="truncate flex-1">
              {date ? format(date, "dd/MM/yyyy") : placeholder || "Pilih Tanggal"}
            </span>
            {allowClear && date && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelected(undefined);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Hapus Tanggal"
              >
                <X size={12} />
              </span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl z-[99999] overflow-hidden" align="start">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={date}
          onSelect={handleSelected}
          initialFocus
          className="bg-white dark:bg-slate-900 rounded-2xl p-3 text-slate-800 dark:text-slate-100"
        />
      </PopoverContent>
    </Popover>
  );
}

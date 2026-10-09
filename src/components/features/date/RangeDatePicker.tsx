import * as React from "react";
import { 
  format, 
  isValid, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  startOfDay, 
  endOfDay 
} from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
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

export interface DateRangeValue {
  from?: Date | string | null;
  to?: Date | string | null;
}

export interface RangeDatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChangeDate?: (value: DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  value?: DateRangeValue;
  buttonClassName?: string;
  allowClear?: boolean;
  align?: "start" | "center" | "end";
  numberOfMonths?: number;
  showPresets?: boolean;
}

const parseToDate = (val?: Date | string | null): Date | undefined => {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isValid(val) ? val : undefined;
  }
  const parsed = new Date(val);
  return isValid(parsed) ? parsed : undefined;
};

export function RangeDatePicker({
  className,
  buttonClassName,
  onChangeDate,
  disabled = false,
  placeholder = "Pilih Rentang Tanggal",
  label,
  value,
  allowClear = true,
  align = "start",
  numberOfMonths = 2,
  showPresets = false,
  ...props
}: RangeDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (!value) return undefined;
    return {
      from: parseToDate(value.from),
      to: parseToDate(value.to),
    };
  });

  // Sync internal state when controlled value prop changes
  React.useEffect(() => {
    if (value) {
      setDate({
        from: parseToDate(value.from),
        to: parseToDate(value.to),
      });
    } else {
      setDate(undefined);
    }
  }, [value?.from, value?.to]);

  const handleSelected = (selectedRange: DateRange | undefined) => {
    setDate(selectedRange);
    onChangeDate?.(selectedRange);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    onChangeDate?.(undefined);
  };

  const applyPreset = (presetRange: DateRange) => {
    setDate(presetRange);
    onChangeDate?.(presetRange);
    setOpen(false);
  };

  const getDisplayText = () => {
    if (!date?.from) return null;
    try {
      const fromFormatted = format(date.from, "dd/MM/yyyy");
      if (date.to) {
        const toFormatted = format(date.to, "dd/MM/yyyy");
        if (fromFormatted === toFormatted) {
          return fromFormatted;
        }
        return `${fromFormatted} - ${toFormatted}`;
      }
      return `${fromFormatted} - Pilih Akhir`;
    } catch {
      return null;
    }
  };

  const displayText = getDisplayText();

  // Preset options
  const today = new Date();
  const presets = [
    {
      label: "Hari Ini",
      range: { from: startOfDay(today), to: endOfDay(today) },
    },
    {
      label: "7 Hari Terakhir",
      range: { from: startOfDay(subDays(today, 6)), to: endOfDay(today) },
    },
    {
      label: "30 Hari Terakhir",
      range: { from: startOfDay(subDays(today, 29)), to: endOfDay(today) },
    },
    {
      label: "Bulan Ini",
      range: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      label: "Bulan Lalu",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
  ];

  return (
    <div className={cn("grid gap-1.5 w-full", className)} {...props}>
      {label && (
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-start text-left font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 px-3.5 transition-all shadow-none relative",
              !displayText && "text-slate-400 dark:text-slate-500",
              buttonClassName
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#08874f] dark:text-emerald-400 stroke-[2.2] shrink-0" />
            <span className="truncate flex-1">
              {displayText || placeholder}
            </span>
            {allowClear && (date?.from || date?.to) && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                title="Hapus Rentang Tanggal"
              >
                <X size={12} />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent
            className="w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl z-[99999] overflow-hidden"
            align={align}
          >
            <div className="flex flex-col sm:flex-row">
              {showPresets && (
                <div className="flex flex-col gap-1 p-3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 w-full sm:w-36 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
                    Preset
                  </span>
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset.range)}
                      className="text-left text-xs px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#08874f]/10 hover:text-[#08874f] dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="p-1">
                <Calendar
                  captionLayout="dropdown"
                  mode="range"
                  defaultMonth={date?.from || new Date()}
                  selected={date}
                  onSelect={handleSelected}
                  numberOfMonths={numberOfMonths}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            {(date?.from || date?.to) && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-3 py-2 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[220px]">
                  {displayText}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={() => {
                      handleSelected(undefined);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="h-7 text-xs px-3 bg-[#08874f] hover:bg-[#06683d] text-white"
                    onClick={() => setOpen(false)}
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default RangeDatePicker;

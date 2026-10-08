"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export function CalendarDateRangePicker({
  className,
  date,
  setDate,
  placeholder,
  maxDate,
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-10 justify-between text-left font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-white px-3.5 transition-all shadow-none",
              !date && "text-slate-400"
            )}
          >
            {date?.from ? (
              date?.to ? (
                <>
                  {format(date?.from, "dd/MM/yyyy")} -{" "}
                  {format(date?.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date?.from, "dd/MM/yyyy")
              )
            ) : (
              <span>{placeholder || "Pilih Tanggal"}</span>
            )}
            <CalendarIcon className="ml-2 h-3.5 w-3.5 text-[#08874f] dark:text-emerald-400 stroke-[2.2]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            captionLayout="dropdown"
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={{ before: new Date("2020-01-01"), after: maxDate }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

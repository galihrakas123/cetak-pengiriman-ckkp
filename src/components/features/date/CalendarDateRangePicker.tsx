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
              "justify-between text-left font-normal rounded-lg border-[1.5px] border-[#cccccc] h-[38px]",
              !date && "text-muted-foreground"
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
            <CalendarIcon className="mr-2 h-4 w-4" />
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

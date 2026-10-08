import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search } from "lucide-react";

type Props = {
  date: any;
  setDate: (date: any) => void;
  placeholder?: string;
};

const InputDate = (props: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant={"outline"}
            className={cn("w-full h-10 px-3.5 text-left font-medium text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-white transition-all shadow-none")}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#08874f] dark:text-emerald-400 stroke-[2.2]" />
            {props.date ? (
              <span>
                {props.date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            ) : (
              <span className="flex items-center text-slate-400">
                {props.placeholder || "Pilih Tanggal"}
              </span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={(e: any) => {
            props.setDate(e);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default InputDate;

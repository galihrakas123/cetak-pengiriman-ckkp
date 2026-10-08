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
            className={cn("w-[240px] pl-3 text-left font-normal")}
          >
            <Search className="mr-2 h-4 w-4" />
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
              <span className="flex items-center">
                {props.placeholder || "Pilih Tanggal"}
              </span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4" />
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

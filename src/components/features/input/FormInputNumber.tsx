import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { NumericFormat } from "react-number-format";

const FormInputNumber = ({
  name,
  placeholder,
  label,
  onValueChange,
}: {
  name: string;
  placeholder: string;
  label: string;
  onValueChange?: (e: any) => void;
}) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-col gap-1.5">
              <Label>{label}</Label>
              <NumericFormat
                className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] focus:bg-white dark:focus:bg-slate-900 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={field.value}
                onValueChange={
                  onValueChange
                    ? onValueChange
                    : (e: any) => {
                        field.onChange(e.floatValue || 0);
                      }
                }
                thousandSeparator={true}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputNumber;

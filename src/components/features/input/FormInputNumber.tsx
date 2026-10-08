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
            <div className="flex flex-col gap-1">
              <Label className="font-bold">{label}</Label>
              <NumericFormat
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

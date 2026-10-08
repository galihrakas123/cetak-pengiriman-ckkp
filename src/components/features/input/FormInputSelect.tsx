import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputSelect from "./InputSelect";

interface FormInputSelectProps {
  name: string;
  options: any[];
  placeholder: string;
  label: string;
  setSelected?: (e: any) => void;
  [x: string]: any;
}

const FormInputSelect: React.FC<FormInputSelectProps> = ({
  name,
  options,
  placeholder,
  label,
  setSelected,
  ...rest
}) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputSelect
              label={label}
              options={options}
              placeholder={placeholder}
              onChange={(e) => {
                field.onChange(e.value.toString());
                if (setSelected) {
                  setSelected(e);
                }
              }}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputSelect;

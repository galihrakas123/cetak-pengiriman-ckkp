import { Label } from "@/components/ui/label";
import { customStylesInputWithoutRounded } from "@/utils/utils";
import React from "react";
import Select from "react-select";

interface InputSelectProps {
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (e: any) => void;
  defaultValue?: { value: string; label: string };
  isDisabled?: boolean;
  className?: string;
  value?: any;
}

const InputSelect = React.forwardRef<any, InputSelectProps>(
  (
    {
      label,
      placeholder,
      options,
      onChange,
      defaultValue,
      className,
      value,
      ...rest
    },
    ref
  ) => (
    <div className={className}>
      <Label className="font-bold">{label}</Label>
      <Select
        ref={ref}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        styles={customStylesInputWithoutRounded}
        defaultValue={defaultValue}
        value={value}
        {...rest}
        isDisabled={rest.isDisabled}
      />
    </div>
  )
);

export default InputSelect;

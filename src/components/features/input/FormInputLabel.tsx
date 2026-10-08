import { Input, InputProps } from "@/components/ui/input";
import React, { ForwardedRef } from "react";

export interface FormInputLabelProps extends InputProps {
  label: string;
}

const FormInputLabel = React.forwardRef<HTMLInputElement, FormInputLabelProps>(
  ({ label, placeholder, helperText, errorMessage, isError, prefixIcon, suffixIcon, ...rest }, ref: ForwardedRef<HTMLInputElement>) => (
    <Input
      ref={ref}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      errorMessage={errorMessage}
      isError={isError}
      prefixIcon={prefixIcon}
      suffixIcon={suffixIcon}
      {...rest}
    />
  )
);

FormInputLabel.displayName = "FormInputLabel";

export default FormInputLabel;

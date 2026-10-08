import React from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";

export interface FormInputIconProps extends InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormInputIcon = ({
  value,
  onChange,
  className,
  ...rest
}: FormInputIconProps) => {
  return (
    <Input
      {...rest}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={rest.placeholder || "Cari..."}
      prefixIcon={<Search size={15} />}
      className={className}
    />
  );
};

export default FormInputIcon;

FormInputIcon.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

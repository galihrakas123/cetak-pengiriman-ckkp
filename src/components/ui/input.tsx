import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  errorMessage?: string;
  isError?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: () => void;
  containerClassName?: string;
  inputContainerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      labelClassName,
      helperText,
      errorMessage,
      isError = false,
      prefixIcon,
      suffixIcon,
      onSuffixClick,
      containerClassName,
      inputContainerClassName,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate id jika tidak disediakan tetapi ada label
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = isError || Boolean(errorMessage);

    // Rendered input box element
    const inputElement = (
      <div
        className={cn(
          "group relative flex items-center w-full rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all duration-150",
          // Normal & Hover states
          !disabled && !hasError && "hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-[#08874f] focus-within:ring-1 focus-within:ring-[#08874f] focus-within:bg-white dark:focus-within:bg-slate-900",
          // Disabled state
          disabled && "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-80",
          // Error state
          hasError && "border-[#dc2626] ring-1 ring-[#dc2626] bg-slate-50 dark:bg-slate-900 focus-within:border-[#dc2626] focus-within:ring-1 focus-within:ring-[#dc2626]",
          inputContainerClassName
        )}
      >
        {/* Prefix Icon */}
        {prefixIcon && (
          <div
            className={cn(
              "flex items-center justify-center pl-3.5 pr-1.5 flex-shrink-0 text-slate-400 dark:text-slate-500 select-none",
              disabled && "text-slate-400 dark:text-slate-500"
            )}
          >
            {prefixIcon}
          </div>
        )}

        {/* Real Input */}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          className={cn(
            "w-full h-10 bg-transparent px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-500",
            prefixIcon ? "pl-1.5" : "pl-3.5",
            suffixIcon ? "pr-1.5" : "pr-3.5",
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Suffix Icon / Action */}
        {suffixIcon && (
          <div
            onClick={!disabled ? onSuffixClick : undefined}
            className={cn(
              "flex items-center justify-center pr-3.5 pl-1.5 flex-shrink-0 select-none",
              onSuffixClick && !disabled ? "cursor-pointer" : "",
              !disabled && !hasError && "text-[#08874f] hover:text-[#06683d] dark:text-emerald-400 dark:hover:text-emerald-300",
              hasError && "text-[#08874f] dark:text-emerald-400",
              disabled && "text-slate-400 dark:text-slate-500"
            )}
          >
            {suffixIcon}
          </div>
        )}
      </div>
    );

    // Jika komponen dipanggil tanpa label/helper/error, langsung kembalikan input box
    if (!label && !helperText && !errorMessage) {
      return inputElement;
    }

    // Jika memiliki label, helperText, atau errorMessage, render wrapper sesuai komposisi referensi
    return (
      <div className={cn("flex flex-col gap-1.5 w-full text-left font-sans", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold text-slate-700 dark:text-slate-200 block transition-colors",
              hasError ? "text-[#dc2626]" : "text-slate-700 dark:text-slate-200",
              disabled && "text-slate-400 dark:text-slate-500",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Input Box */}
        {inputElement}

        {/* Helper Message (di bawah input box) */}
        {!hasError && helperText && (
          <p className="text-[11px] text-slate-500 mt-0.5">
            {helperText}
          </p>
        )}

        {/* Error Message (di bawah input box) */}
        {hasError && errorMessage && (
          <p className="text-[11px] text-[#dc2626] font-medium mt-0.5 animate-in fade-in-50 duration-150">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, Input as InputField };

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
          "group relative flex items-center w-full rounded-xl border bg-[#f8f9fa] dark:bg-slate-900 border-[#e2e4e8] dark:border-slate-700 transition-all duration-150",
          // Normal & Hover states
          !disabled && !hasError && "hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-[#08874f] focus-within:ring-1 focus-within:ring-[#08874f]",
          // Disabled state
          disabled && "bg-[#e5e7eb] dark:bg-slate-800 border-[#d1d5db] dark:border-slate-700 cursor-not-allowed opacity-90",
          // Error state
          hasError && "border-[#dc2626] ring-1 ring-[#dc2626] bg-[#f8f9fa] dark:bg-slate-900 focus-within:border-[#dc2626] focus-within:ring-1 focus-within:ring-[#dc2626]",
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
            "w-full h-11 bg-transparent px-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-500",
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
              // Suffix color matches design: green #08874f for normal, muted for disabled
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

    // Jika memiliki label, helperText, atau errorMessage, render wrapper sesuai design spec
    return (
      <div className={cn("flex flex-col gap-1 w-full text-left font-sans", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-semibold tracking-tight transition-colors",
              hasError ? "text-[#dc2626]" : "text-slate-800 dark:text-slate-200",
              disabled && "text-slate-400 dark:text-slate-500"
            )}
          >
            {label}
          </label>
        )}

        {/* Helper Message (di bawah label sebelum input box) */}
        {helperText && (
          <p className="type-body-small text-slate-500 -mt-0.5 mb-0.5">
            {helperText}
          </p>
        )}

        {/* Input Box */}
        {inputElement}

        {/* Error Message (di bawah input box) */}
        {hasError && errorMessage && (
          <p className="type-body-small text-[#dc2626] font-medium mt-0.5 animate-in fade-in-50 duration-150">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, Input as InputField };

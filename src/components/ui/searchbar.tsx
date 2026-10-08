import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchbarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchClick?: () => void;
  containerClassName?: string;
}

export const Searchbar = React.forwardRef<HTMLInputElement, SearchbarProps>(
  ({ className, containerClassName, placeholder = "Pencarian", onSearchClick, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1 shadow-2xs transition-all focus-within:border-[#08874f] focus-within:ring-1 focus-within:ring-[#08874f] focus-within:bg-white dark:focus-within:bg-slate-900",
          containerClassName
        )}
      >
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent px-3 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={onSearchClick}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#08874f] text-white transition-colors hover:bg-[#06683d] active:scale-95 cursor-pointer shadow-xs"
          title="Cari"
        >
          <Search size={15} className="stroke-[2.5]" />
        </button>
      </div>
    );
  }
);

Searchbar.displayName = "Searchbar";

export default Searchbar;

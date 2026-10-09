import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean; // True jika data banyak (dengan search bar), False jika data sedikit (tanpa search bar)
  hasError?: boolean;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  align?: "left" | "right";
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Pilih Wilayah",
  enableSearch = true,
  hasError = false,
  className,
  buttonClassName,
  popoverClassName,
  align = "left",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cari label dari value yang terpilih
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter opsi berdasarkan input pencarian
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fokuskan ke input search saat popover terbuka
  useEffect(() => {
    if (isOpen && enableSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen, enableSearch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 text-xs rounded-xl border bg-white dark:bg-slate-900 px-3.5 pr-9 text-left flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
          hasError
            ? "border-rose-500"
            : isOpen
            ? "border-[#08874f] ring-1 ring-[#08874f]"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
          disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
          buttonClassName
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption
              ? "text-slate-800 dark:text-slate-100 font-medium"
              : "text-slate-400 dark:text-slate-500"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-[#08874f] dark:text-emerald-400 stroke-[2.4] transition-transform duration-200 shrink-0 absolute right-3 top-1/2 -translate-y-1/2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Popover Dropdown Container (Persis seperti referensi gambar 2) */}
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-1.5 bg-white dark:bg-slate-900 border-2 border-[#08874f] rounded-2xl shadow-xl p-3 animate-in fade-in-0 zoom-in-95 duration-150 max-w-[calc(100vw-32px)]",
          align === "right" ? "right-0" : "left-0",
          !popoverClassName && "min-w-full",
          popoverClassName
        )}>
          {/* Kotak Search (Hanya jika enableSearch === true, seperti Gambar 2) */}
          {enableSearch && (
            <div className="relative mb-2.5">
              <div className="relative flex items-center border border-[#08874f] rounded-xl px-3 py-2 bg-white dark:bg-slate-900 focus-within:ring-1 focus-within:ring-[#08874f]">
                <Search size={16} className="text-[#08874f] shrink-0 mr-2.5 stroke-[2.5]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* List Options dengan Scrollbar Hijau Bapenda */}
          <div className="max-h-56 overflow-y-auto pr-1 space-y-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#08874f] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 dark:[&::-webkit-scrollbar-track]:bg-slate-800">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                Tidak ada data yang cocok
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer group",
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-[#08874f] dark:text-emerald-300 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className="text-[#08874f] dark:text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

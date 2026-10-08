import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t-2 border-emerald-500 bg-[#f8f9fa] dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 select-none gap-3">
      {/* Sisi Kiri: Tampilkan Item & Total */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <span className="text-slate-600 dark:text-slate-400 font-medium">Tampilkan</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="text-slate-600 dark:text-slate-400 font-medium">Item</span>

        <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <span className="text-slate-600 dark:text-slate-400 font-medium">
          dari total <strong className="text-slate-900 dark:text-white font-bold">{totalItems.toLocaleString("id-ID")}</strong>
        </span>
      </div>

      {/* Sisi Kanan: Pilihan Halaman & Tombol Navigasi */}
      <div className="flex items-center gap-2">
        <span className="text-slate-600 dark:text-slate-400 font-medium">Halaman</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-slate-600 dark:text-slate-400 font-medium mr-2">
          dari <strong className="text-slate-900 dark:text-white font-bold">{totalPages}</strong>
        </span>

        {/* Tombol Panah Prev / Next */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 px-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:cursor-not-allowed border-r border-slate-200 dark:border-slate-700 transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 px-2.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:cursor-not-allowed transition-colors"
            title="Halaman Selanjutnya"
          >
            <ChevronRight size={15} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTablePagination;

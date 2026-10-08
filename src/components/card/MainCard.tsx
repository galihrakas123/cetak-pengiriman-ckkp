import { cn } from "@/lib/utils";
import { formatDateTitle, formatNumber } from "@/utils/utils";
import { BaseOdometer } from "../features/odometer/BaseOdometer";

import { Skeleton } from "../ui/skeleton";
import { AiOutlineInfoCircle } from "react-icons/ai";

import "odometer/themes/odometer-theme-default.css";

export interface MainCardProps {
  colored?: boolean;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  dataPenerimaan?: any;
  dataKbm?: any;
  updateAt?: any;
  className?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}

const MainCard: React.FC<MainCardProps> = ({
  colored,
  isLoading,
  title,
  subtitle,
  action,
  dataPenerimaan,
  dataKbm,
  updateAt,
  className,
  headerClassName,
  children,
}) => {
  // Jika MainCard digunakan sebagai Container Card (memiliki children)
  if (children) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 md:p-6 w-full space-y-4 transition-all duration-200",
          className
        )}
      >
        {(title || subtitle || action) && (
          <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60",
              headerClassName
            )}
          >
            <div>
              {title && (
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }

  // Fallback: Tampilan KPI Odometer jika digunakan tanpa children
  return (
    <div
      className={cn(
        "base-card items-center gap-4 relative p-4",
        {
          "bg-[#1976D2] text-white": colored,
        },
        className
      )}
    >
      <div className="absolute top-4 right-4 z-50">
        <span className="cursor-pointer">
          <AiOutlineInfoCircle />
        </span>
      </div>
      <h2 className="text-lg self-center text-center md:text-2xl lg:text-3xl z-50 font-semibold uppercase">
        {title}
      </h2>
      {updateAt && (
        <p className="w-full text-center z-30 font-bold">
          {formatDateTitle(updateAt)}
        </p>
      )}
      <div className="flex items-center gap-3 z-50">
        <span
          className={cn("text-xl md:text-4xl lg:text-5xl font-semibold", {
            "text-white": colored,
          })}
        >
          Rp
        </span>
        {isLoading ? (
          <Skeleton className="w-[200px] md:w-[400px] h-[40px] rounded" />
        ) : (
          <BaseOdometer
            data={dataPenerimaan}
            className="text-xl md:text-5xl lg:text-7xl text-white"
          />
        )}
      </div>
      <div className="text-base md:text-xl lg:text-2xl z-50 font-normal flex gap-2 items-center">
        {isLoading ? (
          <Skeleton className="w-[100px] h-[20px] rounded" />
        ) : (
          <strong>{formatNumber(dataKbm)}</strong>
        )}{" "}
        KBM
      </div>

      {/* Gradient bg */}
      <div className="absolute left-0 top-0 z-0">
        <img src="/images/GradientLeft.svg" alt="gradient-left" />
      </div>
      <div className="absolute bottom-0 right-0 z-0">
        <img src="/images/GradientRight.svg" alt="gradient-right" />
      </div>
    </div>
  );
};

export default MainCard;


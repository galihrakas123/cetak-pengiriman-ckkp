import { cn } from "@/lib/utils";
import { WhiteOdometer } from "../features/odometer/WhiteOdometer";
import SkinCard from "../features/SkinCard";
import { formatNumber } from "@/utils/utils";

// import "odometer/themes/odometer-theme-default.css";

const MainCardWhite = ({ data, colored }) => {
  return (
    <div
      className={cn("base-card items-center gap-4 relative", {
        "bg-gradient-to-r from-green-600 to-primary text-white": colored,
      })}
    >
      <h2 className="text-lg md:text-2xl lg:text-3xl z-50 font-semibold">
        Penerimaan s.d. Hari Ini
      </h2>
      <div className="flex items-center gap-3 z-50">
        <span
          className={cn(
            "text-xl md:text-2xl lg:text-5xl text-secondary font-semibold"
          )}
        >
          Rp
        </span>
        <WhiteOdometer data={data} />
      </div>
      <p className="text-base md:text-xl lg:text-2xl z-50 font-normal">
        <strong>{formatNumber(data?.jml_kbm_all)}</strong> Kendaraan Bermotor
      </p>

      <SkinCard />
    </div>
  );
};

export default MainCardWhite;

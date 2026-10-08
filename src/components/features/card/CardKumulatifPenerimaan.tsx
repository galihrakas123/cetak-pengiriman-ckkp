import OdometerAlatBerat from "@/components/odometer/odometer-alat-berat";
import OdometerKbm from "@/components/odometer/odometer-kbm";
import OdometerRp from "@/components/odometer/odometer-rp";
import { formatGraph, formatPercentage } from "@/utils/utils";
import { ProgressBar } from "primereact/progressbar";

interface CardKumulatifPenerimaanProps {
  kumulatifRupiah?: number;
  kumulatifUnit?: number;
  unitType?: "alat-berat" | "kbm";
  target?: number;
  kurangTarget?: number;
  percentCumulative?: number;
}

const CardKumulatifPenerimaan = ({
  kumulatifRupiah,
  kumulatifUnit,
  unitType = "alat-berat",
  target,
  kurangTarget,
  percentCumulative,
}: CardKumulatifPenerimaanProps) => {
  return (
    <div className="base-card h-full flex justify-center flex-col gap-4 p-6">
      <p className="text-xl font-semibold mb-4 text-center">
        Total Penerimaan s.d. Hari Ini
      </p>

      <div className="text-center top-card ">
        <div className="flex flex-col gap-2 justify-center items-center w-full max-w-full overflow-x-auto overflow-y-hidden py-1 px-1">
          <div className="scale-90 xs:scale-95 sm:scale-100 origin-center max-w-full">
            <OdometerRp
              value={kumulatifRupiah || 0}
              fontSize="text-[24px] md:text-[36px]"
            />
          </div>
          {kumulatifUnit !== undefined && kumulatifUnit !== null && (
            <div className="scale-90 xs:scale-95 sm:scale-100 origin-center max-w-full">
              {unitType === "kbm" ? (
                <OdometerKbm
                  value={kumulatifUnit || 0}
                  fontSize="text-[20px] md:text-[28px]"
                />
              ) : (
                <OdometerAlatBerat
                  value={kumulatifUnit || 0}
                  fontSize="text-[20px] md:text-[28px]"
                />
              )}
            </div>
          )}
        </div>

        <div className="text-center my-6 max-w-[800px] w-[200px] md:w-[400px] lg:w-[800px] mx-auto">
          <p className="font-semibold text-lg">
            Dari Target: Rp {formatGraph(target) || 0}
          </p>
          <div className="flex justify-center">
            <div className="max-w-[800px] w-[200px] md:w-[400px] lg:w-[800px]">
              <div className="relative">
                <ProgressBar
                  value={percentCumulative > 100 ? 100 : percentCumulative}
                  showValue={false}
                  color={
                    percentCumulative < 50
                      ? "#f44336"
                      : percentCumulative < 75
                      ? "#ff9800"
                      : "#4caf50"
                  }
                  style={{
                    height: "32px",
                    background: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                  }}
                />

                {/* Bar tambahan untuk nilai > 100% */}
                {percentCumulative > 100 && (
                  <div
                    className="absolute top-0 left-0 h-full bg-[#49BDF2] opacity-80 rounded-r-xl"
                    style={{
                      width: `${10}%`, // Maksimal 90% untuk visualisasi
                      marginLeft: "100%",
                      transform: "translateX(-100%)",
                    }}
                  />
                )}

                {/* Label persentase */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white drop-shadow-lg">
                    {formatPercentage(percentCumulative)}%
                  </span>
                </div>
              </div>

              {/* <ProgressBar
                completed={percentCumulative}
                height="36px"
                bgColor={
                  percentCumulative < 50
                    ? "#f44336"
                    : percentCumulative < 75
                    ? "#ff9800"
                    : "#4caf50"
                }
                baseBgColor="rgba(0, 0, 0, 0.1)"
                customLabel={formatPercentage(percentCumulative) + "%"}
              /> */}

              {/* <ProgressBar
                value={percentCumulative}
                showValue
                className="w-full"
                color={
                  percentCumulative < 50
                    ? "#f44336"
                    : percentCumulative < 75
                    ? "#ff9800"
                    : "#4caf50"
                }
                style={{
                  height: "30px",
                  background: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                }}
                displayValueTemplate={(value) => {
                  if (!value) return null;

                  return (
                    <span className="text-sm font-semibold justify-center flex text-center w-full">
                      {formatPercentage(value)}%
                    </span>
                  );
                }}
              /> */}
            </div>
          </div>
          <p className="text-end text-sm">
            Sisa: Rp <strong>{formatGraph(kurangTarget)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardKumulatifPenerimaan;

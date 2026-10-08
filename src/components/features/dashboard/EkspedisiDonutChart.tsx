import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Truck } from "lucide-react";

interface EkspedisiDonutChartProps {
  className?: string;
}

export const EkspedisiDonutChart: React.FC<EkspedisiDonutChartProps> = ({ className = "" }) => {
  // Data sebaran ekspedisi yang dipilih dari Sambara
  const ekspedisiData = [
    { name: "Pos Indonesia", count: 6850, percentage: 55.0, color: "#f97316" }, // Oranye Pos
    { name: "JNE Express", count: 3980, percentage: 32.0, color: "#2563eb" },   // Biru JNE
    { name: "SiCepat Express", count: 1120, percentage: 9.0, color: "#dc2626" }, // Merah SiCepat
    { name: "J&T Express", count: 500, percentage: 4.0, color: "#e11d48" },    // Merah J&T
  ];

  const series = ekspedisiData.map((item) => item.count);
  const labels = ekspedisiData.map((item) => item.name);
  const colors = ekspedisiData.map((item) => item.color);
  const totalBerkas = series.reduce((acc, curr) => acc + curr, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 290,
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    colors: colors,
    labels: labels,
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#64748b",
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              color: "#1e293b",
              offsetY: 4,
              formatter: (val) => Number(val).toLocaleString("id-ID"),
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Berkas",
              fontSize: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              formatter: () => `${totalBerkas.toLocaleString("id-ID")}`,
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => {
          const pct = ((val / totalBerkas) * 100).toFixed(1);
          return `${val.toLocaleString("id-ID")} Berkas (${pct}%)`;
        },
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 md:p-6 space-y-4 flex flex-col justify-between ${className}`}>
      {/* Header Card */}
      <div className="pb-2 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center justify-between">
          <h2 className="type-title-medium text-slate-800 dark:text-white font-bold">Sebaran Ekspedisi</h2>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
            <Truck size={17} />
          </div>
        </div>
        <p className="type-body-small text-slate-400 dark:text-slate-400 mt-0.5">
          Proporsi pilihan logistik kurir dari Wajib Pajak (Sambara)
        </p>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center my-auto py-1">
        <Chart
          options={options}
          series={series}
          type="donut"
          height={260}
        />
      </div>

      {/* Legend Custom dengan Pills Info */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        {ekspedisiData.map((item) => (
          <div
            key={item.name}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                {item.name}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white shrink-0 ml-1">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

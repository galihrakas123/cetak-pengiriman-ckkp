import React, { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TrendingUp } from "lucide-react";

interface TrendPengirimanChartProps {
  className?: string;
}

export const TrendPengirimanChart: React.FC<TrendPengirimanChartProps> = ({ className = "" }) => {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "BULAN_INI">("7D");

  // Data series sesuai rentang waktu
  const getChartData = () => {
    if (timeRange === "30D") {
      return {
        categories: [
          "Minggu 1",
          "Minggu 2",
          "Minggu 3",
          "Minggu 4",
        ],
        series: [
          {
            name: "Dokumen Masuk",
            data: [2840, 3120, 3450, 3040],
          },
          {
            name: "Sukses Terkirim",
            data: [2740, 3010, 3320, 2940],
          },
          {
            name: "Gagal Terkirim",
            data: [100, 110, 130, 100],
          },
        ],
      };
    }

    if (timeRange === "BULAN_INI") {
      return {
        categories: [
          "01-05 Okt",
          "06-10 Okt",
          "11-15 Okt",
          "16-20 Okt",
          "21-25 Okt",
          "26-31 Okt",
        ],
        series: [
          {
            name: "Dokumen Masuk",
            data: [1950, 2180, 2400, 2250, 2380, 2190],
          },
          {
            name: "Sukses Terkirim",
            data: [1870, 2095, 2305, 2165, 2290, 2105],
          },
          {
            name: "Gagal Terkirim",
            data: [80, 85, 95, 85, 90, 85],
          },
        ],
      };
    }

    // Default 7 Hari Terakhir
    return {
      categories: [
        "02 Okt",
        "03 Okt",
        "04 Okt",
        "05 Okt",
        "06 Okt",
        "07 Okt",
        "08 Okt",
      ],
      series: [
        {
          name: "Dokumen Masuk",
          data: [420, 510, 480, 540, 610, 590, 630],
        },
        {
          name: "Sukses Terkirim",
          data: [405, 492, 465, 522, 592, 574, 614],
        },
        {
          name: "Gagal Terkirim",
          data: [15, 18, 15, 18, 18, 16, 16],
        },
      ],
    };
  };

  const chartData = getChartData();

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 340,
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    colors: ["#2563eb", "#08874f", "#dc2626"], // Biru: Dokumen Masuk, Hijau: Sukses Terkirim, Merah: Gagal Terkirim
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [2.5, 2.5, 3],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: {
        top: 6,
        right: 12,
        bottom: 12,
        left: 10,
      },
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "11px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "11px",
          fontWeight: 500,
        },
        formatter: (val) => val.toLocaleString("id-ID"),
      },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val.toLocaleString("id-ID")} Berkas`,
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontWeight: 500,
      offsetY: 2,
      labels: {
        colors: "#64748b",
      },
      markers: {
        size: 5,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 md:p-6 space-y-4 ${className}`}>
      {/* Header Grafik & Filter Rentang Waktu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="type-title-medium text-slate-800 dark:text-white font-bold">Tren Distribusi & Pencetakan SKKP</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#08874f] bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <TrendingUp size={11} /> +12.4% Efektivitas
            </span>
          </div>
          <p className="type-body-small text-slate-400 dark:text-slate-400 mt-0.5">
            Perbandingan volume dokumen masuk, sukses terkirim, dan gagal terkirim
          </p>
        </div>

        {/* Tab Filter Periode */}
        <div className="flex items-center bg-slate-100/90 dark:bg-slate-700/60 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeRange("7D")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeRange === "7D"
                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            7 Hari
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("30D")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeRange === "30D"
                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            30 Hari
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("BULAN_INI")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeRange === "BULAN_INI"
                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {/* Area Chart Container - Berikan jarak yang lapang dan proporsional antara grafik dan status di bawahnya */}
      <div className="w-full pt-2 pb-1">
        <Chart
          options={options}
          series={chartData.series}
          type="area"
          height={325}
        />
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { 
  Building2, 
  Download, 
  Printer, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRekapSamsat, getSummaryStats } from "@/services/mockData";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";
import { SearchableSelect } from "@/components/features/select/SearchableSelect";

const PengirimanLaporanPage: React.FC = () => {
  const [selectedBulan, setSelectedBulan] = useState("Oktober 2026");

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const rekapSamsat = getRekapSamsat();
  const stats = getSummaryStats();

  const totalItems = rekapSamsat.length;
  const paginatedData = rekapSamsat.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 dark:text-white tracking-tight">Laporan & Rekap Pengiriman</h1>
          <p className="type-body-small text-slate-500 dark:text-slate-400 mt-1">
            Rekapitulasi performa dan tingkat keberhasilan pengiriman berkas SKKP per unit kerja
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Printer size={13} /> Cetak Rekap
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Download size={13} /> Unduh PDF / Excel
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">
            Periode:
          </span>
          <div className="w-44 sm:w-48">
            <SearchableSelect
              value={selectedBulan}
              onChange={(val) => {
                setSelectedBulan(val);
                setCurrentPage(1);
              }}
              enableSearch={false}
              options={[
                { value: "Oktober 2026", label: "Oktober 2026" },
                { value: "September 2026", label: "September 2026" },
                { value: "Agustus 2026", label: "Agustus 2026" },
              ]}
              placeholder="Pilih Periode"
              buttonClassName="h-[38px] text-xs py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Total Berkas Terdata: <strong className="text-slate-800 dark:text-white">{stats.totalPengiriman.toLocaleString("id-ID")}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Rata-rata Sukses: <strong className="text-emerald-600 dark:text-emerald-400">{stats.tingkatKeberhasilan}</strong>
          </span>
        </div>
      </div>

      {/* Rekap Table with Green Header & Full-Width Pagination */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs p-5 md:p-6 space-y-4 w-full">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60">
          <Building2 size={16} className="text-[#08874f] dark:text-emerald-400" />
          <h2 className="type-title-medium text-slate-800 dark:text-white">Rekapitulasi Performa Wilayah Samsat</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-700 w-full shadow-xs bg-white dark:bg-slate-900">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr className="border-b border-emerald-800 dark:border-slate-700">
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Nama Unit Kerja / Samsat
                  </th>
                  <th className="py-3 px-4 font-semibold text-right border-r border-white/60 whitespace-nowrap">
                    Total Berkas
                  </th>
                  <th className="py-3 px-4 font-semibold text-right border-r border-white/60 whitespace-nowrap">
                    Sukses Terkirim
                  </th>
                  <th className="py-3 px-4 font-semibold text-right border-r border-white/60 whitespace-nowrap">
                    Dalam Perjalanan
                  </th>
                  <th className="py-3 px-4 font-semibold text-right border-r border-white/60 whitespace-nowrap">
                    Gagal / Retur
                  </th>
                  <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">
                    Persentase Sukses
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                      {item.nama}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                      {item.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">
                      {item.sukses.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                      {item.proses.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-rose-600 dark:text-rose-400 border-r border-slate-200 dark:border-slate-700">
                      {item.gagal.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {item.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar Panjang (Image 2) */}
          <CustomTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </div>
  );
};

export default PengirimanLaporanPage;

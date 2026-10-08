import React, { useState } from "react";
import { useQuery } from "react-query";
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  TrendingUp,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  getSummaryStats 
} from "@/services/mockData";
import { cetakSkkpService } from "@/services/cetakSkkpService";
import { TrendPengirimanChart } from "@/components/features/dashboard/TrendPengirimanChart";
import { EkspedisiDonutChart } from "@/components/features/dashboard/EkspedisiDonutChart";

const BerandaPage: React.FC = () => {
  const stats = getSummaryStats();

  const [selectedSamsat, setSelectedSamsat] = useState("ALL");
  const [selectedTahun, setSelectedTahun] = useState("2026");

  // Ambil data dari Layanan Cetak SKKP agar sinkron dengan menu Pengelolaan Cetak SKKP
  const { data: cetakList = [] } = useQuery(
    "cetak-skkp",
    () => cetakSkkpService.fetchCetakSkkpList()
  );

  // Filter sesuai Samsat jika dipilih
  const filteredCetakList = cetakList.filter((item) => {
    if (selectedSamsat === "ALL") return true;
    return item.samsat.toLowerCase().includes(selectedSamsat.toLowerCase());
  });

  // Tampilkan tepat 10 data
  const recentCetakList = filteredCetakList.slice(0, 10);

  return (
    <div className="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -mt-4 -mx-4 md:-mt-6 md:-mx-6 font-sans">
      {/* 1. Header Banner Bergaya Resmi Bapenda Menempel Penuh Memenuhi Kanan-Kiri */}
      <div className="w-full bg-gradient-to-r from-[#006e33] via-[#008744] to-[#009b50] text-white px-6 py-6 md:px-8 md:py-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Dashboard Monitoring Pengiriman SKKP
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-normal">
              Update Terakhir: Hari Ini, 8 Oktober 2026 pukul 10:55:00
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="bg-white text-[#08874f] hover:bg-emerald-50 hover:text-[#06683d] font-semibold gap-2 text-xs shadow-sm border-0 cursor-pointer"
            >
              <Download size={13} className="text-[#08874f]" />
              Export Laporan
            </Button>
          </div>
        </div>
      </div>

      {/* Kontainer Isi Halaman (Memiliki Margin & Padding Normal) */}
      <div className="p-4 md:p-6 space-y-5">
        {/* 2. Card Filter Wilayah (Samsat) & Tahun Sesuai Desain Referensi */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Filter Samsat / Wilayah (3 Kolom) */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide block">
                Samsat / Wilayah
              </label>
              <div className="relative">
                <select
                  value={selectedSamsat}
                  onChange={(e) => setSelectedSamsat(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
                >
                  <option value="ALL">Semua Samsat Wilayah Jawa Barat</option>
                  <option value="Bandung">Samsat Wilayah Bandung (Pajajaran, Kawaluyaan, Tengah, Barat, Timur)</option>
                  <option value="Bogor">Samsat Kota & Kabupaten Bogor</option>
                  <option value="Bekasi">Samsat Kota & Kabupaten Bekasi</option>
                  <option value="Cirebon">Samsat Kota & Kabupaten Cirebon</option>
                  <option value="Karawang">Samsat Kabupaten Karawang</option>
                  <option value="Tasikmalaya">Samsat Kota & Kabupaten Tasikmalaya</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
                />
              </div>
            </div>

            {/* Filter Tahun (1 Kolom) */}
            <div className="md:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide block">
                Tahun
              </label>
              <div className="relative">
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
                >
                  <option value="2026">Tahun 2026</option>
                  <option value="2025">Tahun 2025</option>
                  <option value="ALL">Semua Tahun</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 4 KPI Summary Cards (Bersih Tanpa Background Motif) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Card 1: Total Pengiriman (Solid Gradient Hijau Bersih) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08874f] to-[#046138] text-white p-5 shadow-xs border border-emerald-700/50 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                Total Pengiriman
              </p>
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                <Truck size={17} />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {stats.totalPengiriman.toLocaleString("id-ID")}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-medium mt-1">
                <TrendingUp size={12} />
                <span>{stats.pertumbuhanPersen} dari bulan lalu</span>
              </div>
            </div>
          </div>

          {/* Card 2: Sukses Terkirim */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sukses Terkirim
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stats.suksesTerkirim.toLocaleString("id-ID")}
              </h3>
              <span className="text-[11px] text-[#08874f] dark:text-emerald-400 font-semibold mt-1 block">
                {stats.tingkatKeberhasilan} Tingkat Keberhasilan
              </span>
            </div>
          </div>

          {/* Card 3: Dalam Perjalanan (Text on-surface, Icon & Kotak sesuaikan Card Sukses Terkirim) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dalam Perjalanan
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
                <Clock size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stats.dalamPerjalanan.toLocaleString("id-ID")}
              </h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
                Estimasi 1-2 hari kerja
              </span>
            </div>
          </div>

          {/* Card 4: Retur / Gagal */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Retur / Gagal
              </p>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                {stats.returGagal.toLocaleString("id-ID")}
              </h3>
              <span className="text-[11px] text-rose-500 dark:text-rose-400/90 font-medium mt-1 block">
                Perlu konfirmasi alamat
              </span>
            </div>
          </div>
        </div>

      {/* 4. Visualisasi Grafik: Tren Distribusi & Sebaran Ekspedisi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <TrendPengirimanChart className="lg:col-span-2" />
        <EkspedisiDonutChart className="lg:col-span-1" />
      </div>

      {/* 5. Tabel Daftar Wajib Pajak Cetak SKKP (Sesuai Format Menu Pengelolaan Cetak SKKP) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 md:p-6 space-y-4 w-full">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Daftar Wajib Pajak Cetak SKKP
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Daftar Wajib Pajak dalam antrean pencetakan lembar SKKP
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-700 w-full shadow-xs">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr>
                  <th className="py-3 px-3 w-12 text-center font-semibold border-r border-white/20 whitespace-nowrap">
                    No
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    No. Polisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Nama Pemilik
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Ekspedisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Tanggal Pengajuan
                  </th>
                  <th className="py-3 px-4 font-semibold text-center whitespace-nowrap">
                    Status Cetak
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-900">
                {recentCetakList.length > 0 ? (
                  recentCetakList.map((item, index) => {
                    const isSudahDicetak = item.statusCetak === "SUDAH_DICETAK";
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        {/* 1. No */}
                        <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                          {index + 1}
                        </td>

                        {/* 2. No. Polisi */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-[#08874f] dark:text-emerald-400 font-mono text-xs">
                            {item.nopol}
                          </div>
                          {item.noKohir && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {item.noKohir}
                            </div>
                          )}
                        </td>

                        {/* 3. Nama Pemilik */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {item.namaPemilik}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="truncate max-w-[220px]">
                              {item.jenisKendaraan || "Kendaraan Bermotor"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.samsat}
                          </div>
                        </td>

                        {/* 4. Ekspedisi */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {item.ekspedisi || item.opsiPengiriman || "-"}
                          </span>
                        </td>

                        {/* 5. Tanggal Pengajuan */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-700 dark:text-slate-200 font-medium">
                            {item.tanggalPengajuan}
                          </div>
                        </td>

                        {/* 6. Status Cetak */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isSudahDicetak ? (
                            <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Sudah dicetak
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-white" />
                              Belum dicetak
                            </Badge>
                          )}

                          {/* Info jika sudah dicetak */}
                          {isSudahDicetak && item.tanggalCetak && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Dicetak: {item.tanggalCetak}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400 font-medium"
                    >
                      Tidak ada data antrean cetak SKKP untuk filter Samsat yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tombol Lihat Daftar Lengkap -> Masuk ke Menu Pengelolaan Cetak SKKP */}
        <div className="flex justify-center pt-3 pb-1">
          <Link to="/pengiriman/cetak">
            <button
              type="button"
              className="border-2 border-[#08874f] text-[#08874f] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-[#06683d] dark:hover:text-emerald-300 font-semibold text-xs px-8 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer bg-white dark:bg-slate-900"
            >
              Lihat Daftar Lengkap
            </button>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BerandaPage;
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  Printer,
  Send,
  Loader2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Check,
  Eye,
  Layers,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
} from "lucide-react";

import MainCard from "@/components/card/MainCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Searchbar } from "@/components/ui/searchbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";
import { toast } from "@/hooks/use-toast";
import { cetakSkkpService } from "@/services/cetakSkkpService";
import { CetakSKKPRecord, CetakStatus } from "@/types";
import { formatRupiah } from "@/utils/utils";
import { cn } from "@/lib/utils";

const PengelolaanCetakPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [samsatFilter, setSamsatFilter] = useState<string>("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog State for "Detail Berkas SKKP"
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState<CetakSKKPRecord | null>(null);

  // 1. Query: Fetch Cetak SKKP List
  const {
    data: cetakList = [],
    isLoading,
  } = useQuery<CetakSKKPRecord[]>(
    ["cetak-skkp", { searchTerm, statusFilter, samsatFilter }],
    () =>
      cetakSkkpService.fetchCetakSkkpList({
        search: searchTerm,
        status: statusFilter,
        samsat: samsatFilter,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // 2. Query: Fetch Stats (sinkron dengan filter pencarian dan wilayah Samsat)
  const { data: stats } = useQuery(
    ["cetak-skkp-stats", { searchTerm, samsatFilter }],
    () =>
      cetakSkkpService.fetchCetakStats({
        search: searchTerm,
        samsat: samsatFilter,
      }),
    { refetchOnWindowFocus: false }
  );

  // 3. Mutation: Update Single Cetak Status
  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: CetakStatus }) =>
      cetakSkkpService.updateStatusCetak(id, status),
    {
      onSuccess: (updatedItem) => {
        queryClient.invalidateQueries("cetak-skkp");
        queryClient.invalidateQueries("cetak-skkp-stats");
        setActiveDetailItem(updatedItem);
        // Hapus dari selection jika sudah dicetak
        setSelectedIds((prev) => prev.filter((item) => item !== updatedItem.id));
        const statusLabel =
          updatedItem.statusCetak === "SUDAH_DICETAK"
            ? "Sudah dicetak"
            : "Belum dicetak";
        toast({
          title: "Status Cetak Diperbarui",
          description: `Berkas ${updatedItem.nopol} (${updatedItem.namaPemilik}) telah ditandai ${statusLabel}.`,
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Gagal Mengubah Status",
          description: err?.message || "Terjadi kesalahan pada sistem.",
        });
      },
    }
  );

  // 4. Mutation: Proses Pengiriman SKKP (Langsung tanpa popup konfirmasi)
  const prosesKirimMutation = useMutation(
    (payload: { id: string; ekspedisi: string; noResi: string; catatan?: string }) =>
      cetakSkkpService.prosesKirimSKKP(payload),
    {
      onSuccess: (updatedItem) => {
        queryClient.invalidateQueries("cetak-skkp");
        queryClient.invalidateQueries("cetak-skkp-stats");
        toast({
          title: "Dokumen masuk ke proses pengiriman. Silakan pantau di menu Pengiriman & Tracking",
          description: `Berkas ${updatedItem.nopol} (${updatedItem.namaPemilik}) telah diteruskan ke kurir ${updatedItem.ekspedisi}.`,
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Gagal Memproses Pengiriman",
          description: err?.message || "Terjadi kesalahan.",
        });
      },
    }
  );

  // 5. Mutation: Batch Update Status
  const batchPrintMutation = useMutation(
    (ids: string[]) => cetakSkkpService.batchUpdateStatusCetak(ids, "SUDAH_DICETAK"),
    {
      onSuccess: (updatedItems) => {
        queryClient.invalidateQueries("cetak-skkp");
        queryClient.invalidateQueries("cetak-skkp-stats");
        setSelectedIds([]);
        toast({
          title: "Cetak Massal Berhasil",
          description: `${updatedItems.length} berkas SKKP berhasil ditandai sudah dicetak.`,
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Gagal Cetak Massal",
          description: err?.message || "Terjadi kesalahan.",
        });
      },
    }
  );

  // Eksekusi Langsung Cetak SKKP (Update status ke SUDAH_DICETAK + dialog print)
  const handleCetakSKKPDirect = (item: CetakSKKPRecord) => {
    updateStatusMutation.mutate({
      id: item.id,
      status: "SUDAH_DICETAK",
    });
    window.print();
  };

  // Eksekusi Langsung Kirim SKKP (Tanpa popup konfirmasi)
  const handleKirimSKKPDirect = (item: CetakSKKPRecord) => {
    const ekspedisi = item.opsiPengiriman?.includes("JNE") ? "JNE Express" : "Pos Indonesia";
    const randomResi = `SKKP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    prosesKirimMutation.mutate({
      id: item.id,
      ekspedisi,
      noResi: randomResi,
      catatan: `Pengiriman berkas SKKP nopol ${item.nopol}`,
    });
  };

  // Pagination calculation
  const totalItems = cetakList.length;
  const paginatedData = cetakList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Hanya data yang berstatus BELUM_DICETAK yang dapat dipilih untuk dicetak
  const selectableCurrentData = paginatedData.filter(
    (d) => d.statusCetak === "BELUM_DICETAK"
  );

  const isAllCurrentSelected =
    selectableCurrentData.length > 0 &&
    selectableCurrentData.every((item) => selectedIds.includes(item.id));

  // Handle Select All (HANYA memilih data yang BELUM_DICETAK)
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectableIds = selectableCurrentData.map((d) => d.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...selectableIds])));
    } else {
      const selectableIdsSet = new Set(selectableCurrentData.map((d) => d.id));
      setSelectedIds(selectedIds.filter((id) => !selectableIdsSet.has(id)));
    }
  };

  // Handle Select Individual (Mencegah memilih data yang sudah dicetak)
  const handleToggleSelect = (item: CetakSKKPRecord) => {
    if (item.statusCetak === "SUDAH_DICETAK") return;
    if (selectedIds.includes(item.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== item.id));
    } else {
      setSelectedIds([...selectedIds, item.id]);
    }
  };

  // Hitung jumlah valid yang belum dicetak dari seluruh selection
  const validBelumDicetakSelectedIds = selectedIds.filter((id) => {
    const found = cetakList.find((item) => item.id === id);
    return found ? found.statusCetak === "BELUM_DICETAK" : true;
  });

  return (
    <div className="space-y-6 w-full font-sans pb-10">
      {/* Page Header Sesuai Standar Halaman Lain */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 dark:text-white tracking-tight">
            Pengelolaan Cetak SKKP
          </h1>
          <p className="type-body-small text-slate-500 dark:text-slate-400 mt-1">
            Daftar lengkap antrean pencetakan fisik Surat Ketetapan Kewajiban Pembayaran yang siap diproses dan dikirimkan
          </p>
        </div>

        {/* Action Buttons Header: Sesuai jumlah berkas yang belum dicetak */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {validBelumDicetakSelectedIds.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => batchPrintMutation.mutate(validBelumDicetakSelectedIds)}
              disabled={batchPrintMutation.isLoading}
              className="gap-2"
            >
              <Printer size={13} />
              Cetak Terpilih ({validBelumDicetakSelectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* 4 Kartu KPI Ringkasan Status (Seragam 100% dengan Menu Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Card 1: Total Permintaan (Sesuai Card 1 di Menu Dashboard) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08874f] to-[#046138] text-white p-5 shadow-xs border border-emerald-700/50 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Total Permintaan
            </p>
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <Layers size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {(stats?.totalPengajuan ?? cetakList.length).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-emerald-100 font-medium mt-1 block">
              Total berkas pemohon
            </span>
          </div>
        </div>

        {/* Card 2: Belum Dicetak (Sesuai Card di Menu Dashboard) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Belum Dicetak
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Clock size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {(stats?.belumDicetak ?? 0).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Total Berkas belum dicetak
            </span>
          </div>
        </div>

        {/* Card 3: Sudah Dicetak (Sesuai Card Sukses Terkirim di Menu Dashboard) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sudah Dicetak
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {(stats?.sudahDicetak ?? 0).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Total Berkas sudah dicetak
            </span>
          </div>
        </div>

        {/* Card 4: Dalam Pengiriman (Sesuai Card di Menu Dashboard) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dalam Pengiriman
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Truck size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {(stats?.dalamPengiriman ?? stats?.sudahTerkirim ?? 0).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Total Berkas dalam pengiriman
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Card Sesuai Standar Menu Lain */}
      <MainCard
        title="Daftar Wajib Pajak Cetak SKKP"
        subtitle="Kelola antrean pencetakan lembar SKKP dan teruskan pengiriman ke kurir"
        action={
          <div className="flex items-center gap-2">
            {(searchTerm || statusFilter !== "ALL" || samsatFilter !== "ALL") && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setSamsatFilter("ALL");
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                Reset Filter
              </Button>
            )}
          </div>
        }
      >
        {/* Toolbar Filter & Searchbar Komponen Asli */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full pb-2">
          {/* Komponen Searchbar Seragam dengan Halaman Pengiriman */}
          <Searchbar
            placeholder="Pencarian nopol, nama, atau kohir..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            containerClassName="w-full md:w-80"
          />

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-slate-400" />

            {/* Status Cetak Filter (3 Status + Semua) */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Semua Antrean Cetak</option>
                <option value="BELUM_DICETAK">Belum Dicetak</option>
                <option value="SUDAH_DICETAK">Sudah Dicetak</option>
                <option value="DALAM_PENGIRIMAN">Dalam Pengiriman</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>

            {/* Samsat Asal Filter */}
            <div className="relative">
              <select
                value={samsatFilter}
                onChange={(e) => {
                  setSamsatFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Semua Samsat</option>
                <option value="Bandung">Samsat Bandung</option>
                <option value="Bekasi">Samsat Bekasi</option>
                <option value="Bogor">Samsat Bogor</option>
                <option value="Cirebon">Samsat Cirebon</option>
                <option value="Tasikmalaya">Samsat Tasikmalaya</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Tabel Data Cetak SKKP dengan Header Hijau Khas Bapenda */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 w-full shadow-xs bg-white dark:bg-slate-900">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr>
                  <th className="py-3 px-3 w-10 text-center border-r border-white/20">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      disabled={selectableCurrentData.length === 0}
                      onChange={handleSelectAll}
                      className={cn(
                        "rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#08874f] focus:ring-[#08874f]",
                        selectableCurrentData.length === 0
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                      title={
                        selectableCurrentData.length === 0
                          ? "Semua berkas pada halaman ini sudah dicetak"
                          : "Pilih Semua Berkas Belum Dicetak di Halaman Ini"
                      }
                    />
                  </th>
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
                  <th className="py-3 px-4 font-semibold text-center border-r border-white/20 whitespace-nowrap">
                    Status Cetak
                  </th>
                  <th className="py-3 px-4 font-semibold text-center whitespace-nowrap min-w-[200px]">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* Body Tabel */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#08874f]" />
                        <span className="text-xs font-medium">Memuat data antrean cetak...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    const isSudahDicetak = row.statusCetak === "SUDAH_DICETAK";
                    const isSelected = selectedIds.includes(row.id) && !isSudahDicetak;
                    const isDalamPengiriman =
                      row.statusPengiriman === "DALAM_PENGIRIMAN" || row.statusPengiriman === "DIKIRIM";
                    const isTerkirim = row.statusPengiriman === "TERKIRIM";
                    const isRetur = row.statusPengiriman === "RETUR";

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors ${
                          isSelected ? "bg-emerald-50/40 dark:bg-emerald-950/40" : ""
                        }`}
                      >
                        {/* Checkbox: Di-disable jika berkas sudah dicetak */}
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isSudahDicetak}
                            onChange={() => handleToggleSelect(row)}
                            className={cn(
                              "rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#08874f] focus:ring-[#08874f]",
                              isSudahDicetak
                                ? "opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
                                : "cursor-pointer"
                            )}
                            title={
                              isSudahDicetak
                                ? "Berkas sudah dicetak (checkbox dinonaktifkan)"
                                : "Pilih untuk cetak massal"
                            }
                          />
                        </td>

                        {/* 1. No */}
                        <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                          {rowNumber}
                        </td>

                        {/* 2. No. Polisi (Format Hijau Khas Halaman Pengiriman) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-[#08874f] dark:text-emerald-400 font-mono text-xs">
                            {row.nopol}
                          </div>
                          {row.noKohir && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                              {row.noKohir}
                            </div>
                          )}
                        </td>

                        {/* 3. Nama Pemilik */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-100">
                            {row.namaPemilik}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="truncate max-w-[220px]">
                              {row.jenisKendaraan || "Kendaraan Bermotor"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            {row.samsat}
                          </div>
                        </td>

                        {/* 4. Ekspedisi (Dipilih dari Aplikasi Sambara) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {row.ekspedisi || row.opsiPengiriman || "-"}
                          </span>
                        </td>

                        {/* 5. Tanggal Pengajuan */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-700 dark:text-slate-200 font-medium">
                            {row.tanggalPengajuan}
                          </div>
                        </td>

                        {/* 5. Status Cetak & Pengiriman (Sesuai Standar AGENTS.md) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isDalamPengiriman ? (
                            <>
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1 shadow-none">
                                <Truck className="w-3 h-3 text-blue-700 dark:text-blue-300" />
                                Dalam Pengiriman
                              </Badge>
                              {row.tanggalKirim ? (
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Dikirim: {row.tanggalKirim}
                                </div>
                              ) : row.noResi ? (
                                <div className="text-[10px] text-slate-400 font-mono mt-1">
                                  Resi: {row.noResi}
                                </div>
                              ) : null}
                            </>
                          ) : isTerkirim ? (
                            <>
                              <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Terkirim
                              </Badge>
                              {row.noResi && (
                                <div className="text-[10px] text-slate-400 font-mono mt-1">
                                  Resi: {row.noResi}
                                </div>
                              )}
                            </>
                          ) : isRetur ? (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-700 dark:text-red-300" />
                              Retur / Gagal
                            </Badge>
                          ) : isSudahDicetak ? (
                            <>
                              <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Sudah dicetak
                              </Badge>
                              {row.tanggalCetak && (
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Dicetak: {row.tanggalCetak}
                                </div>
                              )}
                            </>
                          ) : (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-white" />
                              Belum dicetak
                            </Badge>
                          )}
                        </td>

                        {/* 6. Aksi (Belum Cetak: Detail & Cetak SKKP | Sudah Cetak: Detail & Siap Kirim) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {/* BUTTON 1: DETAIL */}
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setActiveDetailItem(row);
                                setIsDetailOpen(true);
                              }}
                              className="gap-1.5"
                              title="Lihat Detail Berkas SKKP"
                            >
                              <Eye size={13} />
                              Detail
                            </Button>

                            {/* BUTTON 2: AKSI SESUAI STATUS */}
                            {!isSudahDicetak ? (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleCetakSKKPDirect(row)}
                                disabled={updateStatusMutation.isLoading}
                                className="gap-1.5"
                                title="Cetak Berkas SKKP"
                              >
                                <Printer size={13} />
                                Cetak SKKP
                              </Button>
                            ) : isDalamPengiriman || isTerkirim ? (
                              <Button
                                size="sm"
                                disabled
                                className="gap-1.5 font-medium text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none"
                                title="Berkas SKKP sudah masuk ke proses pengiriman"
                              >
                                <Send size={13} />
                                Siap Kirim
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleKirimSKKPDirect(row)}
                                disabled={prosesKirimMutation.isLoading}
                                className="gap-1.5 font-semibold text-xs transition-all shadow-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 border-0 cursor-pointer shadow-blue-500/20"
                                title="Klik untuk mengubah status berkas menjadi 'Dalam Pengiriman' dan memindahkannya ke menu Tracking"
                              >
                                <Send size={13} />
                                Siap Kirim
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Tidak ada data pengajuan cetak yang ditemukan.
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Coba ubah kata kunci pencarian atau sesuaikan filter status.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Standar Bapenda */}
          <CustomTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </MainCard>

      {/* ========================================================================= */}
      {/* DIALOG DETAIL BERKAS SKKP (Redesign: Flat e-Form Pernyataan Style)        */}
      {/* ========================================================================= */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="p-0 text-left">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-left">
                  Detail Berkas SKKP
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 text-left mt-0.5">
                  Rincian Surat Ketetapan Kewajiban Pembayaran Pajak Kendaraan Bermotor
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Tutup Dialog"
              >
                <X size={18} />
              </button>
            </div>
          </DialogHeader>

          {activeDetailItem && (
            <div className="space-y-4 pt-1 font-sans text-xs">
              {/* Group Informasi Identitas dengan Stroke (border-slate-200) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 space-y-3">
                {/* Header Instansi */}
                <div className="text-left border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase">
                    Pemerintah Daerah Provinsi Jawa Barat
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Badan Pendapatan Daerah (Bapenda) &bull; {activeDetailItem.samsat}
                  </p>
                </div>

                {/* Rincian Identitas (2 Kolom Sejajar: Label : Value) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                  {/* Kolom Kiri */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Nomor Polisi</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-bold font-mono text-sm text-[#08874f] dark:text-emerald-400">
                        {activeDetailItem.nopol}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Nama Pemilik</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {activeDetailItem.namaPemilik}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Jenis Kendaraan</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {activeDetailItem.jenisKendaraan}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Alamat Kirim</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {activeDetailItem.alamat || "Alamat sesuai KTP Wajib Pajak"} ({activeDetailItem.opsiPengiriman || "Pos Indonesia"})
                      </span>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Nomor Kohir SKKP</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {activeDetailItem.noKohir}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 dark:text-slate-400 font-medium">NIK / No. KTP</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {activeDetailItem.nik}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Kode Bayar / Billing</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {activeDetailItem.kodeBayar}
                      </span>
                    </div>
                    {/* Nomor Resi Pengiriman */}
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 dark:text-slate-400 font-medium">Nomor Resi</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {activeDetailItem.noResi ? (
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            #{activeDetailItem.noResi}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic font-normal text-[11px]">
                            Belum ada resi (belum dikirim)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Rincian Biaya SKKP (Flat HTML Standar, Border Tipis Tegas) */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700">Uraian Pembayaran</th>
                      <th className="py-2.5 px-3 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700">Pajak Kendaraan Bermotor (PKB)</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatRupiah(activeDetailItem.nominalPkb || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700">SWDKLLJ (Jasa Raharja)</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatRupiah(activeDetailItem.nominalSwdkllj || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700">Biaya Cetak & Pengesahan STNK</td>
                      <td className="py-2.5 px-3 text-right font-mono">Rp. 0</td>
                    </tr>
                    <tr className="bg-slate-50/60 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                      <td className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700">TOTAL PEMBAYARAN</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#08874f] dark:text-emerald-400">
                        {formatRupiah(
                          (activeDetailItem.nominalPkb || 0) +
                          (activeDetailItem.nominalSwdkllj || 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section Message Sesuai Gambar: Box Putih Bersih, Icon Biru Solid Info, dan Tanpa Button */}
              {activeDetailItem.statusPengiriman === "DALAM_PENGIRIMAN" || activeDetailItem.statusPengiriman === "DIKIRIM" || activeDetailItem.statusPengiriman === "TERKIRIM" || activeDetailItem.noResi ? (
                <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Info size={14} className="stroke-[2.5]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed font-normal">
                      Dokumen masuk ke proses pengiriman. Petugas dapat melihat dan memantau detail tracking-nya di menu <strong className="font-semibold text-slate-900 dark:text-white">Pengiriman & Tracking SKKP</strong> untuk memantau perjalanan dan status penerimaan berkas secara lengkap.
                    </p>
                  </div>
                </div>
              ) : activeDetailItem.statusCetak === "SUDAH_DICETAK" ? (
                <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#08874f] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed font-normal">
                      Berkas telah dicetak{activeDetailItem.tanggalCetak ? ` pada ${activeDetailItem.tanggalCetak}` : ""}. Silakan lanjutkan dengan tombol 'Siap Kirim' untuk menerbitkan nomor resi logistik. Setelah resi diterbitkan, petugas harus melihat detail tracking-nya di menu <strong className="font-semibold text-slate-900 dark:text-white">Pengiriman & Tracking SKKP</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <AlertTriangle size={13} className="stroke-[2.5]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed font-normal">
                      Berkas Surat Ketetapan Kewajiban Pembayaran belum dicetak. Silakan gunakan tombol 'Cetak SKKP' pada tabel antrean agar berkas dapat dikirim dan dipantau di menu <strong className="font-semibold text-slate-900 dark:text-white">Pengiriman & Tracking SKKP</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PengelolaanCetakPage;

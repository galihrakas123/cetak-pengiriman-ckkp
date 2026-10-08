import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
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
  Calendar,
  AlertTriangle,
  X,
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

  // 2. Query: Fetch Stats
  const { data: stats } = useQuery(
    ["cetak-skkp-stats"],
    () => cetakSkkpService.fetchCetakStats(),
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
          title: "SKKP Berhasil Dikirim!",
          description: `Berkas ${updatedItem.nopol} telah diproses ke kurir ${updatedItem.ekspedisi} (No. Resi: ${updatedItem.noResi}).`,
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

  // Handle Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCurrentIds = paginatedData.map((d) => d.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allCurrentIds])));
    } else {
      const currentIdsSet = new Set(paginatedData.map((d) => d.id));
      setSelectedIds(selectedIds.filter((id) => !currentIdsSet.has(id)));
    }
  };

  // Handle Select Individual
  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Pagination calculation
  const totalItems = cetakList.length;
  const paginatedData = cetakList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isAllCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6 w-full font-sans pb-10">
      {/* Page Header Sesuai Standar Halaman Lain */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 tracking-tight">
            Pengelolaan Cetak SKKP
          </h1>
          <p className="type-body-small text-slate-500 mt-1">
            Daftar lengkap antrean pencetakan fisik Surat Ketetapan Kewajiban Pembayaran yang siap diproses dan dikirimkan
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => batchPrintMutation.mutate(selectedIds)}
              disabled={batchPrintMutation.isLoading}
              className="gap-2"
            >
              <Printer size={13} />
              Cetak Terpilih ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards (Disesuaikan dengan Style Card Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Card 1: Total Permintaan (Solid Gradient Hijau) */}
        <div
          onClick={() => {
            setStatusFilter("ALL");
            setCurrentPage(1);
          }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08874f] to-[#046138] text-white p-5 shadow-xs border border-emerald-700/50 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all cursor-pointer"
        >
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

        {/* Card 2: Belum Dicetak */}
        <div
          onClick={() => {
            setStatusFilter("BELUM_DICETAK");
            setCurrentPage(1);
          }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Belum Dicetak
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {(stats?.belumDicetak ?? 0).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 block group-hover:underline">
              Buka Detail untuk cetak &rarr;
            </span>
          </div>
        </div>

        {/* Card 3: Sudah Dicetak */}
        <div
          onClick={() => {
            setStatusFilter("SUDAH_DICETAK");
            setCurrentPage(1);
          }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
            <span className="text-[11px] text-[#08874f] dark:text-emerald-400 font-medium mt-1 block group-hover:underline">
              Tombol kirim aktif &rarr;
            </span>
          </div>
        </div>

        {/* Card 4: Siap Kirim */}
        <div
          onClick={() => {
            setStatusFilter("SIAP_KIRIM");
            setCurrentPage(1);
          }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Siap Kirim
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Truck size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {(stats?.siapKirim ?? 0).toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Klik 'Siap Kirim' di tabel
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

            {/* Status Cetak Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-xl text-xs px-3 py-2 bg-[#f8f9fa] text-slate-700 outline-none focus:ring-1 focus:ring-[#08874f] cursor-pointer"
            >
              <option value="ALL">Semua Status Cetak</option>
              <option value="BELUM_DICETAK">Belum Dicetak</option>
              <option value="SUDAH_DICETAK">Sudah Dicetak</option>
            </select>

            {/* Samsat Asal Filter */}
            <select
              value={samsatFilter}
              onChange={(e) => {
                setSamsatFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-xl text-xs px-3 py-2 bg-[#f8f9fa] text-slate-700 outline-none focus:ring-1 focus:ring-[#08874f] cursor-pointer"
            >
              <option value="ALL">Semua Samsat</option>
              <option value="Bandung">Samsat Bandung</option>
              <option value="Bekasi">Samsat Bekasi</option>
              <option value="Bogor">Samsat Bogor</option>
              <option value="Cirebon">Samsat Cirebon</option>
              <option value="Tasikmalaya">Samsat Tasikmalaya</option>
            </select>
          </div>
        </div>

        {/* Tabel Data Cetak SKKP dengan Header Hijau Khas Bapenda */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 w-full shadow-xs">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr>
                  <th className="py-3 px-3 w-10 text-center border-r border-white/20">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#08874f] focus:ring-[#08874f] cursor-pointer"
                      title="Pilih Semua Halaman Ini"
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
              <tbody className="divide-y divide-slate-100 bg-white">
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
                    const isSelected = selectedIds.includes(row.id);
                    const isSudahDicetak = row.statusCetak === "SUDAH_DICETAK";
                    const isSudahDikirim = row.statusPengiriman === "DIKIRIM";

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(row.id)}
                            className="rounded border-slate-300 text-[#08874f] focus:ring-[#08874f] cursor-pointer"
                          />
                        </td>

                        {/* 1. No */}
                        <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500">
                          {rowNumber}
                        </td>

                        {/* 2. No. Polisi (Format Hijau Khas Halaman Pengiriman) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-[#08874f] font-mono text-xs">
                            {row.nopol}
                          </div>
                          {row.noKohir && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {row.noKohir}
                            </div>
                          )}
                        </td>

                        {/* 3. Nama Pemilik */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">
                            {row.namaPemilik}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="truncate max-w-[220px]">
                              {row.jenisKendaraan || "Kendaraan Bermotor"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {row.samsat}
                          </div>
                        </td>

                        {/* 4. Ekspedisi (Dipilih dari Aplikasi Sambara) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{row.ekspedisi || row.opsiPengiriman || "-"}</span>
                          </div>
                        </td>

                        {/* 5. Tanggal Pengajuan */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-700 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {row.tanggalPengajuan}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            e-Samsat Online
                          </div>
                        </td>

                        {/* 5. Status Cetak (Badge Shadcn UI) */}
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
                          {isSudahDicetak && row.tanggalCetak && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Dicetak: {row.tanggalCetak}
                            </div>
                          )}

                          {/* Status Pengiriman Badge jika sudah dikirim */}
                          {isSudahDikirim && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                <Truck className="w-2.5 h-2.5" />
                                Terkirim: {row.noResi}
                              </span>
                            </div>
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

                            {/* BUTTON 2: CETAK SKKP (jika belum cetak) / SIAP KIRIM (jika sudah cetak) */}
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
                            ) : (
                              <Button
                                size="sm"
                                variant={!isSudahDikirim ? "primary" : "secondary"}
                                onClick={() => handleKirimSKKPDirect(row)}
                                disabled={isSudahDikirim || prosesKirimMutation.isLoading}
                                className={cn(
                                  "gap-1.5",
                                  isSudahDikirim && "opacity-60 cursor-not-allowed"
                                )}
                                title={
                                  isSudahDikirim
                                    ? "Berkas SKKP sudah diproses ke kurir logistik"
                                    : "Klik untuk langsung menandai berkas ini Siap Kirim ke kurir"
                                }
                              >
                                {isSudahDikirim ? (
                                  <>
                                    <Check size={13} className="text-blue-600" />
                                    Terkirim
                                  </>
                                ) : (
                                  <>
                                    <Send size={13} />
                                    Siap Kirim
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span className="text-sm font-medium text-slate-600">
                          Tidak ada data pengajuan cetak yang ditemukan.
                        </span>
                        <span className="text-xs text-slate-400">
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
        <DialogContent className="max-w-2xl p-6 sm:p-7 bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="p-0 text-left">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-left">
                  Detail Berkas SKKP
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 text-left mt-0.5">
                  Rincian Surat Ketetapan Kewajiban Pembayaran Pajak Kendaraan Bermotor
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup Dialog"
              >
                <X size={18} />
              </button>
            </div>
          </DialogHeader>

          {activeDetailItem && (
            <div className="space-y-4 pt-1 font-sans text-xs">
              {/* Group Informasi Identitas dengan Stroke (border-slate-200) */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                {/* Header Instansi */}
                <div className="text-left border-b border-slate-100 pb-2.5">
                  <h4 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
                    Pemerintah Daerah Provinsi Jawa Barat
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Badan Pendapatan Daerah (Bapenda) &bull; {activeDetailItem.samsat}
                  </p>
                </div>

                {/* Rincian Identitas (2 Kolom Sejajar: Label : Value) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                  {/* Kolom Kiri */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 font-medium">Nomor Polisi</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-bold font-mono text-sm text-[#08874f]">
                        {activeDetailItem.nopol}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 font-medium">Nama Pemilik</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-semibold text-slate-900">
                        {activeDetailItem.namaPemilik}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 font-medium">Jenis Kendaraan</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="text-slate-800">
                        {activeDetailItem.jenisKendaraan}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-32 shrink-0 text-slate-600 font-medium">Alamat Kirim</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="text-slate-800">
                        {activeDetailItem.alamat || "Alamat sesuai KTP Wajib Pajak"} ({activeDetailItem.opsiPengiriman || "Pos Indonesia"})
                      </span>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 font-medium">Nomor Kohir SKKP</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono text-slate-800">
                        {activeDetailItem.noKohir}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 font-medium">NIK / No. KTP</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono text-slate-800">
                        {activeDetailItem.nik}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 shrink-0 text-slate-600 font-medium">Kode Bayar / Billing</span>
                      <span className="text-slate-400 mr-2">:</span>
                      <span className="font-mono font-semibold text-emerald-700">
                        {activeDetailItem.kodeBayar}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Rincian Biaya SKKP (Flat HTML Standar, Border Tipis Tegas) */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white font-semibold text-slate-800">
                      <th className="py-2.5 px-3 border-r border-slate-200">Uraian Pembayaran</th>
                      <th className="py-2.5 px-3 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200">Pajak Kendaraan Bermotor (PKB)</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatRupiah(activeDetailItem.nominalPkb || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200">SWDKLLJ (Jasa Raharja)</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatRupiah(activeDetailItem.nominalSwdkllj || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200">Biaya Cetak & Pengesahan STNK</td>
                      <td className="py-2.5 px-3 text-right font-mono">Rp. 0</td>
                    </tr>
                    <tr className="bg-slate-50/60 font-bold text-slate-900 border-t border-slate-200">
                      <td className="py-2.5 px-3 border-r border-slate-200">TOTAL PEMBAYARAN</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#08874f]">
                        {formatRupiah(
                          (activeDetailItem.nominalPkb || 0) +
                            (activeDetailItem.nominalSwdkllj || 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section Message Sesuai Desain Gambar Referensi (White Card + Solid Icon) */}
              <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                {activeDetailItem.statusCetak === "SUDAH_DICETAK" ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-amber-500">
                    <AlertTriangle className="w-5 h-5 fill-amber-500 text-white" />
                  </div>
                )}
                <div className="flex-1 text-left">
                  <h5 className="text-xs font-semibold text-slate-900">
                    Status: {activeDetailItem.statusCetak === "SUDAH_DICETAK" ? "Sudah Dicetak Resmi" : "Belum Dicetak"}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {activeDetailItem.statusCetak === "SUDAH_DICETAK"
                      ? `Berkas telah dicetak${activeDetailItem.tanggalCetak ? ` pada ${activeDetailItem.tanggalCetak}` : ""}. Lembar SKKP siap diproses ke logistik pengiriman kurir.`
                      : "Berkas Surat Ketetapan Kewajiban Pembayaran belum dicetak. Silakan gunakan tombol 'Cetak SKKP' pada tabel antrean untuk mencetak lembar SKKP."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PengelolaanCetakPage;

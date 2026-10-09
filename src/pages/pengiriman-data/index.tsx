import React, { useState, useEffect } from "react";
import { 
  Eye,
  Mail,
  FileText,
  User,
  MapPin,
  Check,
  Layers,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Searchbar } from "@/components/ui/searchbar";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { getAllDeliveries } from "@/services/mockData";
import { DeliveryRecord, DeliveryStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";
import { DatePicker } from "@/components/features/date/DatePicker";
import { SearchableSelect } from "@/components/features/select/SearchableSelect";
import { format } from "date-fns";

const PengirimanDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => [...getAllDeliveries()]);

  // Sinkronkan data pengiriman saat komponen dimount atau dibuka
  useEffect(() => {
    setDeliveries([...getAllDeliveries()]);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Statistik Dinamis untuk 5 Card Ringkasan Status
  const baseStatsData = deliveries;

  const totalPengirimanCount = baseStatsData.length;
  const totalMenungguCount = baseStatsData.filter((d) => d.status === "PENDING").length;
  const totalProsesCount = baseStatsData.filter((d) => d.status === "DALAM_PROSES").length;
  const totalTerkirimCount = baseStatsData.filter((d) => d.status === "TERKIRIM").length;
  const totalReturCount = baseStatsData.filter((d) => d.status === "RETUR").length;

  const formattedDateIso = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const formattedDateId = selectedDate ? format(selectedDate, "dd-MM-yyyy") : null;

  const filteredData = deliveries.filter((item) => {
    const matchSearch =
      item.noResi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaWp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamatWp.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchDate =
      !selectedDate ||
      (item.tanggalKirim &&
        (item.tanggalKirim.includes(formattedDateIso!) ||
          item.tanggalKirim.includes(formattedDateId!)));

    return matchSearch && matchStatus && matchDate;
  });

  const totalItems = filteredData.length;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "TERKIRIM":
        return <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5">Terkirim</Badge>;
      case "DALAM_PROSES":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] px-2.5 py-0.5">Dalam Perjalanan</Badge>;
      case "RETUR":
        return <Badge className="bg-[#dc2626] hover:bg-[#991b1b] text-white font-medium text-[11px] px-2.5 py-0.5">Retur / Gagal</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-[11px] px-2.5 py-0.5">Menunggu Pengambilan</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 dark:text-white tracking-tight">Pengiriman & Tracking SKKP</h1>
          <p className="type-body-small text-slate-500 dark:text-slate-400 mt-1">
            Daftar lengkap distribusi berkas SKKP dan pelacakan status pengiriman ke wajib pajak
          </p>
        </div>
      </div>

      {/* 5 Kartu KPI Ringkasan Status Pengiriman (Seragam dengan Menu Cetak SKKP & Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {/* Card 1: Total Pengiriman */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08874f] to-[#046138] text-white p-5 shadow-xs border border-emerald-700/50 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Total Pengiriman
            </p>
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <Layers size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {totalPengirimanCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-emerald-100 font-medium mt-1 block">
              Total berkas distribusi
            </span>
          </div>
        </div>

        {/* Card 2: Menunggu Pengambilan */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Menunggu Pengambilan
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Clock size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalMenungguCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Berkas siap dijemput kurir
            </span>
          </div>
        </div>

        {/* Card 3: Dalam Perjalanan */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dalam Perjalanan
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Truck size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalProsesCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Berkas dalam kurir logistik
            </span>
          </div>
        </div>

        {/* Card 4: Terkirim */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Terkirim
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalTerkirimCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Sukses diterima wajib pajak
            </span>
          </div>
        </div>

        {/* Card 5: Retur / Gagal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Retur / Gagal
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <AlertCircle size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalReturCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Pengiriman gagal / retur
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 md:p-6 space-y-4 w-full">
        {/* Filters & Search Toolbar with New Searchbar Component */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full pb-2">
          <Searchbar
            placeholder="Pencarian no. resi, nopol, atau nama..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            containerClassName="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Date Picker Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">
                Tanggal:
              </span>
              <div className="w-full sm:w-44">
                <DatePicker
                  value={selectedDate}
                  onChangeDate={(d) => {
                    setSelectedDate(d);
                    setCurrentPage(1);
                  }}
                  placeholder="Pilih Tanggal"
                  buttonClassName="h-[38px] text-xs py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">
                Status:
              </span>
              <div className="w-52 sm:w-56">
                <SearchableSelect
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  enableSearch={false}
                  options={[
                    { value: "ALL", label: "Semua Status" },
                    { value: "PENDING", label: "Menunggu Pengambilan" },
                    { value: "DALAM_PROSES", label: "Dalam Perjalanan" },
                    { value: "TERKIRIM", label: "Terkirim" },
                    { value: "RETUR", label: "Retur / Gagal" },
                  ]}
                  placeholder="Pilih Status"
                  buttonClassName="h-[38px] text-xs py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Tombol Reset Filter */}
            {(searchTerm || statusFilter !== "ALL" || selectedDate) && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setSelectedDate(undefined);
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Data Table with Green Header */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-700 w-full shadow-xs bg-white dark:bg-slate-900">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr className="border-b border-emerald-800 dark:border-slate-700">
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    No. Resi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    No. Polisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Wajib Pajak
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Alamat Penerima
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Samsat Asal
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Ekspedisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/60 whitespace-nowrap">
                    Tanggal Kirim
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-r border-white/60 whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-center w-20 whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row: DeliveryRecord) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors border-b border-slate-200 dark:border-slate-700">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                        {row.noResi}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#08874f] dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">
                        {row.noPolisi}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-100 font-medium border-r border-slate-200 dark:border-slate-700">
                        {row.namaWp}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate border-r border-slate-200 dark:border-slate-700">
                        {row.alamatWp}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                        {row.samsat}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                        {row.ekspedisi}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                        {row.tanggalKirim}
                      </td>
                      <td className="py-3.5 px-4 text-center border-r border-slate-200 dark:border-slate-700">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button 
                          variant="tertiary" 
                          size="sm" 
                          className="h-7 w-7 p-0 hover:bg-[#e1f0e8] dark:hover:bg-slate-800 text-[#08874f] dark:text-emerald-400"
                          onClick={() => navigate(`/pengiriman/tracking?resi=${row.noResi}`)}
                          title="Lihat Detail & Tracking"
                        >
                          <Eye size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 dark:text-slate-500">
                      Tidak ada data pengiriman yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Full-Width Pagination Bar */}
          <CustomTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>

      {/* Modal Dialog Form Tambah Kiriman (Showcasing Input Field States & Design Tokens) */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-4 flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-left">
                Tambah Kiriman SKKP Baru
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 text-left mt-0.5">
                Isi data berkas ketetapan pajak berikut untuk memulai pelacakan pengiriman
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Dialog"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3.5 py-1">
            <Input
              label="Nomor Resi SKKP"
              placeholder="Contoh: SKKP-2026-009988"
              defaultValue="SKKP-2026-009988"
              prefixIcon={<Mail size={16} />}
            />

            <Input
              label="Nomor Polisi Kendaraan"
              placeholder="Contoh: D 1234 XYZ"
              prefixIcon={<FileText size={16} />}
              suffixIcon={<Check size={16} />}
            />

            <Input
              label="Nama Lengkap Wajib Pajak"
              placeholder="Nama pemilik sesuai STNK/KTP"
              prefixIcon={<User size={16} />}
            />

            <Input
              label="Alamat Tujuan Pengiriman"
              placeholder="Alamat lengkap penerima SKKP"
              prefixIcon={<MapPin size={16} />}
            />

            <Input
              disabled
              label="Kode Wilayah Samsat (Terkunci)"
              defaultValue="Samsat Kota Bandung"
              prefixIcon={<Mail size={16} />}
            />

            <Input
              isError
              errorMessage="Format nomor kontak tidak valid"
              label="Nomor Kontak Alternatif (Contoh Error State)"
              defaultValue="0812-INVALID"
              prefixIcon={<Mail size={16} />}
            />
          </div>

          {/* Tombol Aksi Full Width 2 Button Sesuai Gambar Referensi (Tanpa Icon Simpan) */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="w-full h-11 border border-[#08874f] bg-white dark:bg-slate-900 text-[#08874f] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-sm rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PengirimanDataPage;

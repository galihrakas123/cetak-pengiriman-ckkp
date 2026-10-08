import React, { useState } from "react";
import { 
  Filter, 
  Eye,
  Mail,
  FileText,
  User,
  MapPin,
  Check,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Searchbar } from "@/components/ui/searchbar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { getAllDeliveries } from "@/services/mockData";
import { DeliveryRecord, DeliveryStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";

const PengirimanDataPage: React.FC = () => {
  const navigate = useNavigate();
  const allDeliveries = getAllDeliveries();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [samsatFilter, setSamsatFilter] = useState("ALL");

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredData = allDeliveries.filter((item) => {
    const matchSearch =
      item.noResi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaWp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamatWp.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchSamsat = samsatFilter === "ALL" || item.samsat.includes(samsatFilter);

    return matchSearch && matchStatus && matchSamsat;
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
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-[11px] px-2.5 py-0.5">Menunggu Kirim</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 dark:text-white tracking-tight">Pengiriman & Tracking SKKP</h1>
          <p className="type-body-small text-slate-500 dark:text-slate-400 mt-1">
            Daftar lengkap distribusi berkas SKKP dan pelacakan status pengiriman ke wajib pajak
          </p>
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

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-[#08874f] dark:text-emerald-400" />
            
            <div className="relative">
              <select
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">Semua Status</option>
                <option value="TERKIRIM">Terkirim</option>
                <option value="DALAM_PROSES">Dalam Perjalanan</option>
                <option value="PENDING">Menunggu Kirim</option>
                <option value="RETUR">Retur / Gagal</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
                value={samsatFilter}
                onChange={(e) => {
                  setSamsatFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">Semua Samsat</option>
                <option value="Bandung">Samsat Bandung</option>
                <option value="Bogor">Samsat Bogor</option>
                <option value="Bekasi">Samsat Bekasi</option>
                <option value="Cirebon">Samsat Cirebon</option>
                <option value="Karawang">Samsat Karawang</option>
                <option value="Tasikmalaya">Samsat Tasikmalaya</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Data Table with Green Header */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-700 w-full shadow-xs bg-white dark:bg-slate-900">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08874f] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    No. Resi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    No. Polisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Wajib Pajak
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Alamat Penerima
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Samsat Asal
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Ekspedisi
                  </th>
                  <th className="py-3 px-4 font-semibold border-r border-white/20 whitespace-nowrap">
                    Tanggal Kirim
                  </th>
                  <th className="py-3 px-4 font-semibold text-center border-r border-white/20 whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-center w-20 whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row: DeliveryRecord) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-100">
                        {row.noResi}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#08874f] dark:text-emerald-400">
                        {row.noPolisi}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-100 font-medium">
                        {row.namaWp}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {row.alamatWp}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {row.samsat}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {row.ekspedisi}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {row.tanggalKirim}
                      </td>
                      <td className="py-3.5 px-4 text-center">
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
        <DialogContent className="max-w-xl bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <DialogTitle className="type-title-large text-slate-900 font-bold">
              Tambah Kiriman SKKP Baru
            </DialogTitle>
            <DialogDescription className="type-body-small text-slate-500">
              Isi data berkas ketetapan pajak berikut untuk memulai pelacakan pengiriman.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
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

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Simpan Data Kiriman
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PengirimanDataPage;

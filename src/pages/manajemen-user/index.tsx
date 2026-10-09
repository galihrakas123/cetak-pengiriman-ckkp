import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import MainCard from "@/components/card/MainCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Searchbar } from "@/components/ui/searchbar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";
import { SearchableSelect } from "@/components/features/select/SearchableSelect";
import {
  userService,
  UserRecord,
  DAFTAR_WILAYAH_JABAR,
} from "@/services/userService";
import { cn } from "@/lib/utils";

const ManajemenUserPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(() => userService.getAllUsers());

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [wilayahFilter, setWilayahFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog State: Create / Edit User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    surname: "",
    kodeWilayah: "",
    kodeWilayahKerja: "",
    role: "PETUGAS" as UserRecord["role"],
    noWhatsapp: "",
    email: "",
    status: "AKTIF" as UserRecord["status"],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dialog State: Delete Confirmation (Gambar 1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

  // Dialog State: Detail & Ubah Pengguna
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailUser, setSelectedDetailUser] = useState<UserRecord | null>(null);

  // Dialog State: Konfirmasi Penyimpanan (Gambar 1)
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [saveActionType, setSaveActionType] = useState<"ADD" | "EDIT">("ADD");

  // Dialog State: Feedback Sukses & Gagal (Gambar 1)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Data berhasil disimpan.");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Opsi Dropdown SearchableSelect (Gambar 2)
  const wilayahOptions = DAFTAR_WILAYAH_JABAR.map((w) => ({
    value: w.kode,
    label: `${w.kode} - ${w.samsat.toUpperCase()}`,
  }));

  const roleOptions = [
    { value: "PETUGAS", label: "Petugas P3DW" },
    { value: "ADMIN", label: "Admin Sistem" },
  ];

  // Sinkronkan data dari database saat dibuka
  const refreshUsers = () => {
    setUsers(userService.getAllUsers());
  };

  // Statistik Ringkasan (Menyesuaikan dengan Kolom Tabel: Name, Nm Role)
  const totalUsersCount = users.length;
  const totalPetugasCount = users.filter((u) => u.role === "PETUGAS").length;
  const totalAdminCount = users.filter((u) => u.role === "ADMIN").length;

  // Filter Data: User bisa search berdasarkan username saja
  const filteredUsers = users.filter((u) => {
    const userUsername = (u.username || u.email?.split("@")[0] || u.id).toLowerCase();
    const matchSearch = userUsername.includes(searchTerm.trim().toLowerCase());

    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchWilayah = wilayahFilter === "ALL" || u.kodeWilayah === wilayahFilter;

    return matchSearch && matchRole && matchWilayah;
  });

  const totalItems = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Buka Modal Tambah User
  const handleOpenAddModal = () => {
    setFormData({
      username: "",
      surname: "",
      kodeWilayah: "",
      kodeWilayahKerja: "",
      role: "PETUGAS",
      noWhatsapp: "",
      email: "",
      status: "AKTIF",
    });
    setFormErrors({});
    setIsUserModalOpen(true);
  };

  // Buka Modal Detail Pengguna
  const handleOpenDetailModal = (user: UserRecord) => {
    setSelectedDetailUser(user);
    setFormData({
      username: user.username || user.email?.split("@")[0] || user.id.toLowerCase(),
      surname: user.surname || user.nama,
      kodeWilayah: user.kodeWilayah || "3273",
      kodeWilayahKerja: user.kodeWilayahKerja || user.namaWilayah || "Samsat Kota Bandung I Pajajaran",
      role: (user.role === "ADMIN" ? "ADMIN" : "PETUGAS") as UserRecord["role"],
      noWhatsapp: user.noTelepon || "",
      email: user.email,
      status: user.status,
    });
    setFormErrors({});
    setIsDetailModalOpen(true);
  };

  // Buka Modal Hapus Pengguna (Menampilkan Konfirmasi Penghapusan)
  const handleOpenDeleteModal = (user: UserRecord) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Pra-simpan Perubahan dari Modal Detail (Buka Modal Konfirmasi Penyimpanan)
  const handlePreSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailUser) return;
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) errors.username = "Username wajib diisi";
    if (!formData.surname.trim()) errors.surname = "Surname wajib diisi";
    if (!formData.kodeWilayah) errors.kodeWilayah = "Wilayah wajib dipilih";
    if (!formData.role) errors.role = "Role wajib dipilih";
    // No Whatsapp dan Email bersifat opsional (tidak wajib)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Format email tidak valid";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaveActionType("EDIT");
    setIsConfirmSaveOpen(true);
  };

  // Pra-simpan Tambah User Baru (Buka Modal Konfirmasi Penyimpanan)
  const handlePreSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) errors.username = "Username wajib diisi";
    if (!formData.surname.trim()) errors.surname = "Surname wajib diisi";
    if (!formData.kodeWilayah) errors.kodeWilayah = "Wilayah wajib dipilih";
    if (!formData.role) errors.role = "Role wajib dipilih";
    // No Whatsapp dan Email bersifat opsional (tidak wajib)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Format email tidak valid";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaveActionType("ADD");
    setIsConfirmSaveOpen(true);
  };

  // Eksekusi Simpan setelah user menekan "Ya, simpan data" pada Modal Konfirmasi
  const handleExecuteSave = () => {
    const namaLengkap = formData.surname.trim() || formData.username.trim();
    const wilayahObj = DAFTAR_WILAYAH_JABAR.find((w) => w.kode === formData.kodeWilayah);
    const namaWilayah = wilayahObj ? wilayahObj.samsat : "Samsat Wilayah Jabar";

    if (saveActionType === "ADD") {
      try {
        userService.createUser({
          nama: namaLengkap,
          noTelepon: formData.noWhatsapp.trim(),
          kodeWilayah: formData.kodeWilayah,
          namaWilayah,
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
          password: "1", // Default password 1 otomatis
          username: formData.username.trim(),
          surname: formData.surname.trim(),
          kodeWilayahKerja: namaWilayah,
        });
        setIsConfirmSaveOpen(false);
        setIsUserModalOpen(false);
        setSuccessMessage("Data berhasil disimpan.");
        setIsSuccessModalOpen(true);
        refreshUsers();
      } catch (err: any) {
        setIsConfirmSaveOpen(false);
        setErrorMessage(err?.message || "Terjadi kesalahan saat memproses data.");
        setIsErrorModalOpen(true);
      }
    } else {
      if (!selectedDetailUser) return;
      try {
        const updated = userService.updateUser(selectedDetailUser.id, {
          nama: namaLengkap,
          noTelepon: formData.noWhatsapp.trim(),
          kodeWilayah: formData.kodeWilayah,
          namaWilayah,
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
          username: formData.username.trim(),
          surname: formData.surname.trim(),
          kodeWilayahKerja: namaWilayah,
        });
        setSelectedDetailUser(updated);
        setIsConfirmSaveOpen(false);
        setIsDetailModalOpen(false);
        setSuccessMessage("Data berhasil disimpan.");
        setIsSuccessModalOpen(true);
        refreshUsers();
      } catch (err: any) {
        setIsConfirmSaveOpen(false);
        setErrorMessage(err?.message || "Terjadi kesalahan saat menyimpan data.");
        setIsErrorModalOpen(true);
      }
    }
  };

  // Eksekusi Hapus setelah user menekan "Ya, Hapus Sekarang" pada Modal Konfirmasi Penghapusan
  const handleExecuteDelete = () => {
    if (!userToDelete) return;
    try {
      userService.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setSuccessMessage("Data berhasil dihapus.");
      setIsSuccessModalOpen(true);
      refreshUsers();
    } catch (err: any) {
      setIsDeleteModalOpen(false);
      setErrorMessage(err?.message || "Terjadi kesalahan saat menghapus data.");
      setIsErrorModalOpen(true);
    }
  };


  return (
    <div className="space-y-6 w-full font-sans pb-10">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline-medium text-slate-800 dark:text-white tracking-tight">
            Manajemen User
          </h1>
          <p className="type-body-small text-slate-500 dark:text-slate-400 mt-1">
            Kelola data akun pengguna, peran otorisasi, wilayah penugasan Samsat, dan pengaturan kredensial/reset password
          </p>
        </div>

        {/* Tombol Tambah User Baru */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={handleOpenAddModal}
            variant="primary"
            className="gap-2 px-4 shadow-sm font-semibold"
          >
            <UserPlus size={16} />
            Tambah User Baru
          </Button>
        </div>
      </div>

      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {/* Card 1: Total Pengguna */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08874f] to-[#046138] text-white p-5 shadow-xs border border-emerald-700/50 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Total Pengguna
            </p>
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <Users size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {totalUsersCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-emerald-100 font-medium mt-1 block">
              Total Name & Username terdaftar
            </span>
          </div>
        </div>

        {/* Card 2: Petugas P3DW (Nm Role) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Petugas P3DW
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Users size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalPetugasCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Nm Role operasional Samsat
            </span>
          </div>
        </div>

        {/* Card 3: Admin Sistem (Nm Role) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Admin Sistem
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalAdminCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Nm Role administrator sistem
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <MainCard
        title="Daftar Pengguna Sistem SKKP"
        subtitle="Manajemen akun resmi petugas Bapenda dan Samsat Jawa Barat"
        action={
          <div className="flex items-center gap-2">
            {(searchTerm || roleFilter !== "ALL" || wilayahFilter !== "ALL") && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("ALL");
                  setWilayahFilter("ALL");
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
        {/* Toolbar Pencarian & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full pb-2">
          <Searchbar
            placeholder="Cari berdasarkan username..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            containerClassName="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter Role (Hanya 2 Role: ADMIN & PETUGAS) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">
                Role:
              </span>
              <div className="w-40 sm:w-44">
                <SearchableSelect
                  value={roleFilter}
                  onChange={(val) => {
                    setRoleFilter(val);
                    setCurrentPage(1);
                  }}
                  enableSearch={false}
                  options={[
                    { value: "ALL", label: "Semua Role" },
                    { value: "ADMIN", label: "Admin Sistem" },
                    { value: "PETUGAS", label: "Petugas P3DW" },
                  ]}
                  placeholder="Pilih Role"
                  buttonClassName="h-[38px] text-xs py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Filter Wilayah */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 shrink-0">
                Wilayah:
              </span>
              <div className="w-48 sm:w-56">
                <SearchableSelect
                  value={wilayahFilter}
                  onChange={(val) => {
                    setWilayahFilter(val);
                    setCurrentPage(1);
                  }}
                  align="right"
                  enableSearch={true}
                  searchPlaceholder="Cari Wilayah..."
                  options={[
                    { value: "ALL", label: "Semua Wilayah" },
                    ...DAFTAR_WILAYAH_JABAR.map((w) => ({
                      value: w.kode,
                      label: `${w.kode} - ${w.samsat}`,
                    })),
                  ]}
                  placeholder="Pilih Wilayah"
                  buttonClassName="h-[38px] text-xs py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  popoverClassName="w-64 sm:w-72 right-0 left-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Data Pengguna */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-2xs mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#08874f] text-white font-semibold tracking-wide border-b border-emerald-800 dark:border-slate-700 text-xs">
                <th className="py-3.5 px-4 text-left border-r border-white/60">
                  Name
                </th>
                <th className="py-3.5 px-4 text-left border-r border-white/60">
                  Username
                </th>
                <th className="py-3.5 px-4 text-left border-r border-white/60">
                  Kd Wil
                </th>
                <th className="py-3.5 px-4 text-left border-r border-white/60">
                  Kd Wil Kerja
                </th>
                <th className="py-3.5 px-4 text-left border-r border-white/60">
                  Nm Role
                </th>
                <th className="py-3.5 px-4 text-center w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="stroke-[1.5] text-slate-300 dark:text-slate-600" />
                      <p className="font-medium text-xs">Tidak ada data pengguna yang sesuai dengan filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-200 dark:border-slate-700"
                    >
                      {/* 1. Name */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          {user.surname || user.nama}
                        </div>
                      </td>

                      {/* 2. Username */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700">
                        <span className="font-medium text-slate-800 dark:text-slate-200 font-mono text-xs">
                          {user.username || user.email?.split("@")[0] || user.id.toLowerCase()}
                        </span>
                      </td>

                      {/* 3. Kd Wil */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="font-medium text-slate-900 dark:text-white text-xs">
                          {user.kodeWilayah}
                        </div>
                      </td>

                      {/* 4. Kd Wil Kerja */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="font-medium text-slate-900 dark:text-white leading-tight">
                          {user.kodeWilayahKerja || user.namaWilayah}
                        </div>
                      </td>

                      {/* 5. Nm Role */}
                      <td className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="font-medium text-slate-900 dark:text-white text-xs">
                          {user.role === "ADMIN" ? "Admin Sistem" : "Petugas P3DW"}
                        </div>
                      </td>

                      {/* 6. Aksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="w-20 sm:w-24 h-8 rounded-lg border border-[#08874f] dark:border-emerald-500 bg-white dark:bg-slate-900 hover:bg-emerald-50/70 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs mx-auto focus:outline-none focus:ring-2 focus:ring-[#08874f]/30"
                              title="Pilih Aksi"
                            >
                              <ChevronDown size={16} className="text-[#08874f] dark:text-emerald-400 stroke-[2.5]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-1.5 z-50 pointer-events-auto"
                          >
                            <DropdownMenuItem
                              onClick={() => handleOpenDetailModal(user)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors focus:bg-slate-100 dark:focus:bg-slate-800"
                            >
                              <Pencil size={14} className="text-slate-500 dark:text-slate-400 shrink-0 stroke-[2.2]" />
                              <span>Detail</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteModal(user)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors focus:bg-rose-50 dark:focus:bg-rose-950/40"
                            >
                              <Trash2 size={14} className="text-rose-600 dark:text-rose-400 shrink-0 stroke-[2.2]" />
                              <span>Hapus</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <CustomTablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </MainCard>

      {/* =========================================================================
          MODAL 1: TAMBAH USER (Persis Gambar Referensi + Garis Batas Bawah)
         ========================================================================= */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-3xl lg:max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
          {/* Header Dialog Sesuai Referensi Gambar + Garis Batas Bawah */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-4 flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-left">
                Tambah User
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 text-left mt-0.5">
                Formulir pendaftaran akun pengguna baru sistem Bapenda Jabar
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Dialog"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handlePreSaveUser} className="space-y-4">
            {/* Form Fields: Grid 2 Kolom Rapi & Simetris (Tanpa Jenis Layanan & Tanpa Input Password) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1, Col 1: Username */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan Username"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.username && "border-rose-500"
                  )}
                />
                {formErrors.username && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.username}</p>
                )}
              </div>

              {/* Row 1, Col 2: Surname */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Surname <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  placeholder="Masukkan Surname"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.surname && "border-rose-500"
                  )}
                />
                {formErrors.surname && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.surname}</p>
                )}
              </div>

              {/* Row 2, Col 1: Kode Wilayah (Data Banyak -> Ada Search) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Kode Wilayah <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  value={formData.kodeWilayah}
                  onChange={(val) => {
                    const selectedW = DAFTAR_WILAYAH_JABAR.find((w) => w.kode === val);
                    setFormData({
                      ...formData,
                      kodeWilayah: val,
                      kodeWilayahKerja: selectedW ? selectedW.samsat : formData.kodeWilayahKerja,
                    });
                    if (formErrors.kodeWilayah) {
                      setFormErrors((prev) => ({ ...prev, kodeWilayah: "" }));
                    }
                  }}
                  options={wilayahOptions}
                  placeholder="Pilih Wilayah"
                  searchPlaceholder="Pilih Wilayah"
                  enableSearch={true}
                  hasError={!!formErrors.kodeWilayah}
                />
                {formErrors.kodeWilayah && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.kodeWilayah}</p>
                )}
              </div>

              {/* Row 2, Col 2: Role */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Role <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  value={formData.role}
                  onChange={(val) =>
                    setFormData({ ...formData, role: val as UserRecord["role"] })
                  }
                  options={roleOptions}
                  placeholder="Pilih Role"
                  enableSearch={false}
                />
              </div>

              {/* Row 3, Col 1: No Whatsapp (Opsional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  No Whatsapp
                </label>
                <Input
                  type="text"
                  value={formData.noWhatsapp}
                  onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                  placeholder="Masukkan No Whatsapp"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.noWhatsapp && "border-rose-500"
                  )}
                />
                {formErrors.noWhatsapp && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.noWhatsapp}</p>
                )}
              </div>

              {/* Row 3, Col 2: Email (Opsional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Masukkan Email"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.email && "border-rose-500"
                  )}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Tombol Aksi 2 Button Full Width Sesuai Gambar Referensi & Sistem Bapenda (Tanpa Icon Simpan) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="w-full h-11 border border-[#08874f] bg-white dark:bg-slate-900 text-[#08874f] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-sm rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 2: DETAIL USER (Persis Gambar Referensi + Garis Batas Bawah)
         ========================================================================= */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl lg:max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
          {/* Header Dialog Sesuai Referensi Gambar + Garis Batas Bawah */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-4 flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-left">
                Detail User
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 text-left mt-0.5">
                Rincian informasi akun pengguna
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Dialog"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handlePreSaveDetail} className="space-y-4">
            {/* Form Fields: Grid 2 Kolom Rapi & Simetris (Tanpa Jenis Layanan) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1, Col 1: Username */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan Username"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.username && "border-rose-500"
                  )}
                />
                {formErrors.username && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.username}</p>
                )}
              </div>

              {/* Row 1, Col 2: Surname */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Surname <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  placeholder="Masukkan Surname"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.surname && "border-rose-500"
                  )}
                />
                {formErrors.surname && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.surname}</p>
                )}
              </div>

              {/* Row 2, Col 1: Kode Wilayah (Data Banyak -> Ada Search) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Kode Wilayah <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  value={formData.kodeWilayah}
                  onChange={(val) => {
                    const selectedW = DAFTAR_WILAYAH_JABAR.find((w) => w.kode === val);
                    setFormData({
                      ...formData,
                      kodeWilayah: val,
                      kodeWilayahKerja: selectedW ? selectedW.samsat : formData.kodeWilayahKerja,
                    });
                    if (formErrors.kodeWilayah) {
                      setFormErrors((prev) => ({ ...prev, kodeWilayah: "" }));
                    }
                  }}
                  options={wilayahOptions}
                  placeholder="Pilih Wilayah"
                  searchPlaceholder="Pilih Wilayah"
                  enableSearch={true}
                  hasError={!!formErrors.kodeWilayah}
                />
                {formErrors.kodeWilayah && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.kodeWilayah}</p>
                )}
              </div>

              {/* Row 2, Col 2: Role */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Role <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  value={formData.role}
                  onChange={(val) =>
                    setFormData({ ...formData, role: val as UserRecord["role"] })
                  }
                  options={roleOptions}
                  placeholder="Pilih Role"
                  enableSearch={false}
                />
              </div>

              {/* Row 3, Col 1: No Whatsapp (Opsional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  No Whatsapp
                </label>
                <Input
                  type="text"
                  value={formData.noWhatsapp}
                  onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                  placeholder="Masukkan No Whatsapp"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.noWhatsapp && "border-rose-500"
                  )}
                />
                {formErrors.noWhatsapp && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.noWhatsapp}</p>
                )}
              </div>

              {/* Row 3, Col 2: Email (Opsional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Masukkan Email"
                  className={cn(
                    "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    formErrors.email && "border-rose-500"
                  )}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Tombol Aksi 2 Button Full Width Sesuai Gambar Referensi & Sistem Bapenda (Tanpa Icon Simpan) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full h-11 border border-[#08874f] bg-white dark:bg-slate-900 text-[#08874f] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-sm rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      {/* =========================================================================
          MODAL 3: Konfirmasi Penyimpanan (Persis Gambar 1 Kanan Atas)
         ========================================================================= */}
      <Dialog open={isConfirmSaveOpen} onOpenChange={setIsConfirmSaveOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#08874f] tracking-tight">
              Konfirmasi Penyimpanan
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin <strong className="text-slate-900 dark:text-white font-bold">Menyimpan Data Tersebut?</strong>
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsConfirmSaveOpen(false)}
                className="w-full h-11 rounded-lg border border-[#08874f] text-[#08874f] dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              >
                Periksa kembali
              </button>
              <button
                type="button"
                onClick={handleExecuteSave}
                className="w-full h-11 rounded-lg bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Ya, simpan data
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 4: Konfirmasi Penghapusan (Persis Gambar 1 Kanan Bawah)
         ========================================================================= */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-rose-600 tracking-tight">
              Konfirmasi Penghapusan
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin <strong className="text-slate-900 dark:text-white font-bold">Menghapus Data Tersebut?</strong>
              {userToDelete && (
                <span className="block mt-1.5 text-xs text-slate-500 font-mono">
                  ({userToDelete.nama} - {userToDelete.email})
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full h-11 rounded-lg border border-[#08874f] text-[#08874f] dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              >
                Periksa kembali
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="w-full h-11 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 5: Data Berhasil Disimpan / Dihapus (Persis Gambar 1 Kiri Atas)
         ========================================================================= */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="flex flex-col items-center">
            {/* Lingkaran Hijau Besar Icon Checkmark (Gambar 1) */}
            <div className="w-20 h-20 rounded-full bg-[#08874f] text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
              <Check size={42} className="stroke-[3.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {successMessage}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                refreshUsers();
              }}
              className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Ya, saya mengerti
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 6: Data Gagal Disimpan (Persis Gambar 1 Kiri Bawah)
         ========================================================================= */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="flex flex-col items-center">
            {/* Lingkaran Merah Besar Icon X (Gambar 1) */}
            <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20">
              <X size={42} className="stroke-[3.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
              Data gagal disimpan.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono max-w-xs break-words">
              {errorMessage || "Back-end response message"}
            </p>
            <button
              type="button"
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManajemenUserPage;

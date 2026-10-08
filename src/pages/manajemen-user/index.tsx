import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Layers,
  Check,
  X,
  ChevronDown,
  Filter,
  Lock,
  Printer,
  Truck,
  RotateCcw,
  Sparkles
} from "lucide-react";
import MainCard from "@/components/card/MainCard";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomTablePagination } from "@/components/features/table/CustomTablePagination";
import { toast } from "@/hooks/use-toast";
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
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog State: Create / Edit User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    noTelepon: "",
    kodeWilayah: "3273",
    email: "",
    role: "PETUGAS_CETAK" as UserRecord["role"],
    password: "",
    status: "AKTIF" as UserRecord["status"],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dialog State: Reset Password
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedResetUser, setSelectedResetUser] = useState<UserRecord | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);

  // Dialog State: Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

  // Sinkronkan data dari database saat dibuka
  const refreshUsers = () => {
    setUsers(userService.getAllUsers());
  };

  // Statistik Ringkasan
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === "AKTIF").length;
  const totalWilayahCount = new Set(users.map((u) => u.kodeWilayah)).size;
  const totalPetugasCount = users.filter(
    (u) => u.role === "PETUGAS_CETAK" || u.role === "PETUGAS_LOGISTIK"
  ).length;

  // Filter Data
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.noTelepon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.namaWilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.kodeWilayah.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchWilayah = wilayahFilter === "ALL" || u.kodeWilayah === wilayahFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchSearch && matchRole && matchWilayah && matchStatus;
  });

  const totalItems = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper Generate Random Password
  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "Bapenda";
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + "!";
  };

  // Buka Modal Tambah User
  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setFormData({
      nama: "",
      noTelepon: "",
      kodeWilayah: "3273",
      email: "",
      role: "PETUGAS_CETAK",
      password: handleGeneratePassword(),
      status: "AKTIF",
    });
    setFormErrors({});
    setShowPassword(false);
    setIsUserModalOpen(true);
  };

  // Buka Modal Edit User
  const handleOpenEditModal = (user: UserRecord) => {
    setEditingUserId(user.id);
    setFormData({
      nama: user.nama,
      noTelepon: user.noTelepon,
      kodeWilayah: user.kodeWilayah,
      email: user.email,
      role: user.role,
      password: "",
      status: user.status,
    });
    setFormErrors({});
    setIsUserModalOpen(true);
  };

  // Submit Simpan User (Tambah / Edit)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.nama.trim()) errors.nama = "Nama user wajib diisi";
    if (!formData.noTelepon.trim()) errors.noTelepon = "Nomor telepon wajib diisi";
    if (!formData.email.trim()) errors.email = "Email user wajib diisi";
    if (!formData.kodeWilayah) errors.kodeWilayah = "Wilayah penugasan wajib dipilih";
    if (!editingUserId && !formData.password.trim()) {
      errors.password = "Password awal wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const wilayahObj = DAFTAR_WILAYAH_JABAR.find((w) => w.kode === formData.kodeWilayah);
    const namaWilayah = wilayahObj ? wilayahObj.samsat : "Samsat Wilayah Jabar";

    try {
      if (editingUserId) {
        userService.updateUser(editingUserId, {
          nama: formData.nama,
          noTelepon: formData.noTelepon,
          kodeWilayah: formData.kodeWilayah,
          namaWilayah,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        });
        toast({
          title: "Pengguna Berhasil Diperbarui",
          description: `Data pengguna ${formData.nama} berhasil disimpan ke sistem.`,
        });
      } else {
        const newUser = userService.createUser({
          nama: formData.nama,
          noTelepon: formData.noTelepon,
          kodeWilayah: formData.kodeWilayah,
          namaWilayah,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          password: formData.password,
        });
        toast({
          title: "Pengguna Baru Berhasil Dibuat",
          description: `Akun untuk ${newUser.nama} (${newUser.email}) telah aktif.`,
        });
      }

      setIsUserModalOpen(false);
      refreshUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan Data",
        description: err?.message || "Terjadi kesalahan saat memproses data.",
      });
    }
  };

  // Buka Modal Reset Password
  const handleOpenResetModal = (user: UserRecord) => {
    setSelectedResetUser(user);
    const generated = handleGeneratePassword();
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowNewPassword(true);
    setIsResetModalOpen(true);
  };

  // Submit Reset Password
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResetUser) return;

    if (!newPassword.trim()) {
      toast({
        variant: "destructive",
        title: "Password Kosong",
        description: "Password baru tidak boleh kosong.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Konfirmasi Password Berbeda",
        description: "Password baru dan konfirmasi password harus sama.",
      });
      return;
    }

    try {
      userService.resetPassword(selectedResetUser.id, newPassword);
      toast({
        title: "Reset Password Berhasil",
        description: `Password untuk ${selectedResetUser.nama} berhasil diperbarui menjadi: ${newPassword}`,
      });
      setIsResetModalOpen(false);
      refreshUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal Reset Password",
        description: err?.message || "Terjadi kesalahan.",
      });
    }
  };

  // Toggle Status Aktif / Non-aktif
  const handleToggleStatus = (user: UserRecord) => {
    try {
      const updated = userService.toggleStatus(user.id);
      toast({
        title: "Status Pengguna Diubah",
        description: `Akun ${user.nama} sekarang ${updated.status === "AKTIF" ? "Aktif" : "Non-aktif"}.`,
      });
      refreshUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal Mengubah Status",
        description: err?.message,
      });
    }
  };

  // Konfirmasi Hapus User
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    userService.deleteUser(userToDelete.id);
    toast({
      title: "Pengguna Dihapus",
      description: `Akun ${userToDelete.nama} berhasil dihapus dari sistem.`,
    });
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    refreshUsers();
  };

  // Helper Badge Role
  const renderRoleBadge = (role: UserRecord["role"]) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1 shadow-2xs">
            <ShieldCheck size={11} />
            Admin Sistem
          </Badge>
        );
      case "PETUGAS_CETAK":
        return (
          <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1 shadow-2xs">
            <Printer size={11} />
            Petugas Cetak
          </Badge>
        );
      case "PETUGAS_LOGISTIK":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1 shadow-2xs">
            <Truck size={11} />
            Petugas Logistik
          </Badge>
        );
      case "OPERATOR":
        return (
          <Badge className="bg-slate-600 hover:bg-slate-700 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1 shadow-2xs">
            Operator
          </Badge>
        );
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

      {/* 4 KPI Summary Cards (Seragam dengan Cetak SKKP & Pengiriman) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
              Akun pengguna terdaftar
            </span>
          </div>
        </div>

        {/* Card 2: Pengguna Aktif */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pengguna Aktif
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeUsersCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Dapat mengakses sistem
            </span>
          </div>
        </div>

        {/* Card 3: Wilayah Samsat Terdaftar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Wilayah Samsat
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <Building2 size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalWilayahCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Unit pelayanan Samsat aktif
            </span>
          </div>
        </div>

        {/* Card 4: Petugas Operasional */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 flex flex-col justify-between min-h-[140px] hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Petugas Operasional
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#08874f] dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalPetugasCount.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1 block">
              Petugas cetak & ekspedisi
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
            {(searchTerm || roleFilter !== "ALL" || wilayahFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("ALL");
                  setWilayahFilter("ALL");
                  setStatusFilter("ALL");
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
            placeholder="Cari nama, email, nomor telpon, atau wilayah..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            containerClassName="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-[#08874f] dark:text-emerald-400" />

            {/* Filter Role */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Semua Peran / Role</option>
                <option value="ADMIN">Admin Sistem</option>
                <option value="PETUGAS_CETAK">Petugas Cetak</option>
                <option value="PETUGAS_LOGISTIK">Petugas Logistik</option>
                <option value="OPERATOR">Operator</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>

            {/* Filter Wilayah */}
            <div className="relative">
              <select
                value={wilayahFilter}
                onChange={(e) => {
                  setWilayahFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Semua Wilayah</option>
                {DAFTAR_WILAYAH_JABAR.map((w) => (
                  <option key={w.kode} value={w.kode}>
                    {w.kode} - {w.samsat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="NONAKTIF">Non-Aktif</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08874f] dark:text-emerald-400 stroke-[2.2] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Tabel Data Pengguna */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-2xs mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#08874f] text-white font-semibold tracking-wide border-b border-emerald-800">
                <th className="py-3.5 px-4 text-center w-12">No</th>
                <th className="py-3.5 px-4">Pengguna & Peran</th>
                <th className="py-3.5 px-4">Kontak (Email / Telp)</th>
                <th className="py-3.5 px-4">Wilayah Samsat</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Terakhir Login</th>
                <th className="py-3.5 px-4 text-center w-36">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="stroke-[1.5] text-slate-300 dark:text-slate-600" />
                      <p className="font-medium text-xs">Tidak ada data pengguna yang sesuai dengan filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const itemIndex = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      {/* 1. No */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-medium">
                        {itemIndex}
                      </td>

                      {/* 2. Pengguna & Peran */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center font-bold text-[#08874f] dark:text-emerald-400 shrink-0">
                            {user.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-xs">
                              {user.nama}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              {renderRoleBadge(user.role)}
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {user.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Kontak */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                            <Phone size={12} className="text-slate-400 shrink-0" />
                            <span>{user.noTelepon}</span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Wilayah Samsat */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1.5">
                          <Building2 size={13} className="text-[#08874f] dark:text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white leading-tight">
                              {user.namaWilayah}
                            </div>
                            <span className="inline-block mt-0.5 font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                              Kode: {user.kodeWilayah}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {user.status === "AKTIF" ? (
                          <Badge className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-400 hover:bg-slate-500 text-white font-medium text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1">
                            <XCircle size={11} />
                            Non-aktif
                          </Badge>
                        )}
                      </td>

                      {/* 6. Terakhir Login */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {user.terakhirLogin || "-"}
                        </span>
                      </td>

                      {/* 7. Aksi Admin */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleOpenResetModal(user)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 transition-colors"
                            title="Reset Password Pengguna"
                          >
                            <KeyRound size={14} className="stroke-[2.2]" />
                          </button>

                          {/* Tombol Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Edit Data Pengguna"
                          >
                            <Pencil size={14} className="stroke-[2.2]" />
                          </button>

                          {/* Tombol Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={cn(
                              "p-1.5 rounded-lg border transition-colors",
                              user.status === "AKTIF"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#08874f] hover:bg-emerald-100 border-emerald-200/80 dark:border-emerald-800/60"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 border-slate-200 dark:border-slate-700"
                            )}
                            title={user.status === "AKTIF" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          >
                            <RefreshCw size={14} className="stroke-[2.2]" />
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={14} className="stroke-[2.2]" />
                          </button>
                        </div>
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

      {/* MODAL 1: Tambah / Edit User */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="type-title-large text-slate-800 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-[#08874f] dark:text-emerald-400 stroke-[2.2]" />
                {editingUserId ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {editingUserId
                ? "Perbarui informasi profil pengguna dan penugasan wilayah."
                : "Admin wajib mengisi nama, nomor telepon, kode wilayah, email, dan password awal."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
            {/* Field: Nama User */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Nama Lengkap User <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Budi Santoso, S.Kom"
                className={cn(
                  "rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                  formErrors.nama && "border-rose-500 focus:ring-rose-500"
                )}
              />
              {formErrors.nama && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.nama}</p>
              )}
            </div>

            {/* Field: Nomor Telepon & Email (2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Nomor Telepon / WA <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.noTelepon}
                  onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
                  placeholder="0812-3456-7890"
                  className={cn(
                    "rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono",
                    formErrors.noTelepon && "border-rose-500"
                  )}
                />
                {formErrors.noTelepon && (
                  <p className="text-[11px] text-rose-500 font-medium">{formErrors.noTelepon}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Email User <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@bapenda.jabarprov.go.id"
                  className={cn(
                    "rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                    formErrors.email && "border-rose-500"
                  )}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-rose-500 font-medium">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Field: Kode Wilayah User */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Kode Wilayah & Samsat <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">Pilih unit Samsat Jabar</span>
              </label>
              <div className="relative">
                <select
                  value={formData.kodeWilayah}
                  onChange={(e) => setFormData({ ...formData, kodeWilayah: e.target.value })}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] font-medium"
                >
                  {DAFTAR_WILAYAH_JABAR.map((w) => (
                    <option key={w.kode} value={w.kode}>
                      {w.kode} - {w.nama} ({w.samsat})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {formErrors.kodeWilayah && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.kodeWilayah}</p>
              )}
            </div>

            {/* Field: Role & Status Akun (2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Peran / Role Akses
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRecord["role"] })
                    }
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] font-medium"
                  >
                    <option value="PETUGAS_CETAK">Petugas Cetak SKKP</option>
                    <option value="PETUGAS_LOGISTIK">Petugas Logistik / Pengiriman</option>
                    <option value="ADMIN">Admin Sistem</option>
                    <option value="OPERATOR">Operator Samsat</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Status Akun
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as UserRecord["status"] })
                    }
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f] font-medium"
                  >
                    <option value="AKTIF">Aktif (Dapat Login)</option>
                    <option value="NONAKTIF">Non-Aktif (Blokir)</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Field: Password (Hanya wajib saat tambah pengguna baru) */}
            {!editingUserId && (
              <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Lock size={12} className="text-[#08874f]" />
                    Password Awal User <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, password: handleGeneratePassword() })}
                    className="text-[11px] font-semibold text-[#08874f] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} />
                    Buat Acak
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Masukkan password awal"
                    className="rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-[11px] text-rose-500 font-medium">{formErrors.password}</p>
                )}
                <p className="text-[11px] text-slate-400">
                  Password akan diberikan kepada user untuk login awal ke sistem SKKP.
                </p>
              </div>
            )}

            {/* Tombol Aksi Form Full Width 2 Button Sesuai Gambar Referensi */}
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
                className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Check size={16} className="stroke-[3]" />
                {editingUserId ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Reset Password User */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
          <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="type-title-large text-slate-800 dark:text-white flex items-center gap-2">
                <KeyRound size={18} className="text-amber-500 stroke-[2.2]" />
                Reset Password User
              </DialogTitle>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Admin dapat mengatur ulang password akun pengguna yang lupa atau terkunci.
            </DialogDescription>
          </DialogHeader>

          {selectedResetUser && (
            <form onSubmit={handleSaveResetPassword} className="space-y-4 pt-1">
              {/* Box Info Pengguna yang Direset */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nama Pengguna:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedResetUser.nama}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedResetUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Wilayah Samsat:</span>
                  <span className="font-semibold text-[#08874f] dark:text-emerald-400">
                    {selectedResetUser.kodeWilayah} - {selectedResetUser.namaWilayah}
                  </span>
                </div>
              </div>

              {/* Password Baru */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Password Baru <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const gen = handleGeneratePassword();
                      setNewPassword(gen);
                      setConfirmPassword(gen);
                    }}
                    className="text-[11px] font-semibold text-[#08874f] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    Generate Acak
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Ulangi Password Baru <span className="text-rose-500">*</span>
                </label>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className="rounded-xl text-xs h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              {/* Opsi Wajib Ganti Password */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="forceChange"
                  checked={forceChangeNextLogin}
                  onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                  className="rounded border-slate-300 text-[#08874f] focus:ring-[#08874f] cursor-pointer"
                />
                <label htmlFor="forceChange" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  Wajibkan pengguna mengganti password saat login berikutnya
                </label>
              </div>

              {/* Tombol Aksi Reset Password Full Width 2 Button Sesuai Gambar Referensi */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full h-11 border border-[#08874f] bg-white dark:bg-slate-900 text-[#08874f] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-sm rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <KeyRound size={16} />
                  Simpan Password
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Hapus User */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="type-title-large text-rose-600 flex items-center gap-2">
              <Trash2 size={18} />
              Konfirmasi Hapus Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Apakah Anda yakin ingin menghapus akun pengguna{" "}
              <strong className="text-slate-800 dark:text-white">{userToDelete?.nama}</strong> (
              {userToDelete?.email})? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {/* Tombol Aksi Hapus User Full Width 2 Button Sesuai Gambar Referensi */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm rounded-lg transition-all flex items-center justify-center cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Trash2 size={16} />
              Ya, Hapus
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManajemenUserPage;

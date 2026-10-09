import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { userService, UserRecord } from "@/services/userService";
import { toast } from "@/hooks/use-toast";
import { BASE_TITLE } from "@/config";
import { cn } from "@/lib/utils";

const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z.string().min(1, { message: "Kata sandi wajib diisi" }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserRecord[]>([]);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target jika ada previous protected route
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Muat daftar pengguna aktif dari Manajemen User
  useEffect(() => {
    document.title = "Masuk ke Sistem" + BASE_TITLE;
    try {
      const users = userService.getAllUsers();
      setAvailableUsers(users);
    } catch {
      // fallback
    }
  }, []);

  // Autofill cepat untuk akun dari Manajemen User
  const handleQuickFill = (user: UserRecord) => {
    setValue("username", user.username || "");
    setValue("password", user.password || "1");
    setErrorMessage(null);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const loggedUser = await login(data.username, data.password);
      toast({
        title: "Login Berhasil",
        description: `Wilujeung sumping, ${loggedUser.surname || loggedUser.nama || loggedUser.username}!`,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err?.message ||
        "Gagal masuk ke sistem. Silakan periksa kembali username dan kata sandi Anda.";
      setErrorMessage(msg);
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fafbfc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-[#08874f] selection:text-white">
      {/* =========================================================================
          PANEL KIRI: Formulir Login (Sesuai Desain Referensi & Bapenda Design System)
         ========================================================================= */}
      <div className="w-full lg:w-[480px] xl:w-[530px] 2xl:w-[580px] shrink-0 min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between p-8 sm:p-12 xl:p-16 border-r border-slate-100 dark:border-slate-800/80 z-10 shadow-xs">
        {/* 1. Header Atas: Logo Bapenda */}
        <div className="flex items-center">
          <img
            src="/images/logo-login.png"
            alt="Bapenda Jabar"
            className="h-9 sm:h-10 w-auto object-contain"
            onError={(e) => {
              // Fallback gambar jika diperlukan
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* 2. Bagian Tengah: Judul & Formulir Login */}
        <div className="my-auto py-8 w-full max-w-sm mx-auto lg:mx-0">
          {/* Judul & Subjudul */}
          <div className="mb-7 text-left">
            <h1 className="text-2xl sm:text-[28px] font-serif font-bold text-slate-900 dark:text-white leading-[1.3] tracking-tight">
              Wilujeung Sumping di Pengelolaan Cetak &amp; Distribusi SKKP Jawa Barat
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-normal">
              Dashboard Cetak &amp; Distribusi SKKP
            </p>
          </div>

          {/* Alert Error Box */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 animate-in fade-in-50 duration-200 text-left">
              <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            {/* Field: Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan Username"
                disabled={isLoading}
                autoComplete="username"
                {...register("username")}
                className={cn(
                  "w-full h-11 px-3.5 text-xs font-normal rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                  errors.username
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                )}
              />
              {errors.username && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Field: Kata Sandi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 select-none pointer-events-none">
                  <KeyRound size={17} className="stroke-[1.8]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Kata Sandi"
                  disabled={isLoading}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "w-full h-11 pl-10 pr-10 text-xs font-normal rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    errors.password
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#08874f] hover:text-[#06683d] transition-colors cursor-pointer"
                  title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] active:bg-[#046138] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Quick Helper: Akun Demo dari Manajemen User (Collapsible Subtle) */}
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-[11px] text-slate-400 hover:text-[#08874f] transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer font-medium"
            >
              <Sparkles size={12} className="text-amber-500" />
              <span>Gunakan Akun Manajemen User</span>
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", showDemoAccounts && "rotate-180")}
              />
            </button>

            {showDemoAccounts && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 animate-in fade-in duration-200 text-left">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Pilih Akun Demo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Password: <strong className="font-mono text-slate-600 dark:text-slate-300">1</strong>
                  </span>
                </div>

                <div className="space-y-1.5">
                  {availableUsers.slice(0, 3).map((u) => {
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickFill(u)}
                        className="w-full p-2 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 transition-all flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#08874f] transition-colors truncate">
                            {u.surname || u.nama}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            @{u.username} &bull; {u.role}
                          </p>
                        </div>
                        <CheckCircle2
                          size={14}
                          className="text-slate-300 group-hover:text-[#08874f] transition-colors shrink-0 ml-1.5"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Footer Bawah: Dipersembahkan oleh Bapenda */}
        <div className="pt-6 pb-2 text-center space-y-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-normal">
            Dipersembahkan oleh
          </p>
          <div className="flex justify-center items-center">
            <img
              src="/images/logo-bapenda.svg"
              alt="bapenda"
              className="h-5 w-auto opacity-70 filter dark:invert dark:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL KANAN: Area Kosong untuk Ilustrasi (Disiapkan untuk Diisi Pengguna)
         ========================================================================= */}
      <div className="hidden lg:flex flex-1 min-h-screen bg-[#fafbfc] dark:bg-slate-900/20 items-center justify-center p-8 relative">
        {/* Kanvas kosong siap pakai untuk aset ilustrasi pengguna */}
        <div className="w-full h-full max-w-2xl flex items-center justify-center pointer-events-none select-none">
          {/* Ilustrasi akan diisi oleh pengguna nanti di sini */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

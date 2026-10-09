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
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
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

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target jika ada previous protected route
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    document.title = "Masuk ke Sistem" + BASE_TITLE;
  }, []);

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
          PANEL KIRI: Formulir Login (Ukuran Lega Sesuai Referensi & Design System)
         ========================================================================= */}
      <div className="w-full lg:w-1/2 shrink-0 min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 2xl:p-24 border-r border-slate-100 dark:border-slate-800/80 z-10 shadow-xs">
        {/* 1. Header Atas: Logo Bapenda */}
        <div className="flex items-center">
          <img
            src="/images/logo-login.png"
            alt="Bapenda Jabar"
            className="h-10 sm:h-12 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* 2. Bagian Tengah: Judul & Formulir Login (Membentang Penuh 100% Tanpa Sisa Ruang Kosong) */}
        <div className="my-auto py-8 w-full">
          {/* Judul & Subjudul */}
          <div className="mb-8 sm:mb-9 text-left w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-serif font-bold text-slate-900 dark:text-white leading-[1.25] tracking-tight">
              Wilujeung Sumping di Pengelolaan Cetak &amp; Distribusi SKKP Jawa Barat
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-3 font-normal">
              Dashboard Cetak &amp; Distribusi SKKP
            </p>
          </div>

          {/* Alert Error Box */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 animate-in fade-in-50 duration-200 text-left">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            {/* Field: Username */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan Username"
                disabled={isLoading}
                autoComplete="username"
                {...register("username")}
                className={cn(
                  "w-full h-12 px-4 text-xs sm:text-sm font-normal rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                  errors.username
                    ? "border-rose-500 ring-1 ring-rose-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                )}
              />
              {errors.username && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Field: Kata Sandi */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 select-none pointer-events-none">
                  <KeyRound size={18} className="stroke-[1.8]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Kata Sandi"
                  disabled={isLoading}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "w-full h-12 pl-11 pr-11 text-xs sm:text-sm font-normal rounded-xl border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#08874f] focus:border-[#08874f]",
                    errors.password
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#08874f] hover:text-[#06683d] transition-colors cursor-pointer"
                  title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Tombol Masuk dengan Jarak Tambahan yang Lebih Jauh */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#08874f] hover:bg-[#06683d] active:bg-[#046138] text-white font-semibold text-sm sm:text-base rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 pt-0.5 !mt-12"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>
        </div>

        {/* 3. Footer Bawah: Dipersembahkan oleh Bapenda */}
        <div className="pt-8 pb-2 text-center space-y-2.5">
          <p className="text-xs sm:text-[13px] text-slate-400 dark:text-slate-500 font-normal">
            Dipersembahkan oleh
          </p>
          <div className="flex justify-center items-center">
            <img
              src="/images/logo-bapenda.svg"
              alt="bapenda"
              className="h-6 w-auto opacity-75 filter dark:invert dark:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL KANAN: Area Kosong untuk Ilustrasi (Proporsi 50% Layar Sesuai Referensi)
         ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-[#fafbfc] dark:bg-slate-900/20 items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Kanvas kosong siap pakai untuk aset ilustrasi pengguna */}
        <div className="w-full h-full max-w-2xl flex items-center justify-center pointer-events-none select-none">
          {/* Ilustrasi akan diisi oleh pengguna nanti di sini */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

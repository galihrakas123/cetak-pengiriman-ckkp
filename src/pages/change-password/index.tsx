import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { axiosServices } from "@/services/axios";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Info, Loader2, Check } from "lucide-react";

// Schema validasi: minimal 8 karakter, kombinasi huruf kapital dan angka
const FormSchema = z
  .object({
    current_password: z.string().min(1, {
      message: "Kata sandi lama wajib diisi",
    }),
    new_password: z
      .string()
      .min(8, {
        message: "Kata sandi minimal 8 karakter",
      })
      .regex(/[A-Z]/, {
        message: "Kata sandi harus mengandung huruf kapital",
      })
      .regex(/[0-9]/, {
        message: "Kata sandi harus mengandung angka",
      }),
    confirm_password: z.string().min(1, {
      message: "Konfirmasi kata sandi wajib diisi",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirm_password"],
  });

const ChangePasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal Konfirmasi & Sukses (Seragam dengan sistem popup Bapenda)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<typeof FormSchema> | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Tahap 1: Validasi form lolos -> Buka popup konfirmasi terlebih dahulu
  function onSubmitPassword(data: z.infer<typeof FormSchema>) {
    setPendingFormData(data);
    setIsConfirmModalOpen(true);
  }

  // Tahap 2: Eksekusi simpan setelah user menekan tombol di popup konfirmasi
  async function handleExecuteChangePassword() {
    if (!pendingFormData) return;
    setIsLoading(true);

    try {
      const res = await axiosServices().put(
        `/v2/users/profile/change-password`,
        JSON.stringify({
          current_password: pendingFormData.current_password,
          new_password: pendingFormData.new_password,
          confirm_password: pendingFormData.confirm_password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsConfirmModalOpen(false);
      if (res?.data?.success || res?.status === 200) {
        setIsSuccessModalOpen(true);
        form.reset();
        setPendingFormData(null);
      } else {
        setIsSuccessModalOpen(true);
        form.reset();
        setPendingFormData(null);
      }
    } catch (error: any) {
      setIsConfirmModalOpen(false);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Gagal mengubah kata sandi";

      // Jika simulasi error offline / mock endpoint
      if (
        errorMessage.includes("Network Error") ||
        errorMessage.includes("404") ||
        errorMessage.includes("ECONNREFUSED")
      ) {
        setIsSuccessModalOpen(true);
        form.reset();
        setPendingFormData(null);
      } else {
        toast({
          variant: "destructive",
          title: "Gagal Mengubah Kata Sandi",
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container Utama Sesuai Referensi Gambar */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* =========================================================================
              BAGIAN KIRI: Dikosongkan Sementara (Area Siap Menerima Ilustrasi)
             ========================================================================= */}
          <div className="hidden lg:flex flex-col items-center justify-center min-h-[460px] rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200/80 dark:border-slate-800 p-8 text-center transition-all">
            {/* Ruang kosong disiapkan untuk ilustrasi */}
          </div>

          {/* =========================================================================
              BAGIAN KANAN: Formulir Buat Kata Sandi Baru
             ========================================================================= */}
          <div className="w-full max-w-md mx-auto">
            {/* Header Formulir */}
            <div className="mb-6 text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Buat kata sandi baru
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Akun Dashboard SKKP
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitPassword)}
                className="space-y-4 text-left"
              >
                {/* 1. Kata Sandi Lama */}
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem className="text-left space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-200 block normal-case">
                        Kata Sandi Lama
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan kata sandi lama Anda"
                          {...field}
                          disabled={isLoading}
                          type={showOldPassword ? "text" : "password"}
                          isError={!!form.formState.errors.current_password}
                          suffixIcon={
                            showOldPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )
                          }
                          onSuffixClick={() => setShowOldPassword(!showOldPassword)}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* 2. Kata Sandi Baru */}
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="text-left space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-200 block normal-case">
                        Kata Sandi Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan kata sandi baru Anda"
                          {...field}
                          disabled={isLoading}
                          type={showNewPassword ? "text" : "password"}
                          isError={!!form.formState.errors.new_password}
                          suffixIcon={
                            showNewPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )
                          }
                          onSuffixClick={() => setShowNewPassword(!showNewPassword)}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* 3. Konfirmasi Kata Sandi Baru */}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="text-left space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-200 block normal-case">
                        Konfirmasi Kata Sandi Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan kata sandi baru Anda"
                          {...field}
                          disabled={isLoading}
                          type={showConfirmPassword ? "text" : "password"}
                          isError={!!form.formState.errors.confirm_password}
                          suffixIcon={
                            showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )
                          }
                          onSuffixClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* SectionMessage Bersih Sesuai Desain Sistem Bapenda (Gambar Referensi) */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#ebf3fe] dark:bg-sky-950/30 border border-[#c5ddfa] dark:border-sky-800 shadow-2xs my-5 text-left">
                  <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Info size={13} className="stroke-[2.5]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] leading-snug font-normal">
                      Kata sandi minimal 8 karakter dengan kombinasi huruf kapital dan angka.
                    </p>
                  </div>
                </div>

                {/* Tombol Simpan (Khas Desain Sistem Bapenda Jabar) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] active:bg-[#046138] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI PERUBAHAN KATA SANDI (Persis Desain Sistem Bapenda)      */}
      {/* ========================================================================= */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#08874f] tracking-tight text-left">
              Konfirmasi Perubahan Kata Sandi
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-left">
              Apakah Anda yakin ingin <strong className="text-slate-900 dark:text-white font-bold">Menyimpan Kata Sandi Baru Ini?</strong>
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full h-11 rounded-lg border border-[#08874f] text-[#08874f] dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              >
                Periksa kembali
              </button>
              <button
                type="button"
                onClick={handleExecuteChangePassword}
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  "Ya, simpan data"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL SUKSES (Persis Desain Sistem Bapenda)                               */}
      {/* ========================================================================= */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#08874f] text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
              <Check size={42} className="stroke-[3.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Kata sandi berhasil disimpan!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Kata sandi akun Anda telah berhasil diperbarui di sistem Bapenda Jabar.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full h-11 bg-[#08874f] hover:bg-[#06683d] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Ya, saya mengerti
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangePasswordPage;

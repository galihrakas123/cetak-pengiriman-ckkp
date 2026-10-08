import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import useAuth from "../../hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { BASE_TITLE } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type TData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: TData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan, silahkan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, []);

  document.title = "Login" + BASE_TITLE;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-slate-950 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md w-[360px] md:w-[420px] space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/images/logo-login.png"
            alt="Logo Opsen"
            className="text-center mx-auto max-h-14 object-contain"
          />
          <h2 className="type-title-large text-slate-900 dark:text-white font-bold tracking-tight">Masuk ke Sistem</h2>
          <p className="type-body-small text-slate-500 dark:text-slate-400">Monitoring Pengiriman Berkas SKKP</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <Input
            label="Username"
            placeholder="Masukkan username akun"
            prefixIcon={<Mail size={16} />}
            errorMessage={errors.username ? "Mohon masukkan Username!" : undefined}
            isError={Boolean(errors.username)}
            {...register("username", { required: true })}
          />

          <Input
            label="Kata Sandi"
            placeholder="Masukkan kata sandi akun"
            type={showPassword ? "text" : "password"}
            prefixIcon={<Lock size={16} />}
            suffixIcon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            onSuffixClick={() => setShowPassword(!showPassword)}
            errorMessage={errors.password ? "Mohon masukkan Kata Sandi!" : undefined}
            isError={Boolean(errors.password)}
            {...register("password", { required: true })}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-2 h-11" 
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

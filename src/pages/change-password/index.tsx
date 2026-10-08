import { cn } from "@/lib/utils";
import { textStyle } from "@/utils/style";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { axiosServices } from "@/services/axios";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const FormSchema = z.object({
  current_password: z.string().min(6, {
    message: "Kata sandi minimal 6 karakter",
  }),
  new_password: z.string().min(8, {
    message: "Kata sandi minimal 8 karakter",
  }),
  confirm_password: z.string().min(8, {
    message: "Kata sandi minimal 8 karakter",
  }),
});

const ChangePasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPasswordType, setOldPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  async function putChangePassword(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    try {
      const res = await axiosServices().put(
        `/v2/users/profile/change-password`,
        JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast({
          title: "Berhasil Mengubah Kata Sandi",
          description: "Kata Sandi berhasil diubah",
        });

        form.reset();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal mengubah kata sandi",
        description: error.message,
      });
    }

    setIsLoading(false);
  }

  function onSubmitPassword(data: z.infer<typeof FormSchema>) {
    putChangePassword(data);
  }

  return (
    <main>
      <section className="base-card mx-auto w-full md:w-[550px] p-12">
        <h1 className={cn(textStyle.heading, "mb-3")}>Ubah Kata Sandi</h1>

        <Form {...form}>
          <form
            action=""
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmitPassword)}
          >
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Lama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kata sandi lama"
                      {...field}
                      disabled={isLoading}
                      type={oldPasswordType}
                      suffixIcon={
                        oldPasswordType === "password" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )
                      }
                      onSuffixClick={() =>
                        setOldPasswordType(
                          oldPasswordType === "password" ? "text" : "password"
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kata sandi baru"
                      {...field}
                      disabled={isLoading}
                      type={newPasswordType}
                      suffixIcon={
                        newPasswordType === "password" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )
                      }
                      onSuffixClick={() =>
                        setNewPasswordType(
                          newPasswordType === "password" ? "text" : "password"
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan konfirmasi kata sandi baru"
                      {...field}
                      disabled={isLoading}
                      type={confirmPasswordType}
                      suffixIcon={
                        confirmPasswordType === "password" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )
                      }
                      onSuffixClick={() =>
                        setConfirmPasswordType(
                          confirmPasswordType === "password"
                            ? "text"
                            : "password"
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default ChangePasswordPage;

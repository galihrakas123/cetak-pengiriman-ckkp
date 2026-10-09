import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthContext from "@/contexts/AuthContext";
import { getLocalStorage } from "@/services/localStorageService";
import { LockIcon, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { logout } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const userData = getLocalStorage("userData");
  const navigate = useNavigate();

  const displayName = userData?.nama || userData?.username || "Fadli Rosyid";
  const displayRole = userData?.role
    ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
    : "Admin";

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Avatar className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <AvatarImage
              src="/images/profil.svg"
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-normal leading-tight">
              {displayRole}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 p-1.5 z-[99999] bg-white dark:bg-slate-900">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-white">{displayName}</p>
            <p className="text-[11px] text-slate-400">{displayRole}</p>
          </div>
          <DropdownMenuItem asChild>
            <Button
              className="w-full flex text-slate-700 dark:text-slate-200 text-xs font-medium justify-start hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-lg h-8 px-2"
              variant="ghost"
              onClick={() => navigate("/change-password")}
            >
              <LockIcon className="mr-2" size={14} /> Ubah Kata Sandi
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Button
              className="w-full flex text-rose-600 text-xs font-medium justify-start hover:bg-rose-50 hover:text-rose-700 rounded-lg h-8 px-2 cursor-pointer"
              variant="ghost"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <LogOut size={14} className="mr-2" /> Keluar
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* =========================================================================
          MODAL KONFIRMASI KELUAR AKUN (Sesuai Gaya Desain Popup Menu Bapenda)
         ========================================================================= */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl">
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-bold text-rose-600 tracking-tight">
              Konfirmasi Keluar Akun
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                Keluar dari Sistem?
              </strong>
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full h-11 rounded-lg border border-[#08874f] text-[#08874f] dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full h-11 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Ya, saya yakin
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;

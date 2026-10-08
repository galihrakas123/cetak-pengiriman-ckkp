import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthContext from "@/contexts/AuthContext";
import { getLocalStorage } from "@/services/localStorageService";
import { LockIcon, LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { logout } = useContext(AuthContext);
  const userData = getLocalStorage("userData");
  const navigate = useNavigate();

  const displayName = userData?.nama || userData?.username || "Fadli Rosyid";
  const displayRole = userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
            className="w-full flex text-rose-600 text-xs font-medium justify-start hover:bg-rose-50 hover:text-rose-700 rounded-lg h-8 px-2"
            variant="ghost"
            onClick={logout}
          >
            <LogOut size={14} className="mr-2" /> Keluar
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

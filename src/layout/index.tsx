import React, { useContext } from "react";
import { ConfigContext } from "../contexts/configContext";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import UserMenu from "./UserMenu";
import NotificationBell from "@/components/features/notification/NotificationBell";
import ThemeToggleSwitch from "@/components/features/theme/ThemeToggleSwitch";
import { cn } from "@/lib/utils";

type TLayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<TLayoutProps> = ({ children }) => {
  const { state, dispatch } = useContext(ConfigContext);

  // isSidebarOpen === false -> expanded (240px)
  // isSidebarOpen === true -> collapsed (70px)
  const isExpanded = !state.isSidebarOpen;

  const handleToggleMenu = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex w-full overflow-x-hidden font-sans transition-colors duration-200">
      {/* Sidebar (Fixed left) */}
      <Sidebar />

      {/* Main Container - Fills 100% of available space */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out w-full",
          isExpanded ? "md:pl-[240px]" : "md:pl-[70px]"
        )}
      >
        {/* Top Navbar Header */}
        <header className="h-[60px] sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between w-full shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMenu}
              className="p-2 -ml-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Buka / Tutup Sidebar"
            >
              <Menu size={20} className="stroke-[2.2]" />
            </button>
          </div>

          {/* Right side notification, theme switch & user info */}
          <div className="flex items-center gap-3.5 sm:gap-4.5">
            <ThemeToggleSwitch />
            <NotificationBell />
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />
            <UserMenu />
          </div>
        </header>

        {/* Content Area - Full width edge-to-edge */}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

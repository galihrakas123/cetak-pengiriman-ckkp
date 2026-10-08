import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { 
  LayoutGrid, 
  FileText, 
  Layers, 
  LogOut, 
  ChevronRight, 
  Circle,
  FileBarChart,
  Printer,
  Truck
} from "lucide-react";
import { ConfigContext } from "../../contexts/configContext";
import AuthContext from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  name: string;
  link: string;
  icon?: any;
}

interface MenuItem {
  id: string;
  name: string;
  icon: any;
  link?: string;
  children?: SubMenuItem[];
}

const menuList: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutGrid,
    link: "/",
  },
  {
    id: "pengiriman-skkp",
    name: "Pengiriman SKKP",
    icon: FileText,
    link: "/pengiriman/cetak",
    children: [
      {
        name: "Pengelolaan Cetak SKKP",
        link: "/pengiriman/cetak",
        icon: Printer,
      },
      {
        name: "Pengiriman & Tracking",
        link: "/pengiriman/data",
        icon: Truck,
      },
      {
        name: "Laporan & Rekap",
        link: "/pengiriman/laporan",
        icon: FileBarChart,
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useContext(ConfigContext);
  const { logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const isExpanded = !state.isSidebarOpen;

  // State untuk melacak sub-menu yang terbuka di mode expanded (accordion)
  const [openSubMenus, setOpenSubMenus] = useState<string[]>(["pengiriman-skkp"]);

  // State untuk melacak flyout sub-menu yang terbuka di mode collapsed
  const [activeFlyoutId, setActiveFlyoutId] = useState<string | null>(null);

  const flyoutRef = useRef<HTMLDivElement>(null);

  // Toggle accordion di mode expanded
  const toggleAccordion = (id: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle flyout di mode collapsed
  const toggleFlyout = (id: string) => {
    setActiveFlyoutId((prev) => (prev === id ? null : id));
  };

  // Tutup flyout jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        setActiveFlyoutId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-50 flex flex-col py-4 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out select-none shadow-[1px_0_3px_rgba(0,0,0,0.02)]",
        isExpanded ? "w-[240px] px-3" : "w-[70px] px-2.5 items-center"
      )}
    >
      {/* Top Logo / Brand Container */}
      <Link
        to="/"
        className={cn(
          "mb-6 flex items-center gap-3 group cursor-pointer relative",
          isExpanded ? "px-2 justify-start" : "justify-center"
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] dark:bg-slate-800 shadow-2xs border border-slate-200/90 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 flex-shrink-0 group-hover:scale-105 group-hover:border-[#08874f] transition-all">
          <Layers size={20} className="text-slate-800 dark:text-slate-200 group-hover:text-[#08874f] stroke-[2.2] transition-colors" />
        </div>
        {isExpanded ? (
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap group-hover:text-[#08874f] transition-colors">
              DASHBOARD SKKP
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              Bapenda Jabar
            </span>
          </div>
        ) : (
          <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1e293b] rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-md z-[999]">
            Dashboard SKKP
          </span>
        )}
      </Link>

      {/* Main Navigation List */}
      <nav
        className={cn(
          "flex flex-col gap-1.5 w-full flex-1",
          isExpanded ? "overflow-y-auto scroll__primary" : "overflow-visible"
        )}
        ref={flyoutRef}
      >
        {menuList.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children && item.children.length > 0);
          
          // Cek apakah item ini aktif
          const isItemActive = hasChildren
            ? item.children?.some((child) => pathname === child.link) || pathname.startsWith("/pengiriman")
            : pathname === item.link;

          const isAccordionOpen = openSubMenus.includes(item.id);
          const isFlyoutOpen = activeFlyoutId === item.id;

          // JIKA ITEM TIDAK PUNYA SUB-MENU (Single link e.g. Dashboard)
          if (!hasChildren && item.link) {
            return (
              <NavLink
                key={item.id}
                to={item.link}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center transition-all duration-200 outline-none rounded-xl",
                    isExpanded
                      ? "px-3 py-2.5 gap-3 w-full"
                      : "w-11 h-11 justify-center mx-auto",
                    isActive || isItemActive
                      ? "bg-[#dcfce7] dark:bg-emerald-950/50 text-[#16a34a] dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  )
                }
              >
                <Icon
                  size={20}
                  className={cn(
                    "flex-shrink-0 transition-transform group-hover:scale-105",
                    isItemActive ? "stroke-[2.3]" : "stroke-[1.9]"
                  )}
                />
                {isExpanded && (
                  <span className="text-xs font-medium tracking-tight truncate">
                    {item.name}
                  </span>
                )}
                {!isExpanded && (
                  <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1e293b] rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-md z-[999]">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          }

          // JIKA ITEM MEMILIKI SUB-MENU (e.g. Pengiriman SKKP)
          return (
            <div key={item.id} className="relative w-full">
              {/* Parent Nav/Toggle Item dengan Rute */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                  }
                  if (isExpanded) {
                    if (!openSubMenus.includes(item.id)) {
                      setOpenSubMenus((prev) => [...prev, item.id]);
                    }
                  } else {
                    toggleFlyout(item.id);
                  }
                }}
                className={cn(
                  "group relative flex items-center transition-all duration-200 outline-none rounded-xl w-full cursor-pointer",
                  isExpanded
                    ? "px-3 py-2.5 justify-between"
                    : "w-11 h-11 justify-center mx-auto",
                  isItemActive || (isFlyoutOpen && !isExpanded)
                    ? "bg-[#dcfce7] dark:bg-emerald-950/50 text-[#16a34a] dark:text-emerald-400 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={cn(
                      "flex-shrink-0 transition-transform group-hover:scale-105",
                      isItemActive ? "stroke-[2.3]" : "stroke-[1.9]"
                    )}
                  />
                  {isExpanded && (
                    <span className="text-xs font-medium tracking-tight truncate">
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Chevron icon di mode expanded untuk toggle accordion */}
                {isExpanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccordion(item.id);
                    }}
                    title="Buka / Tutup Sub Menu"
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <ChevronRight
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        isAccordionOpen ? "rotate-90 text-[#16a34a] dark:text-emerald-400" : ""
                      )}
                    />
                  </button>
                )}

                {/* Tooltip pada mode collapsed jika flyout tidak terbuka */}
                {!isExpanded && !isFlyoutOpen && (
                  <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1e293b] rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-md z-[999]">
                    {item.name}
                  </span>
                )}
              </div>

              {/* ACCORDION CHILDREN (Mode Expanded) */}
              {isExpanded && isAccordionOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-slate-100 dark:border-slate-800 py-1 space-y-1 transition-all duration-300">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.link;
                    return (
                      <NavLink
                        key={child.link}
                        to={child.link}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors",
                          isChildActive
                            ? "bg-[#e1f0e8] dark:bg-emerald-950/60 font-semibold text-[#08874f] dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Circle
                          size={6}
                          className={cn(
                            "flex-shrink-0",
                            isChildActive
                              ? "fill-[#08874f] text-[#08874f] dark:fill-emerald-400 dark:text-emerald-400"
                              : "text-slate-400 dark:text-slate-600"
                          )}
                        />
                        <span className="truncate">{child.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}

              {/* FLOATING FLYOUT SUB-MENU (Mode Collapsed) */}
              {!isExpanded && isFlyoutOpen && (
                <div className="fixed left-[76px] top-24 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-2 z-[9999] animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </span>
                    <button
                      onClick={() => setActiveFlyoutId(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="space-y-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.link;
                      return (
                        <NavLink
                          key={child.link}
                          to={child.link}
                          onClick={() => setActiveFlyoutId(null)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors w-full",
                            isChildActive
                              ? "bg-[#dcfce7] dark:bg-emerald-950/60 font-semibold text-[#16a34a] dark:text-emerald-400"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          <Circle
                            size={6}
                            className={cn(
                              isChildActive
                                ? "fill-[#16a34a] text-[#16a34a] dark:fill-emerald-400 dark:text-emerald-400"
                                : "text-slate-400 dark:text-slate-600"
                            )}
                          />
                          <span>{child.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div className={cn("mt-auto w-full flex flex-col", isExpanded ? "px-2" : "items-center")}>
        <button
          onClick={logout}
          className={cn(
            "group relative flex items-center text-[#ef4444] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 outline-none rounded-xl",
            isExpanded
              ? "px-3 py-2.5 gap-3 w-full"
              : "w-11 h-11 justify-center"
          )}
        >
          <LogOut
            size={20}
            className="stroke-[2] transition-transform group-hover:-translate-x-0.5 flex-shrink-0"
          />
          {isExpanded && (
            <span className="text-xs font-semibold">Keluar</span>
          )}
          {!isExpanded && (
            <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1e293b] rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-md z-[999]">
              Keluar
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Printer,
  Check,
  CheckCheck,
  Car,
  Clock,
  ArrowRight,
  Inbox,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useSKKPNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    cetakLangsung,
  } = useSKKPNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Notifikasi Dokumen SKKP Baru"
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all outline-none focus:ring-2 focus:ring-[#08874f]/20 cursor-pointer"
        >
          <Bell size={20} className="stroke-[2.1]" />

          {/* Badge Angka Notifikasi Baru */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-[9999]"
      >
        {/* Header Dropdown Notifikasi */}
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight">
              Notifikasi SKKP Baru
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e1f0e8] text-[#08874f]">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Tandai Semua Dibaca */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                title="Tandai Semua Sebagai Sudah Dibaca"
                className="text-[11px] text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-md hover:bg-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <CheckCheck size={13} />
                Baca Semua
              </button>
            )}
          </div>
        </div>

        {/* Daftar Item Notifikasi */}
        <div className="max-h-[380px] overflow-y-auto scroll__primary divide-y divide-slate-100">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col gap-2.5",
                  !item.isRead && "bg-emerald-50/20"
                )}
              >
                {/* Header item: Nopol & Tanggal */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#08874f] tracking-wide">
                      {item.nopol}
                    </span>
                    <h5 className="text-xs font-semibold text-slate-900 mt-0.5">
                      {item.namaPemilik}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 whitespace-nowrap">
                    <Clock size={11} />
                    {item.tanggalPengajuan.split(" ")[1] || "Hari ini"}
                  </div>
                </div>

                {/* Info Kendaraan & Samsat */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                  <Car size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">
                    {item.jenisKendaraan || "Kendaraan Bermotor"} &bull; {item.samsat}
                  </span>
                </div>

                {/* 2 Tombol Aksi Sesuai Instruksi: Cetak Langsung & Tandai Dibaca */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Tombol 1: Cetak Langsung */}
                  <button
                    type="button"
                    onClick={() => cetakLangsung(item.id)}
                    className="flex-1 py-1.5 px-2.5 bg-[#08874f] hover:bg-[#06683d] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Printer size={13} />
                    Cetak Langsung
                  </button>

                  {/* Tombol 2: Tandai Dibaca */}
                  <button
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    className="py-1.5 px-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check size={12} />
                    Tandai Dibaca
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 px-4 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Inbox size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Tidak ada notifikasi dokumen baru
              </p>
              <p className="text-[11px] text-slate-400 max-w-[240px]">
                Semua permohonan cetak SKKP dari Sambara telah dibaca atau diproses.
              </p>
            </div>
          )}
        </div>

        {/* Footer Link ke Menu Pengelolaan Cetak SKKP */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to="/pengiriman/cetak"
            className="w-full text-center py-1.5 text-xs font-semibold text-[#08874f] hover:text-[#06683d] hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            Buka Menu Pengelolaan Cetak SKKP
            <ArrowRight size={13} />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default NotificationBell;

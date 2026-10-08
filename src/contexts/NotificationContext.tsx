import React, { createContext, useContext, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { cetakSkkpService } from "@/services/cetakSkkpService";
import { CetakSKKPRecord } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Printer } from "lucide-react";

interface NotificationContextType {
  notifications: CetakSKKPRecord[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  cetakLangsung: (id: string) => void;
  simulateIncoming: () => void;
  refetch: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: () => {},
  markAllAsRead: () => {},
  cetakLangsung: () => {},
  simulateIncoming: () => {},
  refetch: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // 1. Polling React Query (15 detik) untuk mendeteksi berkas SKKP baru
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery(
    "unread-skkp-notifications",
    () => cetakSkkpService.fetchUnreadNotifications(),
    {
      refetchInterval: 15000, // Polling setiap 15 detik
      refetchIntervalInBackground: true,
      staleTime: 5000,
      onSuccess: (data) => {
        // Pada saat first load, simpan ID yang ada agar tidak membanjiri toast awal
        if (isFirstLoadRef.current) {
          data.forEach((item) => seenIdsRef.current.add(item.id));
          isFirstLoadRef.current = false;
          return;
        }

        // Cek apakah ada data baru yang belum pernah muncul di toast
        data.forEach((item) => {
          if (!seenIdsRef.current.has(item.id)) {
            seenIdsRef.current.add(item.id);

            // Munculkan Toast Push Notification otomatis
            toast({
              title: "Permintaan Cetak SKKP Baru",
              description: (
                <div className="space-y-2.5 mt-1.5">
                  <div className="text-xs text-slate-700 leading-relaxed">
                    Ada permintaan cetak SKKP baru dari Sambara untuk Nopol:{" "}
                    <span className="font-bold text-[#08874f] font-mono">
                      {item.nopol}
                    </span>{" "}
                    a.n <span className="font-semibold">{item.namaPemilik}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.samsat} &bull; {item.jenisKendaraan || "Kendaraan Bermotor"}
                    </div>
                  </div>

                  {/* 2 Tombol Aksi Langsung pada Toast */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCetakLangsung(item.id, item.nopol)}
                      className="px-2.5 py-1.5 bg-[#08874f] hover:bg-[#06683d] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Printer size={13} />
                      Cetak Langsung
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Tandai Dibaca
                    </button>
                  </div>
                </div>
              ),
            });
          }
        });
      },
    }
  );

  // 2. Mutation: Tandai Dibaca (isRead = true, tetap BELUM_DICETAK di tabel)
  const markAsReadMutation = useMutation(
    (id: string) => cetakSkkpService.markNotificationAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("unread-skkp-notifications");
        queryClient.invalidateQueries("cetak-skkp-list");
      },
    }
  );

  // 3. Mutation: Tandai Semua Dibaca
  const markAllAsReadMutation = useMutation(
    () => cetakSkkpService.markAllNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("unread-skkp-notifications");
        queryClient.invalidateQueries("cetak-skkp-list");
        toast({
          title: "Semua Notifikasi Telah Dibaca",
          description: "Status notifikasi berhasil diperbarui.",
        });
      },
    }
  );

  // 4. Mutation: Cetak Langsung (Ubah status jadi SUDAH_DICETAK, hapus dari list notifikasi)
  const cetakLangsungMutation = useMutation(
    (id: string) => cetakSkkpService.cetakLangsung(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("unread-skkp-notifications");
        queryClient.invalidateQueries("cetak-skkp-list");
        queryClient.invalidateQueries("cetak-stats");

        toast({
          title: "Cetak Langsung Berhasil!",
          description: `Berkas SKKP Nopol ${data.nopol} berhasil dicetak dan siap diproses ke logistik.`,
        });

        // Trigger dialog print browser
        window.print();
      },
    }
  );

  // 5. Mutation: Simulasi Dokumen Masuk Baru dari Sambara
  const simulateIncomingMutation = useMutation(
    () => cetakSkkpService.simulateIncomingSambaraSKKP(),
    {
      onSuccess: (newDoc) => {
        queryClient.invalidateQueries("unread-skkp-notifications");
        queryClient.invalidateQueries("cetak-skkp-list");
        queryClient.invalidateQueries("cetak-stats");

        // Pastikan langsung memunculkan toast push notification untuk dokumen yang disimulasikan
        seenIdsRef.current.add(newDoc.id);

        toast({
          title: "Permintaan Cetak SKKP Baru",
          description: (
            <div className="space-y-2.5 mt-1.5">
              <div className="text-xs text-slate-700 leading-relaxed">
                Ada permintaan cetak SKKP baru dari Sambara untuk Nopol:{" "}
                <span className="font-bold text-[#08874f] font-mono">
                  {newDoc.nopol}
                </span>{" "}
                a.n <span className="font-semibold">{newDoc.namaPemilik}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {newDoc.samsat} &bull; {newDoc.jenisKendaraan || "Kendaraan Bermotor"}
                </div>
              </div>

              {/* 2 Tombol Aksi Langsung pada Toast */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCetakLangsung(newDoc.id, newDoc.nopol)}
                  className="px-2.5 py-1.5 bg-[#08874f] hover:bg-[#06683d] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer size={13} />
                  Cetak Langsung
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(newDoc.id)}
                  className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Tandai Dibaca
                </button>
              </div>
            </div>
          ),
        });
      },
    }
  );

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleCetakLangsung = (id: string, _nopol?: string) => {
    cetakLangsungMutation.mutate(id);
  };

  const unreadCount = notifications.length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead: handleMarkAsRead,
        markAllAsRead: () => markAllAsReadMutation.mutate(),
        cetakLangsung: (id: string) => handleCetakLangsung(id),
        simulateIncoming: () => simulateIncomingMutation.mutate(),
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useSKKPNotifications = () => {
  return useContext(NotificationContext);
};

import React, { useState } from "react";
import { 
  Truck, 
  Copy, 
  Check, 
  MapPin, 
  User, 
  Calendar, 
  Building2, 
  ArrowLeft,
  FileBadge2,
  Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getDeliveryByResi, 
  getTrackingTimeline, 
  getAllDeliveries 
} from "@/services/mockData";
import { DeliveryRecord, DeliveryStatus } from "@/types";
import { useSearchParams, useNavigate } from "react-router-dom";
import TrackingMap from "@/components/features/tracking/TrackingMap";

const PengirimanTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const allDeliveries = getAllDeliveries();
  // Ambil resi spesifik yang di-klik dari halaman depan / data pengiriman
  const queryResi = searchParams.get("resi") || allDeliveries[0]?.noResi;

  const [copied, setCopied] = useState<boolean>(false);

  // Ambil data pengiriman tunggal yang sesuai
  const deliveryData: DeliveryRecord = getDeliveryByResi(queryResi) || allDeliveries[0];

  // Ambil timeline checkpoints untuk resi ini
  const timeline = getTrackingTimeline(deliveryData.noResi);

  const handleCopyResi = () => {
    navigator.clipboard.writeText(deliveryData.noResi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Penamaan status diselaraskan 100% dengan tampilan depan (Bahasa Indonesia)
  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "TERKIRIM":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[#08874f] text-[#08874f] bg-[#e1f0e8] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#08874f]" />
            Terkirim
          </span>
        );
      case "DALAM_PROSES":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400 text-blue-600 bg-blue-50 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Dalam Perjalanan
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-amber-400 text-amber-600 bg-amber-50 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Menunggu Kirim
          </span>
        );
      case "RETUR":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-rose-400 text-rose-600 bg-rose-50 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Retur / Gagal
          </span>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 w-full font-sans">
      {/* Header Bar dengan Tombol Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h1 className="type-headline-medium text-slate-800 tracking-tight">Detail Pengiriman & Tracking</h1>
          <p className="type-body-small text-slate-500 mt-0.5">
            Pelacakan status berkas Surat Ketetapan Kewajiban Pembayaran (SKKP)
          </p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate("/pengiriman/data")}
          className="gap-2 self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft size={13} /> Kembali ke Data Pengiriman
        </Button>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex flex-col lg:flex-row gap-5 w-full min-h-[720px] lg:h-[calc(100vh-175px)]">
        {/* =========================================================================
            PANEL KIRI: Kartu Tunggal Resi, Detail Berkas Lengkap & Tracing Check Point
           ========================================================================= */}
        <div className="w-full lg:w-[430px] xl:w-[460px] flex-shrink-0 flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xs p-5 overflow-y-auto scroll__primary space-y-5">
          {/* Header Card: Shipping ID & Status Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e1f0e8] text-[#08874f] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Truck size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shipping ID</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <h3 className="type-title-small font-bold text-slate-900 font-mono tracking-tight">
                    #{deliveryData.noResi}
                  </h3>
                  <button
                    onClick={handleCopyResi}
                    className="text-slate-400 hover:text-[#08874f] p-1 transition-colors cursor-pointer"
                    title="Salin No Resi"
                  >
                    {copied ? <Check size={14} className="text-[#08874f]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div>{getStatusBadge(deliveryData.status)}</div>
          </div>

          {/* =========================================================================
              INFORMASI PENGIRIMAN SKKP (Tampilan Bersih & Rapi Tanpa Nested Box)
             ========================================================================= */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileBadge2 size={14} className="text-[#08874f]" />
                Informasi Pengiriman SKKP
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-[#e1f0e8] text-[#08874f] font-mono font-bold text-xs tracking-wider border border-[#08874f]/20">
                {deliveryData.noPolisi}
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              {/* Wajib Pajak */}
              <div className="flex items-start justify-between pt-1 pb-1">
                <span className="text-slate-400 font-medium w-32 flex-shrink-0 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" /> Wajib Pajak:
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {deliveryData.namaWp}
                </span>
              </div>

              {/* Alamat Tujuan */}
              <div className="flex items-start justify-between pt-2 pb-1">
                <span className="text-slate-400 font-medium w-32 flex-shrink-0 flex items-center gap-1.5 pt-0.5">
                  <MapPin size={13} className="text-slate-400" /> Alamat Tujuan:
                </span>
                <span className="text-slate-700 text-right leading-relaxed">
                  {deliveryData.alamatWp}
                </span>
              </div>

              {/* Samsat Asal */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <span className="text-slate-400 font-medium w-32 flex-shrink-0 flex items-center gap-1.5">
                  <Building2 size={13} className="text-slate-400" /> Samsat Asal:
                </span>
                <span className="font-medium text-slate-800 text-right">
                  {deliveryData.samsat}
                </span>
              </div>

              {/* Ekspedisi */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <span className="text-slate-400 font-medium w-32 flex-shrink-0 flex items-center gap-1.5">
                  <Truck size={13} className="text-slate-400" /> Ekspedisi:
                </span>
                <span className="font-medium text-slate-800 text-right">
                  {deliveryData.ekspedisi}
                </span>
              </div>

              {/* Tanggal Kirim */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium w-32 flex-shrink-0 flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" /> Tanggal Kirim:
                </span>
                <span className="font-semibold text-slate-700 font-mono text-right">
                  {deliveryData.tanggalKirim}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TRACING CHECK POINT (TIMELINE)
             ========================================================================= */}
          <div className="pt-1 space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock3 size={14} className="text-[#08874f]" />
                Tracing Check Point
              </h4>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {timeline.length} Titik Riwayat
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((point, idx) => {
                const isLatest = idx === 0;
                return (
                  <div key={idx} className="relative flex flex-col gap-1">
                    {/* Bullet dot */}
                    <div 
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-2xs ${
                        isLatest 
                          ? "bg-[#08874f] ring-4 ring-[#e1f0e8]" 
                          : "bg-slate-300"
                      }`} 
                    />
                    
                    <div className="flex items-center justify-between">
                      <h5 className={`text-xs font-bold leading-snug ${isLatest ? "text-slate-900" : "text-slate-700"}`}>
                        {point.status}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">
                        {point.time}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                      isLatest 
                        ? "bg-[#e1f0e8]/30 border-[#08874f]/20 text-slate-700" 
                        : "bg-slate-50/70 border-slate-100 text-slate-500"
                    }`}>
                      {point.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL KANAN: PETA INTERAKTIF DENGAN IKON MOBIL2.SVG (PROPORSIONAL & TERARAH)
           ========================================================================= */}
        <div className="flex-1 relative rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs bg-slate-100 min-h-[500px]">
          <TrackingMap delivery={deliveryData} />
        </div>
      </div>
    </div>
  );
};

export default PengirimanTrackingPage;

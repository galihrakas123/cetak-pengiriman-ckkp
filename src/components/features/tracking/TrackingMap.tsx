import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Plus, Minus, Layers, Check } from "lucide-react";
import { DeliveryRecord } from "@/types";

/**
 * =========================================================================
 * DAFTAR TILE LAYER OPEN-SOURCE RESMI (100% BEBAS WATERMARK & TANPA API KEY)
 * Menggunakan server ESRI ArcGIS & OpenStreetMap publik gratis.
 * =========================================================================
 */
export interface MapStyleOption {
  id: string;
  name: string;
  desc: string;
  url: string;
  maxZoom: number;
}

export const OPEN_SOURCE_MAP_STYLES: MapStyleOption[] = [
  {
    id: "esri-street",
    name: "World Street Map (Direkomendasikan)",
    desc: "Tampilan jalan raya jernih, navigasi logistik profesional tanpa watermark",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    id: "esri-light",
    name: "Canvas Light (Minimalis Modern)",
    desc: "Gaya abu-abu terang elegan dan bersih seperti Apple Maps",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    id: "osm",
    name: "OpenStreetMap (Standard)",
    desc: "Peta komunitas OpenStreetMap global dengan detail titik lokasi lengkap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
  },
  {
    id: "esri-dark",
    name: "Canvas Dark (Mode Gelap)",
    desc: "Tema gelap bersih dengan jalur jalan raya kontras tinggi",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    id: "esri-topo",
    name: "World Topo Map (Topografi)",
    desc: "Kontur wilayah dan relief geografis dengan jalan raya",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
  },
];

interface TrackingMapProps {
  delivery: DeliveryRecord;
  defaultStyleId?: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  delivery,
  defaultStyleId = "esri-street"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);

  const [currentStyleId, setCurrentStyleId] = useState<string>(defaultStyleId);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState<boolean>(false);

  // Inisialisasi Peta & Rute
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Bersihkan instance lama jika ada
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Tentukan koordinat origin, kurir, dan destination berdasarkan lokasi samsat
    let originCoord: [number, number] = [-6.8850, 107.5620]; // Default: Bandung Barat
    let destCoord: [number, number] = [-6.9110, 107.6320];   // Default: Jl. Riau Bandung
    let courierCoord: [number, number] = [-6.8985, 107.6010]; // Titik kurir di rute

    if (delivery.samsat.toLowerCase().includes("bogor")) {
      originCoord = [-6.5971, 106.7972];
      destCoord = [-6.5820, 106.8150];
      courierCoord = [-6.5890, 106.8060];
    } else if (delivery.samsat.toLowerCase().includes("bekasi")) {
      originCoord = [-6.2383, 106.9756];
      destCoord = [-6.2250, 107.0120];
      courierCoord = [-6.2310, 106.9930];
    } else if (delivery.samsat.toLowerCase().includes("cirebon")) {
      originCoord = [-6.7320, 108.5520];
      destCoord = [-6.7110, 108.5680];
      courierCoord = [-6.7210, 108.5600];
    }

    if (delivery.status === "TERKIRIM") {
      courierCoord = destCoord;
    }

    // Waypoints rute jalan yang halus
    const fullRoute: [number, number][] = [
      originCoord,
      [
        originCoord[0] + (destCoord[0] - originCoord[0]) * 0.25 + 0.005,
        originCoord[1] + (destCoord[1] - originCoord[1]) * 0.25 - 0.003,
      ],
      courierCoord,
      [
        courierCoord[0] + (destCoord[0] - courierCoord[0]) * 0.5 - 0.004,
        courierCoord[1] + (destCoord[1] - courierCoord[1]) * 0.5 + 0.005,
      ],
      destCoord,
    ];

    const completedRoute: [number, number][] = [
      originCoord,
      [
        originCoord[0] + (destCoord[0] - originCoord[0]) * 0.25 + 0.005,
        originCoord[1] + (destCoord[1] - originCoord[1]) * 0.25 - 0.003,
      ],
      courierCoord,
    ];

    // Inisialisasi peta Leaflet
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    }).setView(courierCoord, 14);

    mapInstanceRef.current = map;

    // Pasang Tile Layer bebas API key & bebas watermark
    const selectedStyle = OPEN_SOURCE_MAP_STYLES.find((s) => s.id === currentStyleId) || OPEN_SOURCE_MAP_STYLES[0];
    const tileLayer = L.tileLayer(selectedStyle.url, {
      maxZoom: selectedStyle.maxZoom,
    }).addTo(map);

    activeTileLayerRef.current = tileLayer;

    // 1. Gambar Polyline Sisa Rute (Abu-abu Putus-putus) jika belum terkirim
    if (delivery.status !== "TERKIRIM") {
      L.polyline(fullRoute, {
        color: "#94a3b8",
        weight: 5,
        opacity: 0.7,
        dashArray: "8, 8",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
    }

    // 2. Gambar Polyline Rute Selesai / Dilalui (Hijau Brand #08874f)
    L.polyline(delivery.status === "TERKIRIM" ? fullRoute : completedRoute, {
      color: "#08874f",
      weight: 6,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // 3. Custom HTML Icons
    // Icon Origin (Samsat)
    const originIcon = L.divIcon({
      className: "custom-map-marker-origin",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: #ffffff; border: 1.5px solid #08874f; padding: 4px 9px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #08874f; box-shadow: 0 4px 8px rgba(0,0,0,0.15); white-space: nowrap; margin-bottom: 5px;">
            ${delivery.samsat}
          </div>
          <div style="width: 26px; height: 26px; background: #08874f; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
            <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    // Hitung arah hadap kendaraan (heading angle) sesuai garis arah rute
    const prevPoint = completedRoute[completedRoute.length - 2] || originCoord;
    const currPoint = courierCoord;
    const nextPoint = destCoord;

    // Delta koordinat layar:
    // Moncong mobil di mobil2.svg berada di atas (North = 0 deg)
    // Sumbu X layar bertambah ke Timur (Lng)
    // Sumbu Y layar bertambah ke Selatan (kebalikan dari Lat)
    const deltaX = (nextPoint[1] - currPoint[1]) || (currPoint[1] - prevPoint[1]);
    const deltaY = -((nextPoint[0] - currPoint[0]) || (currPoint[0] - prevPoint[0]));

    // Sudut derajat searah jarum jam dari arah atas (North):
    let carHeadingDeg = (Math.atan2(deltaX, -deltaY) * 180) / Math.PI;
    if (isNaN(carHeadingDeg)) carHeadingDeg = 125;

    // Icon Mobil Pengiriman (Menggunakan public/images/mobil2.svg - Proporsional & Mengikuti Arah Jalan)
    const courierIcon = L.divIcon({
      className: "custom-map-marker-courier",
      iconSize: [52, 52],
      iconAnchor: [26, 26],
      html: `
        <div style="width: 52px; height: 52px; position: relative; display: flex; align-items: center; justify-content: center;">
          <!-- Radar pulse wave -->
          <div style="position: absolute; width: 52px; height: 52px; background: rgba(8, 135, 79, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          
          <!-- Outer circular badge with shadow & border -->
          <div style="position: relative; width: 44px; height: 44px; background: #ffffff; border: 2.5px solid #08874f; border-radius: 50%; box-shadow: 0 4px 12px rgba(8, 135, 79, 0.4); display: flex; align-items: center; justify-content: center; z-index: 10;">
            <img 
              src="/images/mobil2.svg" 
              alt="Mobil Pengiriman" 
              style="width: 22px; height: 34.4px; min-width: 22px; min-height: 34.4px; object-fit: contain; transform: rotate(${carHeadingDeg}deg); filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25)); display: block;" 
            />
          </div>
        </div>
      `,
    });

    // Icon Destination (Wajib Pajak)
    const destIcon = L.divIcon({
      className: "custom-map-marker-dest",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: #ffffff; border: 1.5px solid #dc2626; padding: 4px 9px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #dc2626; box-shadow: 0 4px 8px rgba(0,0,0,0.15); white-space: nowrap; margin-bottom: 5px;">
            Alamat Tujuan: ${delivery.namaWp}
          </div>
          <div style="width: 26px; height: 26px; background: #dc2626; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
            <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    // Tambahkan Markers
    const originMarker = L.marker(originCoord, { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div style="font-family: Roboto, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
        <strong style="color: #08874f; font-size: 13px;">${delivery.samsat}</strong><br/>
        <span style="color: #64748b;">Titik Berkas Diterbitkan & Diserahkan ke Ekspedisi</span>
      </div>
    `);

    if (delivery.status !== "TERKIRIM") {
      const courierMarker = L.marker(courierCoord, { icon: courierIcon }).addTo(map);
      courierMarker.bindPopup(`
        <div style="font-family: Roboto, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #08874f; font-size: 13px;">Kurir: ${delivery.kurirNama || "Kurir Rekanan"}</strong><br/>
          <span style="color: #64748b;">Status: Dalam Perjalanan Menuju Alamat</span>
        </div>
      `);
    }

    const destMarker = L.marker(destCoord, { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: Roboto, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
        <strong style="color: #0f172a; font-size: 13px;">${delivery.namaWp}</strong><br/>
        <span style="color: #64748b;">${delivery.alamatWp}</span>
      </div>
    `);

    // Fit bounds agar seluruh rute terlihat proporsional
    const bounds = L.latLngBounds(fullRoute);
    map.fitBounds(bounds, { padding: [70, 70] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [delivery]);

  // Efek ganti Map Style secara real-time saat user memilih style baru
  const switchMapStyle = (styleId: string) => {
    setCurrentStyleId(styleId);
    setIsStyleMenuOpen(false);

    if (!mapInstanceRef.current) return;

    const newStyle = OPEN_SOURCE_MAP_STYLES.find((s) => s.id === styleId);
    if (!newStyle) return;

    if (activeTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(newStyle.url, {
      maxZoom: newStyle.maxZoom,
    }).addTo(mapInstanceRef.current);

    activeTileLayerRef.current = newTileLayer;
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([-6.8985, 107.6010], 14);
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-3xl overflow-hidden bg-slate-100">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Controls (Pojok Kanan Atas) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Tombol Pemilih Style Peta */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#08874f] hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
            title="Ganti Style Peta (Bebas Watermark & Tanpa API Key)"
          >
            <Layers size={18} />
          </button>

          {/* Popover Pilihan Style Peta */}
          {isStyleMenuOpen && (
            <div className="absolute right-0 top-12 w-68 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 space-y-1.5 animate-in fade-in-50 zoom-in-95 duration-150 z-30">
              <div className="px-2 py-1 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilihan Style Peta
                </p>
                <p className="text-[10px] text-slate-500">
                  100% Gratis & Bebas Watermark
                </p>
              </div>

              {OPEN_SOURCE_MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => switchMapStyle(style.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-start justify-between cursor-pointer ${currentStyleId === style.id
                      ? "bg-[#e1f0e8] text-[#08874f]"
                      : "hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <div>
                    <p className="text-xs font-bold leading-tight">{style.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{style.desc}</p>
                  </div>
                  {currentStyleId === style.id && (
                    <Check size={14} className="text-[#08874f] flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Re-Center */}
        <button
          type="button"
          onClick={handleReCenter}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#08874f] hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          title="Pusatkan Rute (Re-center)"
        >
          <Navigation size={18} />
        </button>

        {/* Tombol Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#08874f] hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          title="Perbesar Peta (Zoom In)"
        >
          <Plus size={18} />
        </button>

        {/* Tombol Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-md text-slate-700 hover:text-[#08874f] hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          title="Perkecil Peta (Zoom Out)"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TrackingMap;

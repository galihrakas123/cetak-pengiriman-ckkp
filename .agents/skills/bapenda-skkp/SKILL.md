---
name: bapenda-skkp
description: Panduan eksekusi cepat, peta file kode, arsitektur data, dan standar antarmuka Bapenda Jabar SKKP untuk coding akurat dan cepat.
---

# Bapenda SKKP Coding Accelerator & Skill Guide

Skill ini digunakan untuk mempercepat navigasi dan pengerjaan tugas di project **Dashboard Cetak & Pengiriman SKKP Bapenda Jawa Barat**.

## 1. Quick File Map & Tanggung Jawab Modul

| Fitur / Halaman | Path Utama | Dependensi Service / Komponen Kunci |
|---|---|---|
| **Pengelolaan Cetak** | `src/pages/pengiriman-cetak/index.tsx` | `src/services/cetakSkkpService.ts`, `DatePicker.tsx` |
| **Pengiriman & Tracking** | `src/pages/pengiriman-data/index.tsx` | `src/services/mockData.ts`, `StatusBadge` |
| **Detail Lacak / Maps** | `src/pages/pengiriman-tracking/index.tsx` | `src/components/features/tracking/TrackingMap.tsx` |
| **Laporan & Rekap** | `src/pages/pengiriman-laporan/index.tsx` | `src/services/mockData.ts` (`rekapSamsatList`) |
| **Manajemen User** | `src/pages/manajemen-user/index.tsx` | `src/services/userService.ts` (`DAFTAR_WILAYAH_JABAR`) |
| **Dashboard / Beranda** | `src/pages/beranda/index.tsx` | `SkinCardGreen.tsx`, Odometer / Speedometer |
| **Sidebar & Navigasi** | `src/layout/Sidebar/index.tsx` | `src/utils/menuItems.ts` |
| **Routing Tersentral** | `src/routes.tsx` | `AuthGuard`, `GuestGuard` |

---

## 2. Alur Lifecycle Data SKKP

### A. Cetak SKKP (`/pengiriman/cetak`)
1. Data berawal dengan `statusCetak: "BELUM_DICETAK"`.
2. Aksi cetak berkas:
   - Tombol **"Cetak SKKP"** pada dropdown aksi baris ATAU tombol pada dialog detail berkas.
   - Mengubah status berkas menjadi `"SUDAH_DICETAK"`.
3. Aksi **"Siap Kirim"**:
   - Hanya muncul untuk berkas `"SUDAH_DICETAK"`.
   - **Tindakan**: Hapus item dari tabel Cetak, panggil `addDeliveryRecord(...)` dari `mockData.ts` untuk memindahkannya ke tabel Pengiriman.
   - Status awal pengiriman adalah `PENDING` ("Menunggu Pengambilan").

### B. Pengiriman & Tracking (`/pengiriman/data`)
1. Memiliki 4 Status:
   - `PENDING`: "Menunggu Pengambilan" (Badge Kuning/Amber). *Tidak ada tombol ambil kurir di status ini*.
   - `DALAM_PROSES`: "Dalam Perjalanan" (Badge Biru).
   - `TERKIRIM`: "Terkirim" (Badge Hijau).
   - `RETUR`: "Retur / Gagal" (Badge Merah).
2. KPI Cards:
   - Card 1: Total Permintaan / Pengiriman (`gradient from-[#08874f] to-[#046138]`).
   - Card 2: Menunggu Pengambilan.
   - Card 3: Dalam Perjalanan.
   - Card 4: Sukses Terkirim.

### C. Tracking Route Engine (`TrackingMap.tsx`)
- Menggunakan OSRM router:
  `https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson`
- Wajib memiliki fallback koordinat jalan raya (seperti `FALLBACK_BANDUNG_ROAD`) agar Leaflet tidak pernah memotong garis lurus (*bypass* bangunan/jalan).

---

## 3. UI Token & Styling Guideline Bapenda

```tsx
// Palette Warna Bapenda
const colors = {
  primary: "#08874f",     // Hijau Utama
  hover: "#06683d",       // Hijau Gelap Saat Hover
  active: "#046138",      // Hijau Deep / Gradient End
  badgeBg: "#dcfce7",     // Hijau Muda Background Badge
  badgeText: "#08874f",   // Hijau Text Badge
  borderLight: "#bbf7d0", // Hijau Muda Border
};

// Standar Tombol Utama
<button className="bg-[#08874f] hover:bg-[#06683d] text-white font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2">
  Simpan Data
</button>

// Standar Table Header
<th className="bg-[#08874f] text-white font-semibold py-3.5 px-4 text-xs tracking-wider uppercase text-left">
  Nama Field
</th>
```

---

## 4. Troubleshooting & Kecepatan Eksekusi (Fast-Path Rules)

1. **Jangan mencari file ke mana-mana**: Cek tabel Section 1 di atas, file yang relevan selalu berada di `src/pages/<fitur>` dan `src/services/<fitur>Service.ts`.
2. **Periksa Lucide Icons**: Versi terpasang adalah `0.279.0`. Gunakan ikon standar:
   - `Printer`, `Truck`, `FileText`, `CheckCircle2`, `Clock`, `AlertTriangle`, `Search`, `Users`, `Key`, `RefreshCw`, `Plus`, `Trash2`, `Edit`, `MapPin`.
3. **Selalu validasi build sebelum selesai**: Jalankan `npm run build` untuk memastikan tidak ada TypeScript error atau broken import.

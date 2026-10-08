# Panduan Arsitektur & Aturan Agen - Dashboard Cetak & Pengiriman SKKP Bapenda Jabar

> **Dokumen ini adalah Single Source of Truth bagi AI Assistant / Developer** untuk mempercepat pemahaman codebase, navigasi file yang tepat sasaran, dan implementasi fitur tanpa kesalahan konvensi.

---

## 1. Ringkasan Project & Tech Stack

Aplikasi dashboard web operasional dan monitoring untuk penerbitan serta distribusi **Surat Ketetapan Kewajiban Pembayaran (SKKP) Pajak Kendaraan Bermotor (SAMSAT Jawa Barat)**.

- **Frontend Core**: React 18 (TypeScript), Vite
- **Styling**: Tailwind CSS, SCSS (`src/index.scss`), Lucide React (`v0.279.0`)
- **UI Components**: Shadcn UI / Radix UI, Framer Motion
- **Networking & State**: Axios (`src/services/axios.ts`), React Query (`@tanstack/react-query`), LocalStorage (`src/services/localStorageService.ts`)
- **Mapping / GIS**: Leaflet & React Leaflet (`react-leaflet`), OSRM Road Routing API
- **Routing**: React Router DOM v6 (`src/routes.tsx`)

---

## 2. Peta Direktori & Navigasi Cepat (Quick File Locator)

Ketika mendapat tugas di modul tertentu, langsung tuju file-file berikut tanpa perlu pencarian berulang:

```
src/
├── pages/
│   ├── beranda/                 # [Dashboard Utama] Ringkasan KPI, grafik capaian, speedometer & odometer
│   │   └── index.tsx
│   ├── pengiriman-cetak/        # [Pengelolaan Cetak SKKP] Tabel berkas, filter tanggal & samsat, tombol Cetak & "Siap Kirim"
│   │   └── index.tsx
│   ├── pengiriman-data/         # [Pengiriman & Tracking SKKP] 4 status card, tabel tracking, aksi lacak
│   │   └── index.tsx
│   ├── pengiriman-tracking/     # [Detail Lacak & Tracking Map] Timeline checkpoint, OSRM road Leaflet map
│   │   └── index.tsx
│   ├── pengiriman-laporan/      # [Laporan & Rekapitulasi] Rekapitulasi per-Samsat, ekspor data, agregasi capaian
│   │   └── index.tsx
│   ├── manajemen-user/          # [Manajemen Pengguna] CRUD User Admin/Petugas, reset password, filter Samsat Jabar
│   │   └── index.tsx
│   ├── login/ & logout/         # Autentikasi sistem (Login form, logout handler)
│   └── change-password/         # Ubah sandi akun
│
├── services/
│   ├── cetakSkkpService.ts      # Logic antrean cetak SKKP, print handler, perpindahan data ke status kirim
│   ├── mockData.ts              # Single Source of Truth data pengiriman, tracking checkpoints, rekap Samsat
│   ├── userService.ts           # CRUD mock user admin, daftar 30 kode Samsat/wilayah Jabar
│   ├── axios.ts                 # Axios interceptor instance
│   └── localStorageService.ts   # Helper simpan token & state lokal
│
├── components/
│   ├── card/
│   │   ├── MainCard.tsx         # Card container standar ber-header, subtitle, action buttons
│   │   └── MainCardWhite.tsx    # Card container putih minimalis
│   ├── features/
│   │   ├── tracking/
│   │   │   └── TrackingMap.tsx  # Peta rute kurir Leaflet dengan OSRM driving engine & fallback jalan raya
│   │   ├── date/
│   │   │   ├── DatePicker.tsx   # Single date picker Bapenda
│   │   │   └── RangeDatePicker.tsx # Range filter tanggal
│   │   ├── table/               # Base table pagination, sorting, search filter
│   │   └── select/              # Select wilayah & dropdown filter
│   └── ui/                      # Atomic Shadcn/Radix components (Button, Dialog, Input, Badge, Table, dll.)
│
├── layout/
│   ├── index.tsx                # Main layout wrapper
│   ├── Header/index.tsx         # Top bar dengan profile, notifikasi, breadcrumbs
│   └── Sidebar/index.tsx        # Collapsible sidebar (hover expand + pin toggle)
│
├── routes.tsx                   # Central route registry (AuthGuard & Lazy load)
├── types/index.ts               # Central TypeScript definitions (DeliveryRecord, CetakSKKPRecord, UserRecord, dll.)
└── utils/
    ├── utils.ts                 # Number, currency, and date formatting helpers
    └── menuItems.ts             # Sidebar menu hierarchy definition
```

---

## 3. Aturan Bisnis & Lifecycle Status Berkas SKKP

Alur berkas SKKP di sistem ini memiliki aturan ketat yang saling terhubung:

### A. Alur Cetak & Perpindahan ke Pengiriman
1. **Pengelolaan Cetak SKKP (`/pengiriman/cetak`)**:
   - Status Berkas: `BELUM_DICETAK` ➔ `SUDAH_DICETAK`.
   - Tombol **"Siap Kirim"**:
     - Hanya aktif setelah berkas berstatus `SUDAH_DICETAK`.
     - **PENTING**: Ketika tombol "Siap Kirim" diklik pada satu baris, data tersebut otomatis dihilangkan dari tabel cetak dan **langsung masuk ke antrean Pengiriman & Tracking SKKP**.
     - Status awal saat masuk ke pengiriman adalah `PENDING` ("Menunggu Pengambilan").

2. **Pengiriman & Tracking SKKP (`/pengiriman/data`)**:
   - Memiliki 4 Status Resmi:
     1. `PENDING` &rarr; Teks UI: **Menunggu Pengambilan** (Badge Amber / Kuning)
     2. `DALAM_PROSES` &rarr; Teks UI: **Dalam Perjalanan** (Badge Biru)
     3. `TERKIRIM` &rarr; Teks UI: **Terkirim** (Badge Hijau)
     4. `RETUR` &rarr; Teks UI: **Retur / Gagal** (Badge Merah)
   - Pada status `PENDING`, **tidak boleh ada tombol "Ambil Kurir" langsung**; kurir mengambil dari gudang/hub distribusi sebelum status berubah menjadi `DALAM_PROSES`.

3. **Detail Lacak & Tracking Map (`/pengiriman/tracking`)**:
   - Menggunakan rute jalan nyata via **OSRM Engine** (`router.project-osrm.org/route/v1/driving/...`).
   - Tidak boleh membuat rute garis lurus (*bypass* jalan); jika fetch OSRM gagal, gunakan titik waypoint jalan raya (`FALLBACK_BANDUNG_ROAD`).

---

## 4. Standar Desain & Visual Bapenda (Design System)

- **Warna Identitas Bapenda Jabar**:
  - Warna Utama / Emerald: `#08874f` (`bg-[#08874f]`, `text-[#08874f]`, `border-[#08874f]`)
  - Hover Emerald: `#06683d`
  - Dark Accent: `#046138`
  - Light Accent Badge / Tint: `bg-[#dcfce7]`, `text-[#08874f]`, `border-[#bbf7d0]`
- **Header Tabel**:
  - Selalu seragam: `bg-[#08874f] text-white font-semibold py-3.5 px-4 text-xs tracking-wider`.
- **Card KPI Summary**:
  - Card 1 (Total): Gradient emerald `bg-gradient-to-br from-[#08874f] to-[#046138] text-white shadow-lg`.
  - Card 2-4: `bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm`.
- **Sidebar**:
  - Mendukung mode **Hover Expand** (melebar saat mouse masuk, mengecil saat mouse keluar) dan mode **Pin Locked** (tetap terbuka jika tombol pin diaktifkan).

---

## 5. Standar Format Data (Formatter Helpers)

Gunakan selalu helper di `src/utils/utils.ts`:
- **Mata Uang**: Format Rupiah lengkap titik: `Rp. 1.250.000` (fungsi `formatRupiah` atau helper terkait).
- **Persentase**: Format 2 desimal koma: `94,50 %` atau `98,25 %`.
- **Tanggal**: Standar Indonesia: `DD-MM-YYYY` (contoh: `08-10-2026`) atau `DD MMMM YYYY`.

---

## 6. Caveat & Tips Teknis Khusus (Gotchas)

1. **Versi Lucide React (`v0.279.0`)**:
   - Selalu gunakan ikon-ikon yang ada di versi ini (misal: `Printer`, `Truck`, `FileText`, `CheckCircle2`, `Clock`, `AlertTriangle`, `Search`, `Users`, `Key`, `RefreshCw`, `Pin`, `PinOff`, `ChevronRight`).
   - Jangan mengimpor nama ikon yang baru ditambahkan di rilis Lucide modern (seperti `PackageCheck` atau nama experimental) tanpa memverifikasi ketersediaannya terlebih dahulu.
2. **State Sharing antar Halaman**:
   - Data pengiriman tersambung di `src/services/mockData.ts` dan diekspos melalui function `addDeliveryRecord`, `getDeliveryRecords`, dll.
   - Perubahan data cetak dan kirim di memori akan langsung tersinkronisasi jika menggunakan helper di `src/services/cetakSkkpService.ts`.
3. **Modal & Form Dialog**:
   - Pastikan setiap dialog (seperti Tambah User, Reset Password, Konfirmasi Cetak) memiliki tombol aksi jelas dengan warna `#08874f`, validasi form, dan feedback toast / alert yang ramah pengguna.

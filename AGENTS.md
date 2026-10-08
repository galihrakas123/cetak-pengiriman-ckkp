# Dashboard Pengiriman SKKP - Agent Rules & Architecture

## Repository Overview
Aplikasi dashboard monitoring untuk pengiriman Surat Ketetapan Kewajiban Pembayaran (SKKP).
- **Tech Stack**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI / Radix UI, Framer Motion, Axios, React Query.

## Architecture & Project Structure
- `src/components/ui`: Komponen atomik Shadcn UI / Radix UI (Button, Input, Badge, Dialog, Select, Dropdown, Table, dll).
- `src/components/features`: Komponen feature reusable (Date picker, Range date picker, Select wilayah, Base table pagination/sorting, dll).
- `src/components/card`: Reusable Card containers (`MainCard`, `SubCard`, `MainCardWhite`).
- `src/components/auth`: Route guards (`AuthGuard`, `GuestGuard`, `RolesGuard`).
- `src/layout`: Layout aplikasi dashboard dengan Sidebar yang collapsible dan User Menu.
- `src/pages`: Halaman modular aplikasi (`beranda`, `login`, `logout`, `change-password`, `not-found`, `maintenance-page`).
- `src/routes.tsx`: Manajemen routing tersentralisasi dengan lazy loading dan guard.
- `src/contexts`: State global autentikasi (`AuthContext`) dan konfigurasi UI/Sidebar (`ConfigContext`).
- `src/services`: Konfigurasi Axios HTTP client & Local Storage helper.
- `src/utils`: Helper functions, formatting, and menu navigation configuration (`menuItems.ts`).

## Code Conventions & Standards
1. **Design System & Aesthetics**: High-density dashboard yang clean, modern, dan responsif.
2. **Number & Date Formatting**:
   - Format Rupiah: `Rp. xx.xxx.xxx`.
   - Format Persentase: 2 desimal koma (contoh: `94,50 %`).
   - Format Tanggal: Standar Indonesia `DD-MM-YYYY` atau `YYYY-MM-DD`.
3. **Table Standards**:
   - Header jelas dengan sorting dan pagination.
   - Status tracking yang informatif dengan visual badge (Terkirim, Dalam Perjalanan, Retur/Gagal, Pending).

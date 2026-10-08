# Standar Koding & Konvensi Proyek SKKP Bapenda

1. **Konsistensi Bahasa & Istilah**:
   - Status Pengiriman:
     - `PENDING` => "Menunggu Pengambilan" (bukan "Menunggu Kirim")
     - `DALAM_PROSES` => "Dalam Perjalanan"
     - `TERKIRIM` => "Terkirim"
     - `RETUR` => "Retur / Gagal"
   - Status Cetak:
     - `BELUM_DICETAK` => "Belum Dicetak"
     - `SUDAH_DICETAK` => "Sudah Dicetak"

2. **Format Standar Tampilan**:
   - Rupiah: Format `Rp. xx.xxx.xxx` (menggunakan titik pemisah ribuan).
   - Persentase: Menggunakan 2 digit koma (contoh: `94,50 %`).
   - Tanggal: `DD-MM-YYYY` (contoh: `08-10-2026`).

3. **Komponen Reusable**:
   - Gunakan `MainCard` dari `@/components/card/MainCard` sebagai pembungkus utama halaman tabel atau form.
   - Gunakan `DatePicker` dari `@/components/features/date/DatePicker` saat menyematkan filter tanggal.
   - Gunakan warna Bapenda `#08874f` sebagai primary accent di seluruh tombol submit, highlight badge, dan header tabel.

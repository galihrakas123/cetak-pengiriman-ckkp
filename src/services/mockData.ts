import {
  DeliveryRecord,
  DeliveryStatus,
  SummaryStats,
  RekapSamsat,
  WilayahCapaian,
  TrackingCheckpoint,
} from "@/types";

/**
 * =====================================================================
 * DATA MOCK TERSENTRALISASI - DASHBOARD PENGIRIMAN SKKP
 * File ini merupakan Single Source of Truth untuk seluruh data dummy frontend.
 * =====================================================================
 */

export const mockSummaryStats: SummaryStats = {
  totalPengiriman: 12450,
  suksesTerkirim: 11820,
  dalamPerjalanan: 480,
  returGagal: 150,
  tingkatKeberhasilan: "94.9%",
  pertumbuhanPersen: "+8.5%",
};

export const mockDeliveries: DeliveryRecord[] = [
  {
    id: "1",
    noResi: "SKKP-2026-009182",
    noPolisi: "D 7721 ZAA",
    namaWp: "Ahmad Suryadi",
    alamatWp: "Jl. Riau No. 45, Bandung",
    samsat: "Samsat Bandung Barat",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2026-10-07",
    status: "TERKIRIM",
    kurirNama: "Asep Sunandar",
    kurirPhone: "0812-9876-5432",
    jarakKm: "14.2 km",
    estimasiWaktu: "35 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Cimahi, Bandung Barat",
    tujuanKota: "Riau, Bandung",
  },
  {
    id: "2",
    noResi: "SKKP-2026-009183",
    noPolisi: "D 8812 KBB",
    namaWp: "Yuni Shara",
    alamatWp: "Jl. Soekarno Hatta No. 120, Bandung",
    samsat: "Samsat Bandung Timur",
    ekspedisi: "JNE Express",
    tanggalKirim: "2026-10-07",
    status: "DALAM_PROSES",
    kurirNama: "Devon Lane",
    kurirPhone: "0821-3456-7890",
    jarakKm: "22.5 km",
    estimasiWaktu: "50 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Arcamanik, Bandung Timur",
    tujuanKota: "Batununggal, Bandung",
  },
  {
    id: "3",
    noResi: "SKKP-2026-009184",
    noPolisi: "F 2319 CD",
    namaWp: "Ahmad Fauzi",
    alamatWp: "Jl. Pajajaran No. 88, Bogor",
    samsat: "Samsat Kota Bogor",
    ekspedisi: "SiCepat",
    tanggalKirim: "2026-10-06",
    status: "TERKIRIM",
    kurirNama: "Bambang Pamungkas",
    kurirPhone: "0857-1122-3344",
    jarakKm: "8.4 km",
    estimasiWaktu: "25 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Baranangsiang, Bogor",
    tujuanKota: "Pajajaran, Bogor",
  },
  {
    id: "4",
    noResi: "SKKP-2026-009185",
    noPolisi: "B 6789 KL",
    namaWp: "Hendrawan",
    alamatWp: "Jl. Ahmad Yani No. 15, Bekasi",
    samsat: "Samsat Kota Bekasi",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2026-10-06",
    status: "RETUR",
    kurirNama: "Dedi Kusnadi",
    kurirPhone: "0813-8899-0011",
    jarakKm: "16.8 km",
    estimasiWaktu: "1 Hari",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Bekasi Selatan",
    tujuanKota: "Bekasi Barat",
  },
  {
    id: "5",
    noResi: "SKKP-2026-009186",
    noPolisi: "E 9921 QW",
    namaWp: "Gunawan Wibisono",
    alamatWp: "Jl. Kartini No. 22, Cirebon",
    samsat: "Samsat Kota Cirebon",
    ekspedisi: "J&T Express",
    tanggalKirim: "2026-10-05",
    status: "PENDING",
    kurirNama: "Menunggu Kurir",
    kurirPhone: "-",
    jarakKm: "5.1 km",
    estimasiWaktu: "Menunggu Pengambilan Kurir",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Kesambi, Cirebon",
    tujuanKota: "Kejaksan, Cirebon",
  },
  {
    id: "6",
    noResi: "SKKP-2026-009187",
    noPolisi: "D 9912 QA",
    namaWp: "Rian Hidayat",
    alamatWp: "Jl. Buah Batu No. 90, Bandung",
    samsat: "Samsat Bandung Tengah",
    ekspedisi: "JNE Express",
    tanggalKirim: "2026-10-05",
    status: "TERKIRIM",
    kurirNama: "Rudi Hartono",
    kurirPhone: "0819-3322-1100",
    jarakKm: "11.0 km",
    estimasiWaktu: "30 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Citarum, Bandung",
    tujuanKota: "Buahbatu, Bandung",
  },
  {
    id: "7",
    noResi: "SKKP-2026-009188",
    noPolisi: "T 3411 JK",
    namaWp: "Maya Indah",
    alamatWp: "Jl. Galuh Mas No. 5, Karawang",
    samsat: "Samsat Karawang",
    ekspedisi: "SiCepat",
    tanggalKirim: "2026-10-04",
    status: "TERKIRIM",
    kurirNama: "Teguh Santoso",
    kurirPhone: "0822-4455-6677",
    jarakKm: "13.5 km",
    estimasiWaktu: "40 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Klari, Karawang",
    tujuanKota: "Telukjambe, Karawang",
  },
  {
    id: "8",
    noResi: "SKKP-2026-009189",
    noPolisi: "Z 7721 OP",
    namaWp: "Agus Pratama",
    alamatWp: "Jl. H.Z. Mustofa No. 102, Tasikmalaya",
    samsat: "Samsat Kota Tasikmalaya",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2026-10-04",
    status: "DALAM_PROSES",
    kurirNama: "Farhan Maulana",
    kurirPhone: "0896-1234-5678",
    jarakKm: "9.2 km",
    estimasiWaktu: "20 Menit",
    beratBerkas: "1 Berkas SKKP",
    asalKota: "Cipedes, Tasikmalaya",
    tujuanKota: "Cihideung, Tasikmalaya",
  },
];

export const mockTrackingTimelines: Record<string, TrackingCheckpoint[]> = {
  "SKKP-2026-009182": [
    {
      time: "07 Okt 2026 - 14:30 WIB",
      status: "Terkirim & Diterima",
      desc: "Paket SKKP telah diterima oleh Budi Santoso (Wajib Pajak Yang Bersangkutan).",
      completed: true,
    },
    {
      time: "07 Okt 2026 - 09:15 WIB",
      status: "Kurir Menuju Alamat",
      desc: "Paket dibawa kurir Pos Indonesia (ID: KUR-082) menuju alamat penerima di Jl. Riau No. 45.",
      completed: true,
    },
    {
      time: "06 Okt 2026 - 21:00 WIB",
      status: "Tiba di Sorting Hub Bandung",
      desc: "Paket tiba di fasilitas sortir dan proses penjadwalan pengantaran.",
      completed: true,
    },
    {
      time: "06 Okt 2026 - 15:40 WIB",
      status: "Paket Diberangkatkan dari Samsat",
      desc: "Petugas Samsat Bandung Barat telah menyerahkan berkas SKKP ke ekspedisi Pos Indonesia.",
      completed: true,
    },
  ],
  default: [
    {
      time: "07 Okt 2026 - 11:00 WIB",
      status: "Dalam Perjalanan Ekspedisi",
      desc: "Paket sedang dalam perjalanan antar hub menuju kantor perwakilan wilayah tujuan.",
      completed: true,
    },
    {
      time: "06 Okt 2026 - 18:20 WIB",
      status: "Telah Diproses di Hub Asal",
      desc: "Berkas SKKP telah dipindai dan diverifikasi oleh ekspedisi rekanan.",
      completed: true,
    },
    {
      time: "06 Okt 2026 - 14:00 WIB",
      status: "Penyerahan dari Samsat",
      desc: "Berkas SKKP telah dicetak dan diserahkan ke jasa kurir pengiriman.",
      completed: true,
    },
  ],
};

export const mockRekapSamsat: RekapSamsat[] = [
  { nama: "Samsat Kota Bandung I Pajajaran", total: 1850, sukses: 1780, gagal: 15, proses: 55, rate: "96.2%" },
  { nama: "Samsat Kota Bandung II Kawaluyaan", total: 1620, sukses: 1550, gagal: 20, proses: 50, rate: "95.6%" },
  { nama: "Samsat Kota Bandung III Soekarno Hatta", total: 1940, sukses: 1880, gagal: 12, proses: 48, rate: "96.9%" },
  { nama: "Samsat Kabupaten Bandung Barat", total: 1420, sukses: 1350, gagal: 28, proses: 42, rate: "95.0%" },
  { nama: "Samsat Kota Bogor", total: 1750, sukses: 1680, gagal: 25, proses: 45, rate: "96.0%" },
  { nama: "Samsat Kota Bekasi", total: 2100, sukses: 1990, gagal: 35, proses: 75, rate: "94.7%" },
  { nama: "Samsat Kota Cirebon", total: 1770, sukses: 1590, gagal: 15, proses: 165, rate: "89.8%" },
];

export const mockWilayahCapaian: WilayahCapaian[] = [
  { nama: "Samsat Bandung Timur", persentase: 97.8 },
  { nama: "Samsat Kota Bogor", persentase: 96.2 },
  { nama: "Samsat Kota Cirebon", persentase: 94.5 },
  { nama: "Samsat Kota Bekasi", persentase: 91.3 },
];

// Helper methods untuk pemanggilan data oleh komponen UI
export const getSummaryStats = (): SummaryStats => mockSummaryStats;

export const getAllDeliveries = (): DeliveryRecord[] => mockDeliveries;

export const getDeliveryByResi = (resi: string): DeliveryRecord | undefined => {
  return mockDeliveries.find((d) => d.noResi.toLowerCase() === resi.toLowerCase().trim());
};

export const getTrackingTimeline = (resi?: string): TrackingCheckpoint[] => {
  if (resi && mockTrackingTimelines[resi]) {
    return mockTrackingTimelines[resi];
  }
  return mockTrackingTimelines.default;
};

export const getRekapSamsat = (): RekapSamsat[] => mockRekapSamsat;

export const getWilayahCapaian = (): WilayahCapaian[] => mockWilayahCapaian;

export const addDeliveryRecord = (delivery: DeliveryRecord): void => {
  const existingIdx = mockDeliveries.findIndex(
    (d) => d.noPolisi.toLowerCase() === delivery.noPolisi.toLowerCase() || d.noResi === delivery.noResi
  );
  if (existingIdx !== -1) {
    mockDeliveries.splice(existingIdx, 1);
  }
  mockDeliveries.unshift(delivery);
};

export const updateDeliveryStatus = (
  idOrResi: string,
  newStatus: DeliveryStatus,
  kurirData?: { kurirNama?: string; kurirPhone?: string }
): DeliveryRecord | undefined => {
  const item = mockDeliveries.find(
    (d) => d.id === idOrResi || d.noResi.toLowerCase() === idOrResi.toLowerCase()
  );
  if (item) {
    item.status = newStatus;
    if (kurirData?.kurirNama) {
      item.kurirNama = kurirData.kurirNama;
    } else if (newStatus === "DALAM_PROSES" && (!item.kurirNama || item.kurirNama.includes("Menunggu"))) {
      item.kurirNama = "Kurir " + (item.ekspedisi || "Logistik");
      item.kurirPhone = "0812-" + Math.floor(1000 + Math.random() * 9000) + "-5678";
    }
    if (newStatus === "DALAM_PROSES") {
      item.estimasiWaktu = "Sedang Diantar (Estimasi 30-45 Menit)";
    } else if (newStatus === "TERKIRIM") {
      item.estimasiWaktu = "Telah Diterima";
    }
  }
  return item;
};

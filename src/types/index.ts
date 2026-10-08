export type DeliveryStatus = "TERKIRIM" | "DALAM_PROSES" | "RETUR" | "PENDING";

export type CetakStatus = "BELUM_DICETAK" | "SUDAH_DICETAK";

export type StatusPengirimanSKKP = "PENDING" | "DALAM_PENGIRIMAN" | "DIKIRIM" | "TERKIRIM" | "RETUR";

export interface CetakSKKPRecord {
  id: string;
  no?: number;
  nopol: string;
  namaPemilik: string;
  nik?: string;
  tanggalPengajuan: string;
  statusCetak: CetakStatus;
  samsat: string;
  alamat?: string;
  jenisKendaraan?: string;
  noKohir?: string;
  kodeBayar?: string;
  nominalPkb?: number;
  nominalSwdkllj?: number;
  opsiPengiriman?: string;
  tanggalCetak?: string;
  petugasCetak?: string;
  statusPengiriman?: StatusPengirimanSKKP;
  noResi?: string;
  ekspedisi?: string;
  tanggalKirim?: string;
  isRead?: boolean;
  is_read?: boolean;
}

export interface CetakSummaryStats {
  totalPengajuan: number;
  belumDicetak: number;
  sudahDicetak: number;
  siapKirim: number;
  sudahTerkirim: number;
  dalamPengiriman: number;
}

export interface DeliveryRecord {
  id: string;
  noResi: string;
  noPolisi: string;
  namaWp: string;
  alamatWp: string;
  samsat: string;
  ekspedisi: string;
  tanggalKirim: string;
  status: DeliveryStatus;
  kurirNama?: string;
  kurirPhone?: string;
  jarakKm?: string;
  estimasiWaktu?: string;
  beratBerkas?: string;
  asalKota?: string;
  tujuanKota?: string;
}

export interface TrackingCheckpoint {
  time: string;
  status: string;
  desc: string;
  completed: boolean;
}

export interface SummaryStats {
  totalPengiriman: number;
  suksesTerkirim: number;
  dalamPerjalanan: number;
  returGagal: number;
  tingkatKeberhasilan: string;
  pertumbuhanPersen: string;
}

export interface RekapSamsat {
  nama: string;
  total: number;
  sukses: number;
  gagal: number;
  proses: number;
  rate: string;
}

export interface WilayahCapaian {
  nama: string;
  persentase: number;
}

export interface UserProfile {
  username: string;
  role: string;
  bidang?: string;
  kode_wilayah?: string;
  nama_wilayah?: string;
  [key: string]: any;
}

export interface MenuItem {
  name: string;
  id: string;
  icon: string;
  link?: string;
  collapsed?: boolean;
  role: string | string[];
  children?: {
    name: string;
    link: string;
    role: string | string[];
    icon?: string;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

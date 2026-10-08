import { CetakSKKPRecord, CetakStatus, CetakSummaryStats } from "@/types";

/**
 * =====================================================================
 * MOCK SERVICE: PENGELOLAAN CETAK SKKP (SAMBARA)
 * Simulasi API asynchronous menggunakan Promise & Delay realistis
 * =====================================================================
 */

const initialCetakList: CetakSKKPRecord[] = [
  {
    id: "CTK-2026-001",
    nopol: "D 1842 ABX",
    namaPemilik: "Budi Santoso",
    nik: "3273241508820001",
    tanggalPengajuan: "07-10-2026 08:30",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kota Bandung I Pajajaran",
    alamat: "Jl. Riau No. 45, Citarum, Bandung",
    jenisKendaraan: "Sepeda Motor / Honda Vario 160",
    noKohir: "KOHIR-JBR-8829101",
    kodeBayar: "99283182901",
    nominalPkb: 345000,
    nominalSwdkllj: 35000,
    opsiPengiriman: "Pos Indonesia (Kilat Khusus)",
    statusPengiriman: "PENDING",
    isRead: false,
    is_read: false,
  },
  {
    id: "CTK-2026-002",
    nopol: "D 4451 ZG",
    namaPemilik: "Siti Rahmawati",
    nik: "3273185203910004",
    tanggalPengajuan: "07-10-2026 09:15",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Bandung II Kawaluyaan",
    alamat: "Jl. Soekarno Hatta No. 120, Bandung",
    jenisKendaraan: "Mobil Penumpang / Toyota Avanza 1.5 G",
    noKohir: "KOHIR-JBR-8829102",
    kodeBayar: "99283182902",
    nominalPkb: 2850000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "JNE Express (Reguler)",
    tanggalCetak: "07-10-2026 10:20",
    petugasCetak: "Petugas Samsat Pajajaran",
    statusPengiriman: "PENDING",
    isRead: true,
    is_read: true,
  },
  {
    id: "CTK-2026-003",
    nopol: "B 2091 KFL",
    namaPemilik: "Hendra Gunawan",
    nik: "3275021907850002",
    tanggalPengajuan: "07-10-2026 09:45",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kota Bekasi",
    alamat: "Jl. Ahmad Yani No. 88, Bekasi Selatan",
    jenisKendaraan: "Mobil Penumpang / Honda HR-V 1.5",
    noKohir: "KOHIR-JBR-8829103",
    kodeBayar: "99283182903",
    nominalPkb: 3650000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "Pos Indonesia (Same Day)",
    statusPengiriman: "PENDING",
    isRead: false,
    is_read: false,
  },
  {
    id: "CTK-2026-004",
    nopol: "F 5102 BA",
    namaPemilik: "Dewi Lestari",
    nik: "3271046109930005",
    tanggalPengajuan: "07-10-2026 10:05",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Bogor",
    alamat: "Jl. Pajajaran No. 34, Bogor Tengah",
    jenisKendaraan: "Sepeda Motor / Yamaha NMAX 155",
    noKohir: "KOHIR-JBR-8829104",
    kodeBayar: "99283182904",
    nominalPkb: 420000,
    nominalSwdkllj: 35000,
    opsiPengiriman: "JNE Express",
    tanggalCetak: "07-10-2026 11:00",
    petugasCetak: "Ahmad Junaedi",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-005",
    nopol: "E 3391 YN",
    namaPemilik: "Ridwan Maulana",
    nik: "3274011204880003",
    tanggalPengajuan: "07-10-2026 10:30",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kota Cirebon",
    alamat: "Jl. Siliwangi No. 12, Kejaksan, Cirebon",
    jenisKendaraan: "Sepeda Motor / Honda Scoopy",
    noKohir: "KOHIR-JBR-8829105",
    kodeBayar: "99283182905",
    nominalPkb: 290000,
    nominalSwdkllj: 35000,
    opsiPengiriman: "Pos Indonesia",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-006",
    nopol: "Z 4821 TA",
    namaPemilik: "Nurul Hidayah",
    nik: "3278035501900006",
    tanggalPengajuan: "07-10-2026 11:00",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Tasikmalaya",
    alamat: "Jl. HZ Mustofa No. 201, Tasikmalaya",
    jenisKendaraan: "Mobil Penumpang / Daihatsu Sigra 1.2",
    noKohir: "KOHIR-JBR-8829106",
    kodeBayar: "99283182906",
    nominalPkb: 2150000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "Kurir Internal Bapenda",
    tanggalCetak: "07-10-2026 11:30",
    petugasCetak: "Rizky Ramadhan",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-007",
    nopol: "D 8912 VKM",
    namaPemilik: "Agus Setiawan",
    nik: "3217082305870001",
    tanggalPengajuan: "07-10-2026 11:20",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kabupaten Bandung Barat",
    alamat: "Jl. Raya Padalarang No. 77, Padalarang",
    jenisKendaraan: "Mobil Barang / Mitsubishi Colt Diesel",
    noKohir: "KOHIR-JBR-8829107",
    kodeBayar: "99283182907",
    nominalPkb: 3100000,
    nominalSwdkllj: 163000,
    opsiPengiriman: "Pos Indonesia",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-008",
    nopol: "B 1024 PZQ",
    namaPemilik: "Maya Anggraeni",
    nik: "3275044408940008",
    tanggalPengajuan: "07-10-2026 11:45",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Bekasi",
    alamat: "Harapan Indah Blok FB No. 10, Bekasi",
    jenisKendaraan: "Mobil Penumpang / Hyundai Creta 1.5",
    noKohir: "KOHIR-JBR-8829108",
    kodeBayar: "99283182908",
    nominalPkb: 3950000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "Pos Indonesia",
    tanggalCetak: "07-10-2026 12:15",
    petugasCetak: "Yudha Pratama",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-009",
    nopol: "D 3349 CL",
    namaPemilik: "Firman Utina",
    nik: "3273091412790002",
    tanggalPengajuan: "07-10-2026 12:10",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kota Bandung III Soekarno Hatta",
    alamat: "Jl. Buah Batu No. 200, Bandung",
    jenisKendaraan: "Sepeda Motor / Honda PCX 160",
    noKohir: "KOHIR-JBR-8829109",
    kodeBayar: "99283182909",
    nominalPkb: 450000,
    nominalSwdkllj: 35000,
    opsiPengiriman: "JNE Express",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-010",
    nopol: "F 6712 XY",
    namaPemilik: "Rahmat Hidayat",
    nik: "3201120506860007",
    tanggalPengajuan: "07-10-2026 12:35",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Bogor",
    alamat: "Jl. Sudirman No. 55, Pabaton, Bogor",
    jenisKendaraan: "Mobil Penumpang / Suzuki Ertiga GX",
    noKohir: "KOHIR-JBR-8829110",
    kodeBayar: "99283182910",
    nominalPkb: 2450000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "Pos Indonesia",
    tanggalCetak: "07-10-2026 13:00",
    petugasCetak: "Ahmad Junaedi",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-011",
    nopol: "E 1902 MN",
    namaPemilik: "Diana Safitri",
    nik: "3209154702920003",
    tanggalPengajuan: "07-10-2026 13:05",
    statusCetak: "BELUM_DICETAK",
    samsat: "Samsat Kota Cirebon",
    alamat: "Jl. Kartini No. 41, Cirebon",
    jenisKendaraan: "Sepeda Motor / Honda Beat ESP",
    noKohir: "KOHIR-JBR-8829111",
    kodeBayar: "99283182911",
    nominalPkb: 260000,
    nominalSwdkllj: 35000,
    opsiPengiriman: "JNE Express",
    statusPengiriman: "PENDING",
  },
  {
    id: "CTK-2026-012",
    nopol: "Z 2145 BD",
    namaPemilik: "Bambang Pamungkas",
    nik: "3206101103830009",
    tanggalPengajuan: "07-10-2026 13:20",
    statusCetak: "SUDAH_DICETAK",
    samsat: "Samsat Kota Tasikmalaya",
    alamat: "Jl. Sutisna Senjaya No. 89, Tasikmalaya",
    jenisKendaraan: "Mobil Penumpang / Honda Brio Satya",
    noKohir: "KOHIR-JBR-8829112",
    kodeBayar: "99283182912",
    nominalPkb: 2100000,
    nominalSwdkllj: 143000,
    opsiPengiriman: "Pos Indonesia",
    tanggalCetak: "07-10-2026 13:40",
    petugasCetak: "Rizky Ramadhan",
    statusPengiriman: "PENDING",
  },
];

// In-memory data store yang reaktif terhadap mutasi selama sesi aplikasi
let cetakDatabase: CetakSKKPRecord[] = [...initialCetakList];

/**
 * Filter parameter options
 */
export interface FetchCetakFilterParams {
  search?: string;
  status?: string;
  samsat?: string;
}

/**
 * Simulasi latency network
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const cetakSkkpService = {
  /**
   * Fetch seluruh data cetak SKKP dengan filtering
   */
  async fetchCetakSkkpList(params?: FetchCetakFilterParams): Promise<CetakSKKPRecord[]> {
    await delay(300);

    let result = [...cetakDatabase];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.nopol.toLowerCase().includes(q) ||
          item.namaPemilik.toLowerCase().includes(q) ||
          item.noKohir?.toLowerCase().includes(q) ||
          item.kodeBayar?.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== "ALL") {
      result = result.filter((item) => item.statusCetak === params.status);
    }

    if (params?.samsat && params.samsat !== "ALL") {
      result = result.filter((item) => item.samsat.includes(params.samsat!));
    }

    return result;
  },

  /**
   * Mengubah status cetak (toggle antara BELUM_DICETAK & SUDAH_DICETAK)
   */
  async updateStatusCetak(id: string, status: CetakStatus): Promise<CetakSKKPRecord> {
    await delay(350);

    const index = cetakDatabase.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Data pengajuan SKKP tidak ditemukan.");
    }

    const now = new Date();
    const formattedNow = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated: CetakSKKPRecord = {
      ...cetakDatabase[index],
      statusCetak: status,
      tanggalCetak: status === "SUDAH_DICETAK" ? formattedNow : undefined,
      petugasCetak: status === "SUDAH_DICETAK" ? "Petugas Bapenda" : undefined,
    };

    cetakDatabase[index] = updated;
    return updated;
  },

  /**
   * Memproses Pengiriman SKKP setelah berkas dicetak
   */
  async prosesKirimSKKP(payload: {
    id: string;
    ekspedisi: string;
    noResi: string;
    catatan?: string;
  }): Promise<CetakSKKPRecord> {
    await delay(400);

    const index = cetakDatabase.findIndex((item) => item.id === payload.id);
    if (index === -1) {
      throw new Error("Data berkas SKKP tidak ditemukan.");
    }

    const updated: CetakSKKPRecord = {
      ...cetakDatabase[index],
      statusPengiriman: "DIKIRIM",
      ekspedisi: payload.ekspedisi,
      noResi: payload.noResi,
    };

    cetakDatabase[index] = updated;
    return updated;
  },

  /**
   * Update massal (Batch Print)
   */
  async batchUpdateStatusCetak(ids: string[], status: CetakStatus): Promise<CetakSKKPRecord[]> {
    await delay(500);

    const now = new Date();
    const formattedNow = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    cetakDatabase = cetakDatabase.map((item) => {
      if (ids.includes(item.id)) {
        return {
          ...item,
          statusCetak: status,
          tanggalCetak: status === "SUDAH_DICETAK" ? formattedNow : undefined,
          petugasCetak: status === "SUDAH_DICETAK" ? "Petugas Bapenda" : undefined,
        };
      }
      return item;
    });

    return cetakDatabase.filter((item) => ids.includes(item.id));
  },

  /**
   * Dapatkan statistik ringkasan cetak
   */
  async fetchCetakStats(): Promise<CetakSummaryStats> {
    await delay(200);

    const totalPengajuan = cetakDatabase.length;
    const belumDicetak = cetakDatabase.filter((i) => i.statusCetak === "BELUM_DICETAK").length;
    const sudahDicetak = cetakDatabase.filter((i) => i.statusCetak === "SUDAH_DICETAK").length;
    const siapKirim = cetakDatabase.filter(
      (i) => i.statusCetak === "SUDAH_DICETAK" && i.statusPengiriman !== "DIKIRIM"
    ).length;

    return {
      totalPengajuan,
      belumDicetak,
      sudahDicetak,
      siapKirim,
    };
  },

  /**
   * Mengambil data SKKP baru yang belum dicetak dan belum dibaca (Unread)
   */
  async fetchUnreadNotifications(): Promise<CetakSKKPRecord[]> {
    await delay(150);
    return cetakDatabase.filter(
      (item) => item.statusCetak === "BELUM_DICETAK" && item.isRead !== true && item.is_read !== true
    );
  },

  /**
   * Tandai notifikasi sebagai dibaca (isRead = true)
   * Data tetap berstatus BELUM_DICETAK di tabel utama
   */
  async markNotificationAsRead(id: string): Promise<CetakSKKPRecord> {
    await delay(100);
    const index = cetakDatabase.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Data berkas SKKP tidak ditemukan.");
    }

    cetakDatabase[index] = {
      ...cetakDatabase[index],
      isRead: true,
      is_read: true,
    };

    return cetakDatabase[index];
  },

  /**
   * Tandai semua notifikasi SKKP baru sebagai dibaca
   */
  async markAllNotificationsAsRead(): Promise<void> {
    await delay(150);
    cetakDatabase = cetakDatabase.map((item) => ({
      ...item,
      isRead: true,
      is_read: true,
    }));
  },

  /**
   * Cetak Langsung via Notifikasi:
   * Ubah status SKKP menjadi SUDAH_DICETAK dan tandai sudah dibaca
   */
  async cetakLangsung(id: string): Promise<CetakSKKPRecord> {
    await delay(200);
    const index = cetakDatabase.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Data berkas SKKP tidak ditemukan.");
    }

    const now = new Date();
    const formattedNow = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    cetakDatabase[index] = {
      ...cetakDatabase[index],
      statusCetak: "SUDAH_DICETAK",
      isRead: true,
      is_read: true,
      tanggalCetak: formattedNow,
      petugasCetak: "Petugas Online Bapenda",
    };

    return cetakDatabase[index];
  },

  /**
   * Simulasi Penambahan Data SKKP Baru dari Sambara secara Real-time
   */
  async simulateIncomingSambaraSKKP(): Promise<CetakSKKPRecord> {
    await delay(150);
    const now = new Date();
    const formattedNow = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const letters = ["B", "D", "E", "F", "T", "Z"];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNopol = `${randomLetter} ${Math.floor(1000 + Math.random() * 8999)} ${randomLetter}${randomLetter}`;
    const sampleNames = ["Agus Pratama", "Maya Anggraini", "Rizky Firmansyah", "Dian Sastro", "Gita Gutawa"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const sampleSamsat = [
      "Samsat Kota Bandung I Pajajaran",
      "Samsat Kota Bandung II Kawaluyaan",
      "Samsat Kota Bekasi",
      "Samsat Kota Bogor",
      "Samsat Kota Cirebon",
    ];

    const newDoc: CetakSKKPRecord = {
      id: `CTK-2026-${String(cetakDatabase.length + 1).padStart(3, "0")}`,
      nopol: randomNopol,
      namaPemilik: randomName,
      nik: `3273${String(Math.floor(100000000000 + Math.random() * 899999999999))}`,
      tanggalPengajuan: formattedNow,
      statusCetak: "BELUM_DICETAK",
      samsat: sampleSamsat[Math.floor(Math.random() * sampleSamsat.length)],
      alamat: "Jl. Merdeka No. " + (randomSerial % 100) + ", Jawa Barat",
      jenisKendaraan: randomSerial % 2 === 0 ? "Mobil Penumpang / Toyota Rush" : "Sepeda Motor / Honda Beat",
      noKohir: `KOHIR-JBR-${randomSerial}`,
      kodeBayar: `9928318${randomSerial}`,
      nominalPkb: randomSerial % 2 === 0 ? 2450000 : 320000,
      nominalSwdkllj: randomSerial % 2 === 0 ? 143000 : 35000,
      opsiPengiriman: "Pos Indonesia (Kilat Khusus)",
      statusPengiriman: "PENDING",
      isRead: false,
      is_read: false,
    };

    cetakDatabase.unshift(newDoc);
    return newDoc;
  },

  /**
   * Reset data mock ke default awal
   */
  resetData(): void {
    cetakDatabase = [...initialCetakList];
  },
};

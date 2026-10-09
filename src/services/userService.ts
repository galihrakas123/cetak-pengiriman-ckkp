export interface UserRecord {
  id: string;
  nama: string;
  noTelepon: string;
  kodeWilayah: string;
  namaWilayah: string;
  email: string;
  role: "ADMIN" | "PETUGAS";
  status: "AKTIF" | "NONAKTIF";
  tanggalDibuat: string;
  terakhirLogin?: string;
  password?: string;
  username?: string;
  surname?: string;
  kodeWilayahKerja?: string;
  jenisLayanan?: string;
}

export interface WilayahOption {
  kode: string;
  nama: string;
  samsat: string;
}

export const DAFTAR_WILAYAH_JABAR: WilayahOption[] = [
  { kode: "3200", nama: "Jawa Barat (Pusat)", samsat: "Bapenda Jabar Pusat" },
  { kode: "3273", nama: "Kota Bandung", samsat: "Samsat Kota Bandung I Pajajaran" },
  { kode: "3273B", nama: "Kota Bandung", samsat: "Samsat Kota Bandung II Kawaluyaan" },
  { kode: "3273C", nama: "Kota Bandung", samsat: "Samsat Kota Bandung III Soekarno Hatta" },
  { kode: "3204", nama: "Kabupaten Bandung", samsat: "Samsat Soreang" },
  { kode: "3217", nama: "Kabupaten Bandung Barat", samsat: "Samsat Padalarang" },
  { kode: "3277", nama: "Kota Cimahi", samsat: "Samsat Kota Cimahi" },
  { kode: "3271", nama: "Kota Bogor", samsat: "Samsat Kota Bogor" },
  { kode: "3201", nama: "Kabupaten Bogor", samsat: "Samsat Cibinong" },
  { kode: "3275", nama: "Kota Bekasi", samsat: "Samsat Kota Bekasi" },
  { kode: "3216", nama: "Kabupaten Bekasi", samsat: "Samsat Cikarang" },
  { kode: "3276", nama: "Kota Depok", samsat: "Samsat Kota Depok" },
  { kode: "3274", nama: "Kota Cirebon", samsat: "Samsat Kota Cirebon" },
  { kode: "3209", nama: "Kabupaten Cirebon", samsat: "Samsat Sumber" },
  { kode: "3278", nama: "Kota Tasikmalaya", samsat: "Samsat Kota Tasikmalaya" },
  { kode: "3206", nama: "Kabupaten Tasikmalaya", samsat: "Samsat Singaparna" },
  { kode: "3205", nama: "Kabupaten Garut", samsat: "Samsat Garut" },
  { kode: "3207", nama: "Kabupaten Ciamis", samsat: "Samsat Ciamis" },
  { kode: "3279", nama: "Kota Banjar", samsat: "Samsat Kota Banjar" },
  { kode: "3218", nama: "Kabupaten Pangandaran", samsat: "Samsat Pangandaran" },
  { kode: "3211", nama: "Kabupaten Sumedang", samsat: "Samsat Sumedang" },
  { kode: "3210", nama: "Kabupaten Majalengka", samsat: "Samsat Majalengka" },
  { kode: "3208", nama: "Kabupaten Kuningan", samsat: "Samsat Kuningan" },
  { kode: "3212", nama: "Kabupaten Indramayu", samsat: "Samsat Indramayu" },
  { kode: "3213", nama: "Kabupaten Subang", samsat: "Samsat Subang" },
  { kode: "3214", nama: "Kabupaten Purwakarta", samsat: "Samsat Purwakarta" },
  { kode: "3215", nama: "Kabupaten Karawang", samsat: "Samsat Karawang" },
  { kode: "3203", nama: "Kabupaten Cianjur", samsat: "Samsat Cianjur" },
  { kode: "3272", nama: "Kota Sukabumi", samsat: "Samsat Kota Sukabumi" },
  { kode: "3202", nama: "Kabupaten Sukabumi", samsat: "Samsat Palabuhanratu" },
];

const INITIAL_USERS: UserRecord[] = [
  {
    id: "USR-001",
    nama: "Budi Santoso, S.Kom",
    noTelepon: "0812-2345-6789",
    kodeWilayah: "3200",
    namaWilayah: "Bapenda Jabar Pusat",
    email: "budi.santoso@bapenda.jabarprov.go.id",
    role: "ADMIN",
    status: "AKTIF",
    tanggalDibuat: "01-09-2026",
    terakhirLogin: "08-10-2026 14:20",
    password: "1",
    username: "budi.santoso",
    surname: "Budi Santoso, S.Kom",
    kodeWilayahKerja: "Bapenda Jabar Pusat",
  },
  {
    id: "USR-002",
    nama: "Rizky Ramadhan",
    noTelepon: "0813-8821-9923",
    kodeWilayah: "3273",
    namaWilayah: "Samsat Kota Bandung I Pajajaran",
    email: "rizky.ramadhan@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "AKTIF",
    tanggalDibuat: "05-09-2026",
    terakhirLogin: "08-10-2026 15:10",
    password: "1",
    username: "rizky.ramadhan",
    surname: "Rizky Ramadhan",
    kodeWilayahKerja: "Samsat Kota Bandung I Pajajaran",
  },
  {
    id: "USR-003",
    nama: "Siti Rahmawati",
    noTelepon: "0857-1122-3344",
    kodeWilayah: "3273B",
    namaWilayah: "Samsat Kota Bandung II Kawaluyaan",
    email: "siti.rahmawati@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "AKTIF",
    tanggalDibuat: "10-09-2026",
    terakhirLogin: "08-10-2026 12:45",
    password: "1",
    username: "siti.rahmawati",
    surname: "Siti Rahmawati",
    kodeWilayahKerja: "Samsat Kota Bandung II Kawaluyaan",
  },
  {
    id: "USR-004",
    nama: "Ahmad Junaedi",
    noTelepon: "0821-7788-9900",
    kodeWilayah: "3271",
    namaWilayah: "Samsat Kota Bogor",
    email: "ahmad.junaedi@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "AKTIF",
    tanggalDibuat: "12-09-2026",
    terakhirLogin: "07-10-2026 17:30",
    password: "1",
    username: "ahmad.junaedi",
    surname: "Ahmad Junaedi",
    kodeWilayahKerja: "Samsat Kota Bogor",
  },
  {
    id: "USR-005",
    nama: "Yudha Pratama",
    noTelepon: "0819-3344-5566",
    kodeWilayah: "3275",
    namaWilayah: "Samsat Kota Bekasi",
    email: "yudha.pratama@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "AKTIF",
    tanggalDibuat: "15-09-2026",
    terakhirLogin: "08-10-2026 10:15",
    password: "1",
    username: "yudha.pratama",
    surname: "Yudha Pratama",
    kodeWilayahKerja: "Samsat Kota Bekasi",
  },
  {
    id: "USR-006",
    nama: "Hendra Gunawan",
    noTelepon: "0878-4455-6677",
    kodeWilayah: "3274",
    namaWilayah: "Samsat Kota Cirebon",
    email: "hendra.gunawan@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "AKTIF",
    tanggalDibuat: "20-09-2026",
    terakhirLogin: "06-10-2026 16:00",
    password: "1",
    username: "hendra.gunawan",
    surname: "Hendra Gunawan",
    kodeWilayahKerja: "Samsat Kota Cirebon",
  },
  {
    id: "USR-007",
    nama: "Nurul Hidayah, A.Md",
    noTelepon: "0812-9988-7766",
    kodeWilayah: "3278",
    namaWilayah: "Samsat Kota Tasikmalaya",
    email: "nurul.hidayah@bapenda.jabarprov.go.id",
    role: "PETUGAS",
    status: "NONAKTIF",
    tanggalDibuat: "25-09-2026",
    terakhirLogin: "02-10-2026 09:00",
    password: "1",
    username: "nurul.hidayah",
    surname: "Nurul Hidayah, A.Md",
    kodeWilayahKerja: "Samsat Kota Tasikmalaya",
  },
];

const STORAGE_KEY = "bapenda_user_management_db";

function loadUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: any[] = JSON.parse(raw);
      return parsed.map((u) => ({
        ...u,
        role: (u.role === "ADMIN" ? "ADMIN" : "PETUGAS") as "ADMIN" | "PETUGAS",
        password: u.password || "1",
      }));
    }
  } catch (e) {
    console.error("Gagal membaca database user lokal:", e);
  }
  return [...INITIAL_USERS];
}

function saveUsers(users: UserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Gagal menyimpan database user lokal:", e);
  }
}

// In-memory cache
let userDatabase: UserRecord[] = loadUsers();

export const userService = {
  getAllUsers(): UserRecord[] {
    return [...userDatabase];
  },

  getUserById(id: string): UserRecord | undefined {
    return userDatabase.find((u) => u.id === id);
  },

  createUser(payload: {
    nama: string;
    noTelepon: string;
    kodeWilayah: string;
    namaWilayah: string;
    email: string;
    role: "ADMIN" | "PETUGAS";
    status?: "AKTIF" | "NONAKTIF";
    password?: string;
    username?: string;
    surname?: string;
    kodeWilayahKerja?: string;
    jenisLayanan?: string;
  }): UserRecord {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    const nextNum = userDatabase.length + 1;
    const newId = `USR-${String(nextNum).padStart(3, "0")}`;

    const newUser: UserRecord = {
      id: newId,
      nama: payload.nama.trim(),
      noTelepon: payload.noTelepon.trim(),
      kodeWilayah: payload.kodeWilayah,
      namaWilayah: payload.namaWilayah,
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      status: payload.status || "AKTIF",
      tanggalDibuat: dateStr,
      terakhirLogin: "-",
      password: payload.password || "1",
      username: payload.username?.trim(),
      surname: payload.surname?.trim(),
      kodeWilayahKerja: payload.kodeWilayahKerja,
      jenisLayanan: payload.jenisLayanan,
    };

    userDatabase.unshift(newUser);
    saveUsers(userDatabase);
    return newUser;
  },

  updateUser(id: string, payload: Partial<Omit<UserRecord, "id" | "tanggalDibuat">>): UserRecord {
    const index = userDatabase.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("Pengguna tidak ditemukan");
    }

    userDatabase[index] = {
      ...userDatabase[index],
      ...payload,
    };

    saveUsers(userDatabase);
    return userDatabase[index];
  },

  resetPassword(id: string, newPass: string): UserRecord {
    const user = userDatabase.find((u) => u.id === id);
    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    user.password = newPass;
    saveUsers(userDatabase);
    return user;
  },

  toggleStatus(id: string): UserRecord {
    const user = userDatabase.find((u) => u.id === id);
    if (!user) {
      throw new Error("Pengguna tidak ditemukan");
    }

    user.status = user.status === "AKTIF" ? "NONAKTIF" : "AKTIF";
    saveUsers(userDatabase);
    return user;
  },

  deleteUser(id: string): void {
    userDatabase = userDatabase.filter((u) => u.id !== id);
    saveUsers(userDatabase);
  },
};

export const customStylesInputWithoutRounded = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? "var(--muted-foreground)"
      : "var(--background)",
    color: state.isDisabled ? "grey" : "var(--foreground)",
    border: state.isFocused ? "1px solid var(--primary)" : "",
    boxShadow: state.isFocused ? "1px solid var(--primary)" : 0,

  
    minWidth: "200px",
    maxHeight: "auto",
    cursor: state.isDisabled ? "not-allowed" : "default",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontSize: "14px",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "grey" : "var(--foreground)",
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: "155px",
    borderRadius: "8px",
    zIndex: "999",
  }),
  option: (provided, state) => ({
    ...provided,
    whiteSpace: "nowrap", // width option
    backgroundColor: state.isSelected ? "var(--primary)" : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: state.isSelected ? "var(--primary)" : "#f2f2f2",
      color: state.isSelected ? "white" : "black",
    },
    fontSize: "14px",
    zIndex: "99",
    textAlign: "center",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "grey" : "var(--foreground)",
    // Warna panah hijau
  }),
};

export const formatDate = (date) => {
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (date) {
    return new Date(date).toLocaleDateString("id-ID", options);
  } else {
    return null;
  }
};

export const formatNomorKeBulan = (nomor: any) => {
  switch (nomor) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "Mei";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Agu";
    case 9:
      return "Sep";
    case 10:
      return "Okt";
    case 11:
      return "Nov";
    case 12:
      return "Des";
    default:
      return ""; // Return empty string for invalid month number
  }
};

export const formatDateString = (dateString) => {
  if (!dateString) {
    return ""; // If dateString is null or undefined, return an empty string
  }

  const date = new Date(dateString);
  const options: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta", // Set the timezone to Indonesian timezone
  };

  return date
    .toLocaleDateString("id-ID", options)
    .replace(/(\d+)\/(\d+)\/(\d+),/, "$2/$1/$3"); // Remove the comma after the day
};

export const formatPercentage = (persentase) => {
  if (
    persentase === 0 ||
    persentase === undefined ||
    persentase === null ||
    Number.isNaN(persentase)
  ) {
    return 0;
  } else if (Number.isInteger(persentase)) {
    // Jika angka bulat, kembalikan tanpa desimal
    return persentase?.toLocaleString("id-ID");
  } else {
    // Jika bukan angka bulat, format dengan desimal
    return persentase?.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

export const formatNumber = (number) => {
  if (!number) return 0;
  return new Intl.NumberFormat("id-ID").format(number);
};

export const formatRupiah = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === "") return "Rp. 0";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "Rp. 0";
  return `Rp. ${new Intl.NumberFormat("id-ID").format(num)}`;
};

export const formatNumberWithTwoDecimals = (number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

/**
 * Format persentase murni tanpa pembulatan ke atas maupun ke bawah (truncation/pemotongan),
 * dengan format standar Indonesia (koma sebagai pemisah desimal, tepat 2 digit di belakang koma).
 * Contoh:
 * 25.6789 -> "25,67"
 * 25.6    -> "25,60"
 * 25      -> "25,00"
 */
export const formatPercentTrunc2 = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === "") return "0,00";
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return "0,00";

  const sign = num < 0 ? "-" : "";
  const absNum = Math.abs(num);

  const fixedStr = absNum.toFixed(8);
  const [intPart, decPart] = fixedStr.split(".");
  const twoDec = (decPart || "00").slice(0, 2);

  return `${sign}${intPart},${twoDec}`;
};

export const calculatePercentage = (
  realisasi: number | string | undefined | null,
  target: number | string | undefined | null
): number => {
  const r = Number(realisasi || 0);
  const t = Number(target || 0);
  if (t <= 0 || isNaN(r) || isNaN(t)) return 0;
  return (r / t) * 100;
};

export function deleteEmptyStringPayload(data) {
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] === "") {
      delete newData[key];
    }
  }
  return newData;
}

export function makeNullIntoEmptyStringPayload(data) {
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] === null) {
      newData[key] = "";
    }
  }
  return newData;
}

export const formatDateLocal = (dateString) => {
  if (!dateString) {
    return ""; // If dateString is null or undefined, return an empty string
  }

  const date = new Date(dateString);
  const options: any = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta", // Set the timezone to Indonesian timezone
  };

  return date
    .toLocaleDateString("id-ID", options)
    .replace(/(\d+)\/(\d+)\/(\d+),/, "$2/$1/$3"); // Remove the comma after the day
};

const timeZone: any = {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export const formatDatetoString = (date) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", timeZone).format(date);
  const [month, day, year] = formattedDate.split("/");
  const result = [year, month, day].join("-");
  return result;
};

export const formatDatePayload = (date) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", timeZone).format(date);
  const [month, day, year] = formattedDate.split("/");
  const result = [year, month, day].join("-");
  return result;
};

export const formatUrutanBulan = (bulan) => {
  switch (bulan) {
    case "Januari":
      return 1;
    case "Februari":
      return 2;
    case "Maret":
      return 3;
    case "April":
      return 4;
    case "Mei":
      return 5;
    case "Juni":
      return 6;
    case "Juli":
      return 7;
    case "Agustus":
      return 8;
    case "September":
      return 9;
    case "Oktober":
      return 10;
    case "November":
      return 11;
    case "Desember":
      return 12;
    default:
      return 0;
  }
};

export const toNamaBulan = (bulan) => {
  switch (bulan) {
    case 1:
      return "Januari";
    case 2:
      return "Februari";
    case 3:
      return "Maret";
    case 4:
      return "April";
    case 5:
      return "Mei";
    case 6:
      return "Juni";
    case 7:
      return "Juli";
    case 8:
      return "Agustus";
    case 9:
      return "September";
    case 10:
      return "Oktober";
    case 11:
      return "November";
    case 12:
      return "Desember";
    default:
      return "";
  }
};

export const findObjectSelected = (opts, selected) => {
  const filter = opts?.find((obj) => obj?.value === selected);
  if (filter) {
    return { value: filter.value, label: filter.label };
  }
  return null;
};

export const formatPersentase = (persentase) => {
  if (persentase === 0 || persentase === undefined) {
    return 0;
    // } else if (Number.isInteger(persentase)) {
    //   // Jika angka bulat, kembalikan tanpa desimal
    //   return persentase?.toLocaleString("id-ID");
  } else {
    // Jika bukan angka bulat, format dengan desimal
    return persentase?.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

export const formatGraph = (number) => {
  if (typeof number !== "number") {
    return number;
  }

  const formatNumber = (num, divisor, suffix) => {
    let formattedNum = (num / divisor).toFixed(2).replace(".", ",");
    if (formattedNum.endsWith(",00")) {
      formattedNum = formattedNum.slice(0, -3); // Remove the ",00"
    } else if (formattedNum.endsWith(",0")) {
      formattedNum = formattedNum.slice(0, -2); // Remove the ",0"
    }
    return `${formattedNum} ${suffix}`;
  };

  if (Math.abs(number) >= 1_000_000_000_000) {
    return formatNumber(number, 1_000_000_000_000, "T");
  } else if (Math.abs(number) >= 1_000_000_000) {
    return formatNumber(number, 1_000_000_000, "M");
  } else {
    return number.toLocaleString().replace(/,/g, ".");
  }
};

export const formatGraphRibu = (number) => {
  if (typeof number !== "number") {
    return number;
  }

  const formatNumber = (num, divisor, suffix) => {
    let formattedNum = (num / divisor).toFixed(2).replace(".", ",");
    if (formattedNum.endsWith(",00")) {
      formattedNum = formattedNum.slice(0, -3); // Remove the ",00"
    } else if (formattedNum.endsWith(",0")) {
      formattedNum = formattedNum.slice(0, -2); // Remove the ",0"
    }
    return `${formattedNum} ${suffix}`;
  };

  if (Math.abs(number) >= 1_000_000_000_000) {
    return formatNumber(number, 1_000_000_000_000, "T");
  } else if (Math.abs(number) >= 1_000_000_000) {
    return formatNumber(number, 1_000_000_000, "M");
  } else if (Math.abs(number) >= 1_000_000) {
    return formatNumber(number, 1_000_000, "Jt");
  } else if (Math.abs(number) >= 1_000) {
    return formatNumber(number, 1_000, "Rb");
  } else {
    return number.toLocaleString("id-ID").replace(/,/g, ".");
  }
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function formatDateDay(dateString) {
  if (dateString === "Hari Ini") return dateString;

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${day} ${month}`;
}

export const formatDateTitle = (dateString) => {
  if (!dateString) {
    return ""; // If dateString is null or undefined, return an empty string
  }
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Parse the input date string as local time
  const dateParts = dateString.split(" ");
  const localDate = new Date(`${dateParts[0]}T${dateParts[1]}`); // Parse without timezone adjustment

  const day = days[localDate.getDay()];
  const dateNumber = localDate.getDate();
  const month = months[localDate.getMonth()];
  const year = localDate.getFullYear();

  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");

  return `${day}, ${dateNumber} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
};

export const formatMonth = (month) => {
  return months[month - 1];
};

const options: any = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export const getUpdatedAtNow = () => {
  const date = new Date();

  return (
    "Hari Ini, " + date.toLocaleDateString("id-ID", options).replace(/\./g, ":")
  );
};

export const getYearNow = () => {
  const date = new Date();
  return date.getFullYear();
};

export const getLastYear = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.getFullYear();
};

export const getYesterdaysDate = () => {
  const optionsDateLocal: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return (
    "Kemarin, " +
    date.toLocaleDateString("id-ID", optionsDateLocal) +
    " - 23:59:59"
  );
};

export const getTodayDate = () => {
  const optionsDateLocal: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
  };
  const date = new Date();
  date.setDate(date.getDate());
  return (
    "Hari ini, " + date.toLocaleDateString("id-ID", optionsDateLocal) + ":00"
  );
};

export const formatDateLocalWithoutTime = (dateString: string) => {
  if (!dateString) {
    return ""; // If dateString is null or undefined, return an empty string
  }

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateLocalWithTime = (dateString: string) => {
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };
  if (dateString) {
    return new Date(dateString)
      .toLocaleDateString("id-ID", options)
      .replace(/\./g, ":");
  } else {
    return null;
  }
};

export const formatCategoryHariIni = (data) => {
  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date();
  const todayString = formatDatetoString(today);

  // Map data untuk memeriksa dan mengubah tanggal sesuai kebutuhan
  return data?.map((item) => {
    if (item === todayString) {
      return item.replace(todayString, "Hari Ini");
    }
    return item;
  });
};

const now = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 9);

export const fillMissingDates = (data) => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7); // Include today in the 7-day range

  const dateMap = new Map();

  // Populate the map with the existing data
  data?.forEach((item) => {
    if (item.tg_pros_bayar) {
      const itemDate = new Date(item.tg_pros_bayar);
      const monthDay = `${itemDate.getMonth() + 1}-${itemDate.getDate()}`;
      dateMap.set(monthDay, item);
    }
  });

  // Get the last cumulative values to start with
  let lastCumulativeTotalPkb = "0";
  let lastCumulativeTotalKbm = "0";

  const sortedDates = [...dateMap.keys()].sort((a, b) => {
    const [aMonth, aDay] = a.split("-").map(Number);
    const [bMonth, bDay] = b.split("-").map(Number);
    return (
      new Date(now.getFullYear(), aMonth - 1, aDay) -
      new Date(now.getFullYear(), bMonth - 1, bDay)
    );
  });

  if (sortedDates.length > 0) {
    const lastDate = sortedDates[sortedDates.length - 1];
    lastCumulativeTotalPkb = dateMap.get(lastDate).cumulative_total_pkb;
    lastCumulativeTotalKbm = dateMap.get(lastDate).cumulative_total_kbm;
  }

  // Create the complete data array including missing dates
  const completeData = [];
  for (let d = new Date(sevenDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const monthDay = `${d.getMonth() + 1}-${d.getDate()}`;
    if (dateMap.has(monthDay)) {
      completeData.push(dateMap.get(monthDay));
    } else {
      completeData.push({
        tg_pros_bayar: d.toISOString().split("T")[0],
        total_pkb: "0",
        total_kbm: 0,
        cumulative_total_pkb: lastCumulativeTotalPkb,
        cumulative_total_kbm: lastCumulativeTotalKbm,
      });
    }
  }

  return completeData;
};

export const filterLast7Days = (data) => {
  return data?.filter((item) => {
    if (item.tg_pros_bayar) {
      const itemDate = new Date(item.tg_pros_bayar);
      if (now.getFullYear() !== itemDate.getFullYear()) {
        itemDate.setFullYear(now.getFullYear());
      }
      const itemDateComparable = new Date(
        now.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate(),
      );
      return itemDateComparable >= sevenDaysAgo && itemDateComparable <= now;
    }
    return false;
  });
};


// Fungsi untuk mendapatkan nomor minggu dalam bulan
export const getWeekNumber = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const pastDaysOfMonth = (date.getTime() - firstDayOfMonth.getTime()) / 86400000;
  return Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay()) / 7);
};

// Fungsi untuk mendapatkan range tanggal dalam seminggu
export const getWeekRange = (date: Date): { start: string; end: string } => {
  const start = new Date(date);
  const end = new Date(date);
  
  // Cari hari Senin (start of week)
  const day = date.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const diffToMonday = day === 0 ? 6 : day - 1; // Jika Minggu, mundur 6 hari ke Senin
  
  start.setDate(date.getDate() - diffToMonday);
  end.setDate(start.getDate() + 6);
  
  return {
    start: start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    end: end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  };
};

// Helper untuk mencocokkan Nama P3D / Wilayah dengan Korwil sesuai daftar 34 P3D Bapenda Jabar
export const getKorwilByWilayahName = (namaWilayah: string): string => {
  if (!namaWilayah) return "";
  const raw = String(namaWilayah).toUpperCase().trim();
  const name = raw.replace(/[.\-_,]/g, " ");

  // 1. Purwakarta (BEKASI, CIKARANG, KARAWANG, PURWAKARTA, SUBANG)
  if (
    name.includes("PURWAKARTA") ||
    name.includes("KARAWANG") ||
    name.includes("SUBANG") ||
    name.includes("BEKASI") ||
    name.includes("CIKARANG")
  ) {
    return "Purwakarta";
  }

  // 2. Ciayumajakuning (CILEDUG, CIREBON, HAURGEULIS, INDRAMAYU, KUNINGAN, MAJALENGKA, SUMBER)
  if (
    name.includes("CILEDUG") ||
    name.includes("CIREBON") ||
    name.includes("HAURGEULIS") ||
    name.includes("INDRAMAYU") ||
    name.includes("KUNINGAN") ||
    name.includes("MAJALENGKA") ||
    name.includes("SUMBER")
  ) {
    return "Ciayumajakuning";
  }

  // 3. Bogor (BOGOR, CIANJUR, CIBADAK, CIBINONG, CINERE, DEPOK, PEL.RATU, SUKABUMI)
  if (
    name.includes("BOGOR") ||
    name.includes("CIANJUR") ||
    name.includes("CIBADAK") ||
    name.includes("CIBINONG") ||
    name.includes("CINERE") ||
    name.includes("DEPOK") ||
    name.includes("PEL RATU") ||
    name.includes("PELABUHAN") ||
    name.includes("PALABUHAN") ||
    name.includes("SUKABUMI")
  ) {
    return "Bogor";
  }

  // 4. Priangan Timur (BANJAR, CIAMIS, GARUT, TASIKMALAYA, PANGANDARAN, SUKARAJA, SUMEDANG)
  if (
    name.includes("BANJAR") ||
    name.includes("CIAMIS") ||
    name.includes("GARUT") ||
    name.includes("TASIK") ||
    name.includes("PANGANDARAN") ||
    name.includes("SUKARAJA") ||
    name.includes("SUMEDANG")
  ) {
    return "Priangan Timur";
  }

  // 5. Bandung Raya (BANDUNG I PDJDJRAN, BANDUNG II KWLYN, BANDUNG III SOETTA, CIMAHI, KAB.BANDUNG BARAT, KAB.BANDUNG I RCK, KAB.BANDUNG II SRG)
  if (
    name.includes("BANDUNG") ||
    name.includes("CIMAHI") ||
    name.includes("PDJDJRAN") ||
    name.includes("PAJAJARAN") ||
    name.includes("KWLYN") ||
    name.includes("KAWALUYAAN") ||
    name.includes("SOETTA") ||
    name.includes("SOEKARNO") ||
    name.includes("RCK") ||
    name.includes("RANCAEKEK") ||
    name.includes("SRG") ||
    name.includes("SOREANG") ||
    name.includes("NGAMPRAH")
  ) {
    return "Bandung Raya";
  }

  return "";
};
import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  useContext,
} from "react";
import accountReducer, { AccountState, User } from "../store/accountReducer";
import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from "../store/actions";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/services/localStorageService";
import { useTheme } from "@/components/theme-provider";
import { ConfigContext } from "./configContext";
import { userService } from "@/services/userService";

type TData = User;

type TAuthContext = {
  isLoggedIn: boolean;
  isLoading?: boolean;
  isInitialised: boolean;
  user: TData | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
};

const savedLocalUser = getLocalStorage("userData");
const savedLocalToken = getLocalStorage("token");
const isHasSession = Boolean(savedLocalUser && savedLocalToken);

const initialState: AccountState = {
  isLoggedIn: isHasSession,
  isLoading: false,
  isInitialised: false,
  user: isHasSession ? savedLocalUser : null,
};

const AuthContext = createContext<TAuthContext>({
  ...initialState,
  login: async () => ({} as User),
  logout: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const { dispatch: dispatchConfig } = useContext(ConfigContext);
  const { setTheme } = useTheme();

  const login = async (username: string, password: string): Promise<User> => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();

    // Dapatkan data user terbaru dari userService (termasuk yang ditambahkan di Manajemen User)
    const users = userService.getAllUsers();

    const matched = users.find((u) => {
      const uUsername = u.username?.toLowerCase() || "";
      const uEmail = u.email?.toLowerCase() || "";
      return uUsername === cleanUser || uEmail === cleanUser;
    });

    if (!matched) {
      throw new Error("Username atau email tidak terdaftar di sistem.");
    }

    if (matched.password !== cleanPass) {
      throw new Error("Kata sandi yang Anda masukkan salah.");
    }

    if (matched.status === "NONAKTIF") {
      throw new Error(
        "Akun Anda sedang dinonaktifkan oleh Administrator. Hubungi pihak Bapenda."
      );
    }

    // Perbarui waktu terakhir login
    const now = new Date();
    const timeStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;
    try {
      userService.updateUser(matched.id, { terakhirLogin: timeStr });
    } catch {
      // ignore
    }

    const sessionUser: User = {
      userID: matched.id,
      username: matched.username || matched.nama,
      nama: matched.nama,
      surname: matched.surname || matched.nama,
      email: matched.email,
      role: matched.role.toLowerCase(),
      bidang: matched.role.toLowerCase(),
      kode_wilayah: matched.kodeWilayah || "all",
      nama_wilayah: matched.namaWilayah || "SEMUA WILAYAH",
      kodeWilayahKerja: matched.kodeWilayahKerja,
    };

    setLocalStorage("userData", sessionUser);
    setLocalStorage("token", `bapenda-auth-${matched.id}-${Date.now()}`);

    dispatch({
      type: LOGIN,
      payload: {
        user: sessionUser,
        isLoggedIn: true,
      },
    });

    dispatchConfig({
      type: "SET_KODE_WILAYAH",
      payload: sessionUser.kode_wilayah || "all",
    });

    dispatchConfig({
      type: "SET_NAMA_WILAYAH",
      payload: sessionUser.nama_wilayah || "SEMUA WILAYAH",
    });

    return sessionUser;
  };

  const logout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setTheme("light");
    dispatch({
      type: LOGOUT,
      payload: {
        isLoggedIn: false,
        user: null,
      },
    });
  };

  useEffect(() => {
    const savedUser = getLocalStorage("userData");
    const savedToken = getLocalStorage("token");

    if (savedUser && savedToken) {
      dispatch({
        type: ACCOUNT_INITIALISE,
        payload: {
          isLoggedIn: true,
          user: savedUser,
        },
      });

      dispatchConfig({
        type: "SET_KODE_WILAYAH",
        payload: savedUser.kode_wilayah || "all",
      });

      dispatchConfig({
        type: "SET_NAMA_WILAYAH",
        payload: savedUser.nama_wilayah || "SEMUA WILAYAH",
      });
    } else {
      dispatch({
        type: ACCOUNT_INITIALISE,
        payload: {
          isLoggedIn: false,
          user: null,
        },
      });
    }

    const defaultWilayahOptions = [
      { value: "all", label: "SEMUA P3D / WILAYAH" },
      { value: "10200", label: "P3D Wilayah Kota Bandung I Pajajaran" },
      { value: "10500", label: "P3D Wilayah Kota Bandung II Kawaluyaan" },
      { value: "10700", label: "P3D Wilayah Kota Bandung III Soekarno Hatta" },
      { value: "11000", label: "P3D Wilayah Kabupaten Bandung Barat" },
      { value: "11200", label: "P3D Wilayah Kota Bogor" },
      { value: "11400", label: "P3D Wilayah Kota Bekasi" },
      { value: "11600", label: "P3D Wilayah Kota Cirebon" },
    ];

    dispatchConfig({
      type: "SET_KODE_WILAYAH_OPTIONS",
      payload: defaultWilayahOptions,
    });
  }, [dispatchConfig]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

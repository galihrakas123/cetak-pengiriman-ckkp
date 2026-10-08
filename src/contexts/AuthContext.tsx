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

type TData = User;

type TAuthContext = {
  isLoggedIn: boolean;
  isLoading?: boolean;
  isInitialised: boolean;
  user: TData | null;
  login: (username: any, password: any) => void;
  logout: () => void;
};

const mockDevUser: TData = {
  username: "Administrator",
  role: "admin",
  bidang: "admin",
  kode_wilayah: "all",
  nama_wilayah: "SEMUA WILAYAH",
  userID: "admin-dev",
};

const initialState: AccountState = {
  isLoggedIn: true,
  isLoading: false,
  isInitialised: true,
  user: mockDevUser,
};

const AuthContext = createContext<TAuthContext>({
  ...initialState,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const { dispatch: dispatchConfig } = useContext(ConfigContext);
  const { setTheme } = useTheme();

  const login = async (username: any, _password: any) => {
    const user = { ...mockDevUser, username: username || "Administrator" };
    setLocalStorage("userData", user);
    setLocalStorage("token", "mock-dev-token");
    dispatch({
      type: LOGIN,
      payload: {
        user,
        isLoggedIn: true,
      },
    });
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
    // Inisialisasi local mock session jika belum ada di localStorage
    const savedUser = getLocalStorage("userData") || mockDevUser;
    setLocalStorage("userData", savedUser);
    setLocalStorage("token", "mock-dev-token");

    dispatch({
      type: ACCOUNT_INITIALISE,
      payload: {
        isLoggedIn: true,
        user: savedUser,
      },
    });

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

    dispatchConfig({
      type: "SET_KODE_WILAYAH",
      payload: savedUser.kode_wilayah || "all",
    });

    dispatchConfig({
      type: "SET_NAMA_WILAYAH",
      payload: savedUser.nama_wilayah || "SEMUA WILAYAH",
    });
  }, [dispatchConfig]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

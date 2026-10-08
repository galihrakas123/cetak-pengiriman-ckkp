import { getLocalStorage } from "@/services/localStorageService";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Pastikan untuk menginstal react-router-dom

const useUrlState = (state, dispatch) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = getLocalStorage("userData");

  const isAdmin = userData?.kd_wil === "all";

  useEffect(() => {
    if (isAdmin && state.kodeWilayah) {
      const newUrl = `?wilayah=${state.kodeWilayah}`;
      navigate(newUrl, { replace: true });
    }
  }, [state.kodeWilayah, navigate]);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(location.search);
  //   const kodeWilayah = urlParams.get("wilayah");

  //   if (kodeWilayah) {
  //     dispatch({
  //       type: "SET_KODE_WILAYAH",
  //       payload: kodeWilayah,
  //     });
  //   }
  // }, []);
};

export default useUrlState;

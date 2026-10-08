import axios from "axios";
import { getLocalStorage, removeLocalStorage } from "./localStorageService";

// const baseURL = import.meta.env.VITE_PUBLIC_REACT_APP_BASE_URL_API;
// const baseURL = "http://172.27.77.128:8000";
// const baseURL = "https://bestrong.bapenda.jabarprov.go.id/api-esamsat";
// const baseURL = "http://172.27.77.128:8081/api";
const baseUrl = "https://bestrong.bapenda.jabarprov.go.id/bestrong-api";

export const baseName = "/dl";

export const axiosServices = (url = "") => {
  const Axios = axios.create({
    baseURL: url != "" ? url : baseUrl,
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      // token: userToken,
    },
    timeout: 1000 * 60,
    // withCredentials: true,
  });

  // Set the AUTH token for any request
  Axios.interceptors.request.use(function (config) {
    const userToken = getLocalStorage("token");
    config.headers.Authorization = userToken ? `Bearer ${userToken}` : "";
    return config;
  });

  // logout if res status is 401
  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const url = error?.config?.url || "";
      if (
        error.response &&
        error.response.status === 401 &&
        !url.includes("/v2/login")
      ) {
        // Handle unauthorized access, e.g., redirect to login
        console.error("Unauthorized access - redirecting to login");
        removeLocalStorage("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return Axios;
};

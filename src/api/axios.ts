import axios from "axios";
import { CONFIG } from "../config/config";


const axiosInstance = axios.create({
  baseURL: `${CONFIG.BACKEND_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // your Laravel API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token to headers if available
instance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

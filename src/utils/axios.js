// utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // your Laravel API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Track active requests for loading state
let activeRequests = 0;
let loadingController = null;

// Set loading controller from React context
export const setLoadingController = (controller) => {
  loadingController = controller;
};

// Request interceptor
instance.interceptors.request.use((config) => {
  // Attach token to headers if available
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Show loading if this is the first active request
  activeRequests++;
  if (activeRequests === 1 && loadingController && !config.hideLoading) {
    const message = config.loadingMessage || "Loading...";
    loadingController.showLoading(message);
  }

  return config;
}, (error) => {
  // Handle request error
  activeRequests--;
  if (activeRequests === 0 && loadingController) {
    loadingController.hideLoading();
  }
  return Promise.reject(error);
});

// Response interceptor
instance.interceptors.response.use((response) => {
  // Hide loading when all requests are complete
  activeRequests--;
  if (activeRequests === 0 && loadingController) {
    loadingController.hideLoading();
  }
  return response;
}, (error) => {
  // Hide loading on error
  activeRequests--;
  if (activeRequests === 0 && loadingController) {
    loadingController.hideLoading();
  }
  return Promise.reject(error);
});

export default instance;

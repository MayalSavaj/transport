import axios from './axios';

// Helper functions for common API patterns with loading messages

export const apiGet = (url, options = {}) => {
  const { loadingMessage = "Loading...", ...axiosOptions } = options;
  return axios.get(url, { loadingMessage, ...axiosOptions });
};

export const apiPost = (url, data, options = {}) => {
  const { loadingMessage = "Saving...", ...axiosOptions } = options;
  return axios.post(url, data, { loadingMessage, ...axiosOptions });
};

export const apiPut = (url, data, options = {}) => {
  const { loadingMessage = "Updating...", ...axiosOptions } = options;
  return axios.put(url, data, { loadingMessage, ...axiosOptions });
};

export const apiDelete = (url, options = {}) => {
  const { loadingMessage = "Deleting...", ...axiosOptions } = options;
  return axios.delete(url, { loadingMessage, ...axiosOptions });
};

export const apiUpload = (url, formData, options = {}) => {
  const { loadingMessage = "Uploading...", ...axiosOptions } = options;
  return axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    loadingMessage,
    ...axiosOptions
  });
};

// For requests that shouldn't show loading (e.g., polling, background tasks)
export const silentApiGet = (url, options = {}) => {
  return axios.get(url, { hideLoading: true, ...options });
};

export const silentApiPost = (url, data, options = {}) => {
  return axios.post(url, data, { hideLoading: true, ...options });
};
import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingOverlay from "components/LoadingOverlay";
import { setLoadingController } from "utils/axios";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoading = (loadingMessage = "Loading...") => {
    setMessage(loadingMessage);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const value = {
    loading,
    showLoading,
    hideLoading,
    setMessage,
  };

  // Initialize axios loading controller
  useEffect(() => {
    setLoadingController({
      showLoading,
      hideLoading,
    });
  }, []);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay open={loading} message={message} />
    </LoadingContext.Provider>
  );
};
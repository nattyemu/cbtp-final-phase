// ToastProvider.jsx

import React, { useState, useContext } from "react";

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toastData, setToastData] = useState({
    message: null,
    success: null,
  });

  const showToast = (message, success) => {
    setToastData({ message, success });
  };

  const hideToast = () => {
    setToastData({ message: null, success: null });
  };

  const value = {
    toastData,
    setToastData,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

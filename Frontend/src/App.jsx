import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ToastNotification from "./Markups/Components/Common/Toast";

function App() {
  const navigate = useNavigate();
  const { setIsLogged, isLogged, fetchData } = useContext("userContext");

  useEffect(() => {
    fetchData();
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  return (
    <>
      <ToastNotification />
      {/* Other components like headers or footers can go here */}
    </>
  );
}

export default App;

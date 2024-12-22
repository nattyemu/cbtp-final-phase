import React, { useEffect } from "react";
import LoginForm from "../../../Components/Custom/Form/LoginForm";
import { userContext } from "../../../../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
function Login() {
  const navigator = useNavigate();
  const {
    setIsLogged,
    isLogged,
    isAdmin,
    setIsAdmin,
    isDepartment,
    setIsDepartment,
    isCafe,
    setIsCafe,
    isPolice,
    setIsPolice,
    isLibrary,
    setIsLibrary,
    isGard,
    setIsGard,
    isProctor,
    setIsProctor,
    isSuperProctor,
    setIsSuperProctor,
    isRegistrar,
    setIsRegistrar,
    isStudent,
    setIsStudent,
    userData,
    fetchData,
    setUserData,
  } = useContext(userContext);
  useEffect(() => {
    // fetchData().then((res) => checkIfLogin());
  }, [isLogged]);

  const checkIfLogin = () => {
    // console.log(userData);
    // console.log(isLogged);
    if (!isLogged) {
      navigator("/login");
    }
    // navigate acocording to user role

    if (isAdmin) {
      navigator("/admin");
    }
    if (isDepartment) {
      navigator("/department");
    }
    if (isCafe) {
      navigator("/cafeHead");
    }
    if (isPolice) {
      navigator("/police");
    }
    if (isGard) {
      navigator("/gards");
    }
    if (isProctor) {
      navigator("/proctor_GB");
    }
    if (isSuperProctor) {
      navigator("/proctorHead");
    }
    if (isRegistrar) {
      navigator("/registral");
    }
    if (isStudent) {
      navigator("/student");
    }
  };
  return (
    <>
      <LoginForm />
    </>
  );
}

export default Login;

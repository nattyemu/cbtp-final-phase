import { createContext, useEffect, useState } from "react";
import getAuth from "../Utilities/AuthHeader";
import AuthService from "../Service/AuthService";

export const userContext = createContext();

export const UseProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDepartment, setIsDepartment] = useState(false);
  const [isCafe, setIsCafe] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isLibrary, setIsLibrary] = useState(false);
  const [isGard, setIsGard] = useState(false);
  const [isProctor, setIsProctor] = useState(false);
  const [isSuperProctor, setIsSuperProctor] = useState(false);
  const [isRegistrar, setIsRegistrar] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [myInfo, setMyIno] = useState({});

  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchData();
    // fetchMyData();
  }, []);

  const fetchData = async () => {
    const loggedInUser = await getAuth();
    if (loggedInUser) {
      if (loggedInUser.userToken) {
        setIsLogged(true);
      }
      if (loggedInUser.role === "ADMIN") {
        setIsAdmin(true);
      } else if (loggedInUser.role === "DEPARTMENT") {
        setIsDepartment(true);
      } else if (loggedInUser.role === "CAFE") {
        setIsCafe(true);
      } else if (loggedInUser.role === "POLICE") {
        setIsPolice(true);
      } else if (loggedInUser.role === "LIBRARY") {
        setIsLibrary(true);
      } else if (loggedInUser.role === "GARD") {
        setIsGard(true);
      } else if (loggedInUser.role === "PROCTOR") {
        setIsProctor(true);
      } else if (loggedInUser.role === "SUPERPROCTOR") {
        setIsSuperProctor(true);
      } else if (loggedInUser.role === "REGISTRAR") {
        setIsRegistrar(true);
      } else if (loggedInUser.role === "STUDENT") {
        setIsStudent(true);
      }
      // console.log(loggedInUser);
      setUserData(loggedInUser);
    }
  };
  // const fetchMyData = async () => {
  //   // have to be pass the id as body
  //   const res = await AuthService.getMy();
  //   // console.log(res);
  // };

  const values = {
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
    myInfo,
  };

  return <userContext.Provider value={values}>{children}</userContext.Provider>;
};

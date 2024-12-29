import React, { useContext, useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import img from "../../../assets/images/Appicon.jpeg";
import Dashbord from "./Dashbord";
import AdminUser from "./AdminUser";
import "../../../assets/css/style.css";
import { Link, useNavigate } from "react-router-dom";
import AddStudents from "./AddStudents";
import { userContext } from "../../../Context/Authcontext";
import For4 from "../Root/Fo4/For4";
import getAuth from "../../../Utilities/AuthHeader";
import AdminAddStudents from "./AdminAddStudents";
function AdminHome() {
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [displayStudent, setDisplayStudent] = useState(false);
  const navigator = useNavigate();
  const [data, setData] = useState();
  const { setIsLogged, isLogged, setUserData } = useContext(userContext);
  const fetchData = async () => {
    try {
      const response = await getAuth();
      // console.log("Fetched user data:", response);
      setData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // console.log(data);
  }, []);

  const handleDashboard = () => {
    setShow(true);
    setDisplay(false);
    // setDisplayProfile(false);
  };

  const handleUser = () => {
    setDisplay(true);
    setShow(false);
    setDisplayStudent(false);
  };

  const handleStudent = () => {
    setDisplay(false);
    setShow(false);
    setDisplayStudent(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    navigator("/");
  };
  return (
    <>
      {data && data.role === "ADMIN" ? (
        <div className="admin flex h-full">
          <div className="adminLeft col-3 ">
            <div className="profile pt-5">
              <img src={img} alt="" />
              <p>{data?.role}</p>
              <p>{data?.firstname}</p>
            </div>
            <hr />
            <div className="ms-3">
              <div className="adminMenu cursor-pointer">
                <p onClick={handleDashboard}>
                  <DashboardIcon className="icon" />
                  Dashboard
                </p>
              </div>
              <div className="adminMenu cursor-pointer">
                <p onClick={handleUser}>
                  <AccountBoxOutlinedIcon className="icon" />
                  User
                </p>
              </div>
              <div className="adminMenu cursor-pointer">
                <p onClick={handleStudent}>
                  <AccountBoxOutlinedIcon className="icon" />
                  Student
                </p>
              </div>
              <div className="adminMenu cursor-pointer" onClick={handleLogout}>
                <LogoutIcon className="icon" />
                Logout
              </div>
            </div>
          </div>
          <div className="adminRight col-9 flex-1 m-0">
            {/* {show ? <Dashbord />: " "} */}
            {display ? (
              <AdminUser />
            ) : displayStudent ? (
              <AdminAddStudents />
            ) : (
              <Dashbord />
            )}
          </div>
        </div>
      ) : (
        <For4 />
      )}
    </>
  );
}

export default AdminHome;

import React, { useContext, useEffect, useState } from "react";
import img from "../../../../assets/images/Appicon.jpeg";
import "./students.css";
import Request from "../../../Components/Root/student/request/Request";
import Clerance from "../../../Components/Root/student/clerance/Clerance";
import ViewProgress from "../../../Components/Root/student/progress/VeiwProgress";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../../../Context/Authcontext";
import getAuth from "../../../../Utilities/AuthHeader";
// import StudentPage from './StudentPage';
const data = await getAuth();
function Student() {
  const [showRequest, setRequest] = useState(false);
  const [showProgress, setProgress] = useState(false);
  const [showClerance, setClerance] = useState(false);
  const { setIsLogged, isLogged, setUserData } = useContext(userContext);
  const navigate = useNavigate();
  // const [showProfile, setProfile] = useState(false);

  const handleRequest = () => {
    setRequest(true);
    setProgress(false);
    setClerance(false);
  };

  const handleProgress = () => {
    setProgress(true);
    setRequest(false);
    setClerance(false);
  };

  const handleClerance = () => {
    setClerance(true);
    setRequest(false);
    setProgress(false);
  };
  const handleLogout = () => {
    setUserData(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="m-3">
      <div className="">
        <div className="flex ">
          <div className="flex bg-black  h-[100vh]">
            <div className="flex flex-col">
              <div className="flex flex-col sm:gap-1 md:gap-3 lg:gap-5 ">
                <img
                  src={img}
                  alt=""
                  className="w-[50px] sm:w-[103px] md:w-[153px] lg:w-[203px] rounded-xl h-auto"
                />
                <p className="font-medium flex mt-[-13px] justify-center sm:text-[19px] md:text-[20px] lg:text-[23px]   ">
                  {data.firstname}
                </p>
                <p className="font-medium flex justify-center sm:text-[20px] md:text-[22px] lg:text-[25px]  ">
                  {data.role}
                </p>
                <hr />
              </div>
              <div className="flex flex-col  text-gray-700">
                <div className="flex my-2 ml-2 sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium text-lg hover:text-black hover:scale-105 cursor-pointer">
                  <p onClick={handleRequest}>Request</p>
                </div>
                <div className="flex my-2 ml-2 sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium text-lg hover:text-black hover:scale-105 cursor-pointer">
                  <p onClick={handleProgress}>View Progress</p>
                </div>
                <div className="flex my-2 ml-2 sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium text-lg hover:text-black hover:scale-105 cursor-pointer">
                  <p onClick={handleClerance}>Clearance</p>
                </div>
                <div className="flex my-2 ml-2 sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium text-lg hover:text-black hover:scale-105 cursor-pointer">
                  <p onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-center m-4">
            {showRequest && <Request />}
            {showProgress && <ViewProgress />}
            {showClerance && <Clerance />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;

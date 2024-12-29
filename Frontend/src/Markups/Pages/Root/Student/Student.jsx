import React, { useContext, useState } from "react";
import img from "../../../../assets/images/Appicon.jpeg";
import "./students.css";
import Request from "../../../Components/Root/student/request/Request";
import Clerance from "../../../Components/Root/student/clerance/Clerance";
import ViewProgress from "../../../Components/Root/student/progress/VeiwProgress";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../../Context/Authcontext";
import getAuth from "../../../../Utilities/AuthHeader";

// Simulating the auth data fetch
const data = await getAuth();

function Student() {
  const [activeTab, setActiveTab] = useState("request");
  const { setIsLogged, setUserData } = useContext(userContext);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row ">
        {/* Sidebar */}
        <div className="bg-[#141430] p-2 shadow-md w-[300px] h-auto lg:h-screen">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <img
              src={img}
              alt="User"
              className="rounded-full w-24 h-24 mb-4 border"
            />
            <p className="text-xl text-white font-semibold">{data.firstname}</p>
            <p className="text-white">{data.role}</p>
            <hr className="my-4 border-gray-300 w-full" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => handleTabChange("request")}
              className="text-white font-bold"
            >
              Request
            </button>
            <button
              onClick={() => handleTabChange("progress")}
              className="text-white font-bold"
            >
              View Progress
            </button>
            <button
              onClick={() => handleTabChange("clearance")}
              className="text-white font-bold"
            >
              Clearance
            </button>
            <button
              onClick={handleLogout}
              className="rounded-md text-white font-bold "
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 flex justify-center items-center ">
          {activeTab === "request" && <Request />}
          {activeTab === "progress" && <ViewProgress />}
          {activeTab === "clearance" && <Clerance />}
        </div>
      </div>
    </div>
  );
}

export default Student;

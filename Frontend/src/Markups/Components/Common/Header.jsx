import React, { useContext, useEffect, useState } from "react";
import img from ".././../../assets/images/Appicon.jpeg";
import "../../../assets/css/header.css";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../../Context/Authcontext";
import getAuth from "../../../Utilities/AuthHeader";
function Header() {
  const navigate = useNavigate();
  const { setIsLogged, isLogged, setUserData } = useContext(userContext);
  const [data, setData] = useState();

  // Fetch data asynchronously
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
  const handleLogout = () => {
    setUserData(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="bg-slate-950 h-auto w-full">
        <div className="flex justify-between items-center p-2 rounded-sm shadow-sm text-white w-full">
          <div className="">
            <h2 className="sm:text-[25px] md:text-[30px] lg:text-[35px] ml-4">
              J<span>U</span>
            </h2>
          </div>
          <div className="flex justify-center flex-col">
            <p className="p-3 mb-[-15px] items-center flex justify-center ">
              <img src={img} alt="" className="w-[30px] rounded-full mr-2" />{" "}
              {data && data.firstname}
            </p>
            <Link to="/">
              <button
                className="logout p-3 m-2 items-center"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

import { useEffect, useState } from "react";
import StatusBar from "./StatusBar"; // Import the StatusBar component
import "./progress.css";
import { Link } from "react-router-dom";
import UserService from "../../../../../Service/UserService";
import getAuth from "../../../../../Utilities/AuthHeader";
import AuthService from "../../../../../Service/AuthService";

function ViewProgress() {
  const [countTrue, setCountTrue] = useState(0);
  const [userDataInContext, setUserDataInContext] = useState({});

  const getUserData = async () => {
    try {
      const findIdFromStorage = await getAuth();
      const response = await UserService.count({ id: findIdFromStorage?.id });

      setCountTrue(response);
      const info = await AuthService.getMy({ id: findIdFromStorage?.id });
      // console.log(info?.data);
      setUserDataInContext(info?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  if (!userDataInContext?.request?.length) {
    return (
      <div className="text-center w-full h-full flex justify-center items-center font-bold text-2xl">
        You don't have any clearance request
      </div>
    );
  }
  return (
    <div className=" flex flex-col shadow-md md:w-full lg:w-[80%] justify-center ali border-[#141430]">
      <div className=" flex flex-col gap-2 p-5 mx-3 sm:text-[17px] md:text-[19px] lg:text-[23px]">
        <div className=" grid grid-cols-3 font-medium text-gray-950 gap-0 ">
          <div>Student Id</div>
          <div>Semester</div>
          <div>status</div>
        </div>
        <hr />
        <div className=" grid grid-cols-3 text-gray-700 sm:text-[17px] md:text-[19px] lg:text-[22px]">
          <div id="date">{userDataInContext?.studentProfile?.studentId}</div>

          <div>
            {userDataInContext?.request?.length > 0
              ? userDataInContext?.request[0]?.semester
              : "No Semester Info"}
          </div>

          <div>
            <Link to="">
              <StatusBar
                progress={parseFloat(((countTrue / 7) * 100).toFixed(2))}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProgress;

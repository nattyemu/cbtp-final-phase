import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";

function Dashboard() {
  const [noStudent, setNoStudent] = useState(0);
  const [noAll, setNoAll] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data for both students and users
  const fetchData = async () => {
    try {
      await Promise.all([numberOfStudent(), numberOfAllUsers()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch the number of students
  const numberOfStudent = async () => {
    try {
      const response = await AuthService.getStudentCount();
      if (response?.success) {
        setNoStudent(response?.data);
      } else {
        console.error("Failed to fetch student count:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching student count:", error);
    }
  };

  // Fetch the number of all users
  const numberOfAllUsers = async () => {
    try {
      const response = await AuthService.getAllUsersCount();
      if (response?.success) {
        setNoAll(response?.data);
      } else {
        console.error("Failed to fetch user count:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  return (
    <>
    <div className="h-[100px]">
  {/* Dashboard Header */}
  <div className=" p-4 bg-gradient-to-r  rounded-b-lg shadow-lg w-full ">
    <h2 className="text-3xl font-bold ml-4 text-[#141430]">Dashboard</h2>
  </div>

  {/* Dashboard Content */}
  <div className="container flex-grow  mr-80">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card 1: Number of Students */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#141430]">
        <div className="p-6">
          <h5 className="text-lg font-semibold text-gray-600">Number of Students</h5>
          <h2 className="text-4xl font-extrabold text-[#141430]">{noStudent}</h2>
          <div className="mt-4 flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#141430]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10 3a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10z"
                />
                <path d="M9 9a1 1 0 102 0V7a1 1 0 10-2 0v2zm1 4a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <p className="ml-4 text-gray-500">Track student statistics efficiently.</p>
          </div>
        </div>
      </div>

      {/* Card 2: Number of Users */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#141430]">
        <div className="p-6">
          <h5 className="text-lg font-semibold text-gray-600">Number of Users</h5>
          <h2 className="text-4xl font-extrabold text-[#141430]">{noAll}</h2>
          <div className="mt-4 flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#141430]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 8a5 5 0 1110 0v2a5 5 0 01-4 4.9V17a1 1 0 01-2 0v-2.1a5.002 5.002 0 01-4-4.9V8zm5-3a3 3 0 00-3 3v2a3 3 0 006 0V8a3 3 0 00-3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="ml-4 text-gray-500">Monitor overall user engagement.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    
    </>
    
    
  );
}

export default Dashboard;

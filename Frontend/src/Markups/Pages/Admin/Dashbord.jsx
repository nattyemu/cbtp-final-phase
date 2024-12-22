import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";

function Dashboard() {
  const [noStudent, setNoStudent] = useState(0);
  const [noAll, setNoAll] = useState(0);
  useEffect(() => {
    numberOfStudent();
    numberOfAllUsers();
  }, []);
  const numberOfStudent = async () => {
    try {
      const response = await AuthService.getStudentCount();
      if (response?.success) {
        // console.log(response?.data);
        setNoStudent(response?.data);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
    // console.log("losers", users);
  };
  const numberOfAllUsers = async () => {
    try {
      const response = await AuthService.getAllUsersCount();
      if (response?.success) {
        // console.log(response?.data);
        setNoAll(response?.data);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
    // console.log("losers", users);
  };
  return (
    <div className="container">
      <div className="dashbord p-2">
        <h2>Dashbord</h2>
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Number of students</h5>
              <h2 className="card-text">{noStudent}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Number of users</h5>
              <h2 className="card-text">{noAll}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

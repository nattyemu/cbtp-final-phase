import React, { useContext, useEffect, useState } from "react";
import img from "../../../../assets/images/Appicon.jpeg";
import "../../../Pages/Root/Student/students.css";
import ApprovalList from "./ApprovalList";
import ListOfRequest from "./ListOfRequest";
import DebtInfo from "./Debt/DebtInfo";
import { userContext } from "../../../../Context/Authcontext";
import getAuth from "../../../../Utilities/AuthHeader";
import { useNavigate } from "react-router-dom";

function UserPage({ loinData }) {
  const { setIsLogged, isLogged, setUserData } = useContext(userContext);
  const [showLrequest, setLrequest] = useState(false);
  const [showApproval, setApproval] = useState(false);
  const [showDept, setDept] = useState(false);
  const [data, setData] = useState(loinData);
  const navigate = useNavigate();

  useEffect(() => {
    setData(loinData);
    console.log(loinData);
  }, [loinData]);

  const handleLRequest = () => {
    setLrequest(true);
    setApproval(false);
    setDept(false);
  };

  const handleApproval = () => {
    setApproval(true);
    setLrequest(false);
    setDept(false);
  };

  const handleDept = () => {
    setDept(true);
    setLrequest(false);
    setApproval(false);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLogged(false);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div className="flex flex-cols-2 ">
        <div className="Left-part col-3">
          <div className="profile pt-5">
            <img src={img} alt="" />
            <p>{data?.role}</p>
            <p>{data?.firstname}</p>
            <hr />
          </div>
          <div className="fw-bold">
            <div className="user-menu">
              <p onClick={handleLRequest}>List of Request</p>
            </div>
            <div className="user-menu">
              <p onClick={handleApproval}>Approval List</p>
            </div>
            <div className="user-menu">
              <p onClick={handleDept}>Debt</p>
            </div>
            <div className="user-menu">
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="Right-part mx-auto ">
          {showLrequest && <ListOfRequest />}
          {showApproval && <ApprovalList />}
          {showDept && <DebtInfo />}
        </div>
      </div>
    </div>
  );
}

export default UserPage;

import React, { useEffect, useState } from "react";
import StudentTable from "../../Custom/Table/StudentTable";
import "../../../Pages/Root/Student/students.css";
import AuthService from "../../../../Service/AuthService";
import getAuth from "../../../../Utilities/AuthHeader";
import { toast } from "react-toastify";
import SearchInput from "../../Common/SearchInput";

function ListOfRequest() {
  const [users, setUsers] = useState([]);
  const [sendSearch, setSendSearch] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAuth();
      const response = await AuthService.getTheRequest({ role: data?.role });
      if (response?.success) {
        // console.log(response?.data);
        setUsers(response?.data);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
  };

  return (
    <>
    <div className="">
      <div className="text-center list my-6">
        <h1>List of Request</h1>
        {/* <hr className="" /> */}
      </div>
      <SearchInput 
        className=""
        setSendSearch={setSendSearch} // Pass setSearch to update the parent state
        placeholder="Search by first name or student ID from list of request"
      />

      <StudentTable userProp={users} search={sendSearch} />
    </div>
      
    </>
  );
}

export default ListOfRequest;

import React, { useEffect, useState } from "react";
import ApproveTable from "../../Custom/Table/ApproveTable";
import getAuth from "../../../../Utilities/AuthHeader";
import AuthService from "../../../../Service/AuthService";
import { toast } from "react-toastify";
import SearchInput from "../../Common/SearchInput";

function ApprovalList() {
  const [users, setUsers] = useState([]);
  const [sendSearch, setSendSearch] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log(sendSearch); // Log the search term to see changes
  // }, [sendSearch]);

  const fetchData = async () => {
    try {
      const data = await getAuth();
      const response = await AuthService.getTheRequestApproved({
        role: data?.role,
      });
      console.log(response?.data);
      setUsers(response?.data);
    } catch (error) {
      // console.log(error);
      // toast.error(error.message);
    }
  };

  return (
    <>
      <div className="text-center list mt-3  my-10">
        <h1>Approval List</h1>
      </div>
      <SearchInput
        setSendSearch={setSendSearch} // Pass setSearch to update the parent state
        placeholder="Search by first name or student ID from approval list"
      />

      <ApproveTable userProp={users} search={sendSearch} />
    </>
  );
}

export default ApprovalList;

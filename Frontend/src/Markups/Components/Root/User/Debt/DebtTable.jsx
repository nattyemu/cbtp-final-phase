import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./debtTable.css";
import AuthService from "../../../../../Service/AuthService";
import { toast } from "react-toastify";
import getAuth from "../../../../../Utilities/AuthHeader";
import DebtUpdateTable from "../../../Custom/Table/DebtUpdateTable";

function DebtTable() {
  const [users, setUsers] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAuth();
      const response = await AuthService.getReportAll({ role: data?.role });
      // console.log(response);
      setUsers(response?.data);
      if (!response?.success) {
        toast.error(response.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.message);
    }
  };
  const handleUpdate = (user) => {
    setSelectedUser(user);
    // console.log(selectedUser);
    setShowUpdate(true);
  };
  return (
    <div className="student-table-container">
      {showUpdate ? (
        <DebtUpdateTable user={selectedUser} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Debt Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((item, index) => (
                <tr key={index}>
                  <td>{item?.studentId}</td>
                  <td>{item?.firstName}</td>
                  <td>{item?.lastName}</td>
                  <td>{item?.department}</td>
                  <td>{item?.reason}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(item)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DebtTable;

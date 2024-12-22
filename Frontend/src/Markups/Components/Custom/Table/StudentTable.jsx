import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function StudentTable({ userProp, search }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(userProp); // Set the initial data passed from parent
  }, [userProp]);

  useEffect(() => {
    if (Object.keys(search).length === 0) {
      setUsers(userProp); // If search is empty, display all users
      return;
    }

    const [key, value] = Object.entries(search)[0];
    const filteredUsers = userProp.filter((user) => {
      if (key === "studentId") {
        if (value === "") {
          setUsers(userProp);
        } else {
          return user?.user?.studentProfile?.studentId
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      } else if (key === "firstName") {
        if (value === "") {
          setUsers(userProp);
        } else {
          return user?.user?.profile?.firstName
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      }
      return false;
    });

    setUsers(filteredUsers); // Update users based on search term
  }, [search, userProp]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>StudentId</th>
          <th>Faculity</th>
          <th>Department</th>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <td>Reason</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {!users.length ? (
          <tr>
            <td colSpan="9" className="text-center text-gray-800">
              No results found.
            </td>
          </tr>
        ) : (
          users.map((item, index) => (
            <tr key={index}>
              <td>{item?.user?.studentProfile?.studentId}</td>
              <td>{item?.user?.studentProfile?.faculty}</td>
              <td>{item?.user?.studentProfile?.department}</td>
              <td>{item?.user?.profile?.firstName}</td>
              <td>{item?.user?.profile?.middleName}</td>
              <td>{item?.user?.profile?.lastName}</td>
              <td>{item?.user?.profile?.sex}</td>
              <td>{item?.reason}</td>
              <td>
                <Link to={`/requestDetail/${item?.userId}`}>
                  <button className="px-3 py-2 border-none studentTableBtn">
                    View
                  </button>
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default StudentTable;

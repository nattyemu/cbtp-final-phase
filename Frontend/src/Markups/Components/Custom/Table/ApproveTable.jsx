import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";

function ApproveTable({ userProp, search }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(userProp); // Set the initial data passed from parent
  }, [userProp]);

  useEffect(() => {
    if (Object.keys(search).length === 0) {
      setUsers(userProp);
      return;
    }

    const [key, value] = Object.entries(search)[0];
    const filteredUsers = userProp.filter((user) => {
      if (key === "studentId") {
        if (value === "") {
          setUsers(userProp);
        } else {
          return user.user?.studentProfile?.studentId
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      } else if (key === "firstName") {
        if (value === "") {
          setUsers(userProp);
        } else {
          return user.user?.profile?.firstName
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
          <th>Student ID</th>
          <th>Faculity</th>
          <th>Department</th>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Academic Year</th>
        </tr>
      </thead>
      <tbody>
        {!users.length ? (
          <tr>
            <td colSpan="8" className="text-center text-gray-800">
              No results found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td className="font-medium text-center">
                {user.user?.studentProfile?.studentId}
              </td>
              <td className="font-medium text-center">
                {user.user?.studentProfile?.faculty}
              </td>
              <td className="font-medium text-center">
                {user.user?.studentProfile?.department}
              </td>
              <td className="font-medium text-center">
                {user.user?.profile?.firstName}
              </td>
              <td className="font-medium text-center">
                {user.user?.profile?.middleName}
              </td>
              <td className="font-medium text-center">
                {user.user?.profile?.lastName}
              </td>
              <td className="font-medium text-center">
                {user.user?.profile?.sex}
              </td>
              <td className="font-medium text-center">{user.academicYear}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ApproveTable;

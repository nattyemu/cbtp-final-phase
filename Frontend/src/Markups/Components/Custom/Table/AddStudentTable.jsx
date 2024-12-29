import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import UpdateStudent from "../../Admin/UpdateStudent";
import AuthService from "../../../../Service/AuthService";
import { formatDateTime } from "../../../../Utilities/timeFormatter";
import { toast } from "react-toastify";
import SearchInput from "../../Common/SearchInput";

function AddStudentTable() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendSearch, setSendSearch] = useState({});
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await AuthService.getStudent();
      setUsers(response);
      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.message);
    }
  };

  useEffect(() => {
    if (Object.keys(sendSearch).length === 0) {
      setFilteredUsers(users); // Reset to original data if search is empty
      return;
    }

    const [key, value] = Object.entries(sendSearch)[0];
    const filtered = users.filter((user) => {
      if (key === "studentId") {
        return user.studentProfile.studentId
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      if (key === "firstName") {
        return user.profile.firstName
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return false;
    });

    setFilteredUsers(filtered); // Update filtered data
  }, [sendSearch, users]);

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowUpdate(true);
    setShowTable(false);
  };
  const popDown = () => {
    // popup();
    setShowUpdate(false);
    setShowTable(true);
  };

  return (
    <>
      {showUpdate && <UpdateStudent user={selectedUser} popDown={popDown} />}

      {showTable && (
        <div>
          <SearchInput
            setSendSearch={setSendSearch} // Pass setSendSearch to update the search query
            placeholder="Search by first name or student ID"
          />
          <TableContainer component={Paper} className="">
            <Table sx={{ minWidth: 650 }} aria-label="student table">
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan="6"
                      className="text-center text-gray-800"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((singleUser) => (
                    <TableRow key={singleUser.id}>
                      <TableCell>{singleUser.email}</TableCell>
                      <TableCell>
                        {singleUser.profile.firstName +
                          " " +
                          singleUser.profile.lastName}
                      </TableCell>
                      <TableCell>
                        {singleUser.studentProfile.studentId}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(singleUser.createdAt)}
                      </TableCell>
                      <TableCell>{singleUser.role}</TableCell>
                      <TableCell
                        onClick={() => handleUpdate(singleUser)}
                        className="cursor-pointer"
                      >
                        <EditIcon />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}

export default AddStudentTable;

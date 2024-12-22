import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import AdminUpdateAdmin from "../../Admin/AdminUpdateAdmin";
import AuthService from "../../../../Service/AuthService";
import SearchInput from "../../Common/SearchInput";

function AddAdminTable() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendSearch, setSendSearch] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch admin data
  const fetchData = async () => {
    try {
      const response = await AuthService.getAdmins();
      if (response?.success) {
        setUsers(response.data);
      } else {
        // toast.error(response.message); // Show error message
      }
    } catch (error) {
      console.log(error);
      // toast.error(error?.response?.message); // Show error if request fails
    }
  };
  useEffect(() => {
    if (Object.keys(sendSearch).length === 0) {
      setFilteredUsers(users);
      return;
    }

    const [key, value] = Object.entries(sendSearch)[0];
    const filtered = users.filter((user) => {
      if (key === "studentId") {
        return;
      }
      if (key === "firstName") {
        return user.profile.firstName
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return false;
    });

    setFilteredUsers(filtered);
  }, [sendSearch, users]);

  const handleUpdate = (user) => {
    setSelectedUser(user);
    console.log("Selected User:", user);
    setShowUpdate(true);
  };

  return (
    <>
      {showUpdate && <AdminUpdateAdmin user={selectedUser} />}
      <SearchInput
        setSendSearch={setSendSearch}
        placeholder="Search by first name or student ID"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Roll no</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers &&
              filteredUsers.map((singleUser) => (
                <TableRow key={singleUser.id}>
                  <TableCell>{singleUser.id}</TableCell>
                  <TableCell>{singleUser.email}</TableCell>
                  <TableCell>
                    {singleUser.profile.firstName +
                      " " +
                      singleUser.profile.lastName}
                  </TableCell>
                  <TableCell>{singleUser.role}</TableCell>
                  <TableCell>{singleUser.profile.sex}</TableCell>
                  <TableCell
                    onClick={() => handleUpdate(singleUser)}
                    className="cursor-pointer"
                  >
                    <EditIcon />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AddAdminTable;

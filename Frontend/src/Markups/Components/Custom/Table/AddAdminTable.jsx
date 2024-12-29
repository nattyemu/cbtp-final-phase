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
import ClearIcon from "@mui/icons-material/Clear";
function AddAdminTable() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendSearch, setSendSearch] = useState({});
  const [showTable, setShowTable] = useState(true);
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
    setShowTable(false);
  };

  const click = () => {
    setShowUpdate(false);
    setShowTable(true);
  };
  const removeUpdate = (bool) => {
    setShowUpdate(bool);
    setShowTable(!bool);
  };
  return (
    <>
      {showUpdate && (
        <div className="w-full  relative">
          <AdminUpdateAdmin user={selectedUser} removeUpdate={removeUpdate} />
          <ClearIcon
            onClick={click}
            className="absolute top-0 right-[25%] ml-[-22px] hover:text-red-400 text-[#141430]"
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {showTable && (
        <>
          <SearchInput
            setSendSearch={setSendSearch}
            placeholder="Search by first name or student ID"
          />
          <h2 className="text-center text-2xl text-black mt-[-12px] mb-4">
            Users Table
          </h2>
          <TableContainer component={Paper} className="m-2">
            <Table>
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
      )}
    </>
  );
}

export default AddAdminTable;

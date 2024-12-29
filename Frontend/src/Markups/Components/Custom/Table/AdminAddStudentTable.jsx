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
import AdminUpdateStudent from "../../Admin/AdminUpdateStudent";
import SearchInput from "../../Common/SearchInput";
import ClearIcon from "@mui/icons-material/Clear";

function AdminAddStudentTable() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendSearch, setSendSearch] = useState({});
  const [showTable, setShowTable] = useState(true);
  // const [selectedOption, setSelectedOption] = useState("");
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
      setFilteredUsers(users);
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

    setFilteredUsers(filtered);
  }, [sendSearch, users]);

  const handleUpdate = (user) => {
    setSelectedUser(user);
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
          <AdminUpdateStudent user={selectedUser} removeUpdate={removeUpdate} />
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
            Student Table
          </h2>
          <TableContainer component={Paper} className="m-3">
            <Table sx={{ minWidth: 650 }} aria-label="student table">
              <TableHead>
                <TableRow>
                  <TableCell>Roll no</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Sex</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((singleUser) => (
                    <TableRow key={singleUser.id}>
                      <TableCell>{singleUser.id}</TableCell>
                      <TableCell>{singleUser.email}</TableCell>
                      <TableCell>
                        {singleUser.profile.firstName +
                          " " +
                          singleUser.profile.lastName}
                      </TableCell>
                      <TableCell>
                        {singleUser?.studentProfile?.studentId}
                      </TableCell>
                      <TableCell>{singleUser.profile.sex}</TableCell>
                      <TableCell>
                        {formatDateTime(singleUser.createdAt)}
                      </TableCell>
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
        </>
      )}
    </>
  );
}

export default AdminAddStudentTable;

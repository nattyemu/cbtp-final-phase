import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Backdrop, Fade } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import UpdateUser from '../../Admin/UpdateUser'; 
import AuthService from '../../../../Service/AuthService';
import {formatDateTime} from '../../../../Utilities/timeFormatter'

function AddUserTable() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await AuthService.getUsers();
    setUser(response);
  };

  const handleUpdate = (row) => {
    setSelectedUser(row);
    setShowUpdate(true);
  };

  const handleUpdateCallback = () => {
    setShowUpdate(false); // Hide the update form
    fetchData(); // Fetch updated data after submitting update
  };

  return (
    <>
     <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user && user.map((singleUser) => (
              <TableRow key={singleUser.id}>
                <TableCell>{singleUser.id}</TableCell>
                <TableCell>{singleUser.email}</TableCell>
                <TableCell>{formatDateTime(singleUser.createdAt)}</TableCell>
                <TableCell>{singleUser.role}</TableCell>
                <TableCell><EditIcon onClick={() => handleUpdate(singleUser)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* UpdateUser Modal */}
      <Modal
        open={showUpdate}
      >
        <Fade in={showUpdate}>
          <div>
            <UpdateUser data={selectedUser} onUpdate={handleUpdateCallback}  />
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default AddUserTable;

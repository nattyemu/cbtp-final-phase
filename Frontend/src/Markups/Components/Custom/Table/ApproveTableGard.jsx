import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import AuthService from "../../../../Service/AuthService";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ApproveTableGard({ searchTerm }) {
  const [users, setUsers] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      fetchData(true);
    } else {
      setNoResults(false);
      fetchData(false);
    }
  }, [searchTerm]);

  const fetchData = async (isSearch) => {
    try {
      const response = isSearch
        ? await AuthService.searchCleared(searchTerm)
        : await AuthService.getUsersClearedOrNot();

      if (response?.success) {
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setUsers(data);
        console.log(response.data);
        setNoResults(data.length === 0);
      } else {
        setUsers([]);
        setNoResults(true);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      toast.error(error.message);
      setUsers([]);
      setNoResults(true);
    }
  };

  const handleCheckOutClick = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleConfirmCheckOut = async () => {
    if (selectedRequestId) {
      try {
        const response = await AuthService.addToClearance({
          requestId: selectedRequestId,
        });
        console.log(response.data);
        if (response.success) {
          toast.success(response?.message);
          fetchData(false);
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        console.error("Check out error:", error);
        toast.error("An error occurred during checkout");
      }
    }
    setSelectedRequestId(null);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Faculty</th>
          <th>Department</th>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Academic Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {noResults ? (
          <tr>
            <td colSpan="9" className="text-center text-gray-800">
              No results found for your search.
              <br /> No clearance requests found with all offices cleared
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td className="font-medium text-center">{user.studentId}</td>
              <td className="font-medium text-center">{user.faculty}</td>
              <td className="font-medium text-center">{user.department}</td>
              <td className="font-medium text-center">{user.firstName}</td>
              <td className="font-medium text-center">{user.middleName}</td>
              <td className="font-medium text-center">{user.lastName}</td>
              <td className="font-medium text-center">{user.sex}</td>
              <td className="font-medium text-center">{user.academicYear}</td>
              <td className="font-medium text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="border rounded-lg text-white cursor-pointer p-1 bg-blue-700 hover:bg-blue-600"
                      onClick={() => handleCheckOutClick(user.id)}
                    >
                      Check Out
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Confirm Check Out</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-gray-900 text-lg">
                      Are you sure you want to check out this user from the
                      university?
                    </AlertDialogDescription>
                    <div className="dialog-footer ">
                      <AlertDialogCancel className="text-red-600 bg-red-200 hover:bg-red-300">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmCheckOut}
                        className="bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-md p-2 m-3"
                      >
                        Confirm Check Out
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ApproveTableGard;

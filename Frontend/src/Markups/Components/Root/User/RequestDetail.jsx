import React, { useEffect, useState } from "react";
import "./user.css";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../../Service/AuthService";
import { toast } from "react-toastify";
import getAuth from "../../../../Utilities/AuthHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const data = await getAuth();
function RequestDetail() {
  const role = data?.role;
  const [open, setOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false); // State to control reject dialog
  const [rejectReason, setRejectReason] = useState(""); // State to store reject reason
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
    console.log(data);
  }, [id]);
  const navigateToRolePage = (userData) => {
    if (userData) {
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "STUDENT") {
        navigate("/student");
      } else if (userData.role === "DEPARTMENT") {
        navigate("/department");
      } else if (userData.role === "CAFE") {
        navigate("/cafeHead");
      } else if (userData.role === "POLICE") {
        navigate("/police");
      } else if (userData.role === "GARD") {
        navigate("/gards");
      } else if (userData.role === "PROCTOR") {
        navigate("/proctor_GB");
      } else if (userData.role === "SUPERPROCTOR") {
        navigate("/proctorHead");
      } else if (userData.role === "LIBRARY") {
        navigate("/librirary");
      } else if (userData.role === "REGISTRAR") {
        navigate("/registral");
      } else {
        toast.error("No role found, please contact support.");
      }
    } else {
      toast.error("User data is not available.");
    }
  };

  const approvalRequest = async () => {
    let response;
    try {
      const form = {
        role: role,
        studentId: studentId,
      };

      response = await AuthService.apporve(form, id);
      if (response?.success) {
        toast.success(response?.message);
        if (data?.id) {
          navigateToRolePage(data);
          console.log(response);
        }
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message || "Error during approval");
    } finally {
      setOpen(false);
    }
  };

  const rejectionRequest = async () => {
    let response;
    try {
      const data = await getAuth();
      const form = {
        role: data?.role,
        studentId: studentId,
        reason: rejectReason.trim(),
      };

      response = await AuthService.reject(form, id);
      if (response?.success) {
        toast.success(response?.message);
        // console.log(response);
        setRejectReason("");
        if (data?.id) {
          navigateToRolePage(data);
        }
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message || "Error during rejection", error);
    } finally {
      setRejectOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await AuthService.getMy({ id: id });
      setUser(response?.data);
    } catch (error) {
      toast.error("Error during fetching request details");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const {
    profile: { firstName, middleName, lastName, sex } = {},
    studentProfile: { studentId, faculty, department, academicYear } = {},
    request = [],
    createdAt,
  } = user;

  return (
    <div className="request-detail">
      <div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <h2 className="text-2xl p-2 font-medium">Request Detail</h2>
          <table className="detail-table">
            <thead>
              <tr>
                <th className="label text-lg p-1 font-semibold">Field</th>
                <th className="label text-lg p-1 font-bold">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>{`${firstName} ${middleName} ${lastName}`}</td>
              </tr>
              <tr>
                <td>Sex</td>
                <td>{sex}</td>
              </tr>
              <tr>
                <td>Student ID</td>
                <td>{studentId}</td>
              </tr>
              <tr>
                <td>Academic Year</td>
                <td>{academicYear}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{department}</td>
              </tr>
              <tr>
                <td>Faculty</td>
                <td>{faculty}</td>
              </tr>
              <tr>
                <td>Created At</td>
                <td>{new Date(createdAt).toLocaleString()}</td>
              </tr>

              {request[0] && (
                <>
                  <tr>
                    <td>Request Status</td>
                    <td>{request[0].status}</td>
                  </tr>
                  <tr>
                    <td>Request Reason</td>
                    <td>{request[0].reason}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Approve Button */}
          <AlertDialogTrigger asChild>
            <button
              className="approve-button"
              onClick={() => {
                setOpen(true);
              }}
            >
              Approve
            </button>
          </AlertDialogTrigger>

          {/* Reject Button */}
          <button className="reject-button" onClick={() => setRejectOpen(true)}>
            Reject
          </button>

          {/* Approve Dialog */}
          <AlertDialogContent>
            <AlertDialogTitle>
              Are you sure you want to approve this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex justify-end mt-4">
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="ml-2 bg-green-200 hover:bg-green-300 text-black"
                onClick={approvalRequest}
              >
                Confirm
              </AlertDialogAction>
            </div>
          </AlertDialogContent>

          {/* Reject Dialog */}
          <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <AlertDialogContent>
              <AlertDialogTitle>Reject Request</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Please provide a reason for rejecting this request:
              </AlertDialogDescription>
              <input
                type="text"
                className="form-input"
                value={rejectReason}
                maxLength={125}
                minLength={6}
                onChange={(e) => {
                  const value = e.target.value;
                  const trimmedValue = value.trim();
                  setRejectReason(value);
                  setIsValid(
                    trimmedValue.length >= 6 && trimmedValue.length <= 225
                  );
                }}
                placeholder="Enter rejection reason"
              />
              <div className="flex justify-end mt-4">
                <AlertDialogCancel
                  onClick={() => {
                    setRejectOpen(false);
                    setRejectReason("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="ml-2 bg-red-200 hover:bg-red-300 text-black"
                  onClick={rejectionRequest}
                  disabled={!isValid}
                >
                  Confirm Rejection
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </AlertDialog>
      </div>
    </div>
  );
}

export default RequestDetail;

import React, { useEffect, useState } from "react";
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
function DebtUpdateTable({ user }) {
  const [reason, setReason] = useState(user?.reason || ""); // Set default to user.reason if available
  const [clearAllDebts, setClearAllDebts] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (user && user.reason) {
      setReason(user.reason);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getAuth();
    const form = {
      newReason: reason,
      role: data?.role,
      studentId: user?.studentId,
      clearAllDebts: clearAllDebts.toString(),
    };
    try {
      const response = await AuthService.updateDebt(form);
      // console.log(form);
      if (response?.success) {
        toast.success(response?.message);
        setReason("");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message);
      // console.error("Error updating student:", error);
    } finally {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setReason("");
  };

  return (
    <div className="update-student p-5">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <div className="update-student-container shadow">
          <h2 className="text-center fs-2 fw-bold">Update Reason</h2>
          <form>
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="form-group flex w-full">
              <label htmlFor="clearAllDebts">
                Clear All Debts
                <input
                  type="checkbox"
                  id="clearAllDebts"
                  checked={clearAllDebts}
                  onChange={(e) => setClearAllDebts(e.target.checked)}
                />
              </label>
            </div>
            <div className="form-group mt-3">
              <AlertDialogTrigger asChild>
                <button onClick={() => setOpen(false)} className="p-2">
                  Update
                </button>
              </AlertDialogTrigger>
              <button
                type="button"
                onClick={handleCancel}
                className="m-2 p-2 px-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure to update the debt?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone .
          </AlertDialogDescription>
          <div className="flex justify-end mt-4">
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="ml-2 bg-green-200 hover:bg-green-300 text-black"
              onClick={handleSubmit}
            >
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DebtUpdateTable;

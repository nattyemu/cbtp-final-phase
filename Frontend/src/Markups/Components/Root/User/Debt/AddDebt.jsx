// AddDebt.jsx
import { useState } from "react";
import "./addDebt.css";
import AuthService from "../../../../../Service/AuthService";
import getAuth from "../../../../../Utilities/AuthHeader";
import { toast } from "react-toastify";

function AddDebt() {
  const [form, setForm] = useState({
    studentId: "",
    reason: "",
  });

  const handleSumbit = async (e) => {
    const data = await getAuth();
    e.preventDefault();
    // console.log(form);
    try {
      const response = await AuthService.addNew({ ...form, role: data?.role });
      // console.log({ ...form, role: data?.role });
      // console.log(response);
      if (response?.success) {
        toast.success(response.message);
        // console.log(response);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.message);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  return (
    <div className="add-userDebt">
      <div className="shadow">
        <h2 className="text-center fs-2 p-3 fw-bold">Add Debt</h2>
        <form>
          <div className="d-flex">
            <div className="form-groupDebt">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                // value={form.studentId}
                onChange={handleChange}
              />
            </div>
            <div className="form-groupDebt">
              <label htmlFor="reason">Reason</label>
              <input
                className="debtInput"
                type="text"
                id="reason"
                // value={form.reason}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSumbit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDebt;

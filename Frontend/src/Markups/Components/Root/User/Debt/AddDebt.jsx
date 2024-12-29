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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nameRegex = /^[\p{L}\s'-]+$/u; // Allows appropriate characters for names
    const studentIdRegex = /^[A-Za-z]{2}\d{4}\/\d{2}$/; // Allows alphanumeric and slash for student ID
    const newErrors = {};

    // Validate Student ID
    if (!form.studentId || !studentIdRegex.test(form.studentId)) {
      newErrors.studentId =
        "Student ID is required and must contain only letters, numbers, and slashes.";
    }

    // Validate Reason
    if (
      !form.reason ||
      form.reason.length < 5 ||
      !nameRegex.test(form.reason)
    ) {
      newErrors.reason =
        "Reason is required, must be at least 5 characters long, and contain only letters, spaces, hyphens, or apostrophes.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const data = await getAuth();
    try {
      const response = await AuthService.addNew({ ...form, role: data?.role });

      if (response?.success) {
        toast.success(response.message);
        setForm({ studentId: "", reason: "" }); // Clear the form on success
      } else {
        toast.error(response.message);
      }
    } catch (error) {
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
    <div className="m-0 w-[180%]">
      <div className="shadow">
        <h2 className="text-center fs-2 p-3 fw-bold">Add Debt</h2>
        <form>
          <div className="d-flex">
            <div className="form-groupDebt">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                value={form.studentId}
                onChange={handleChange}
              />
              {errors.studentId && (
                <p className="text-red-600">{errors.studentId}</p>
              )}
            </div>
            <div className="form-groupDebt">
              <label htmlFor="reason">Reason</label>
              <input
                className="debtInput"
                type="text"
                id="reason"
                value={form.reason}
                onChange={handleChange}
              />
              {errors.reason && <p className="text-red-600">{errors.reason}</p>}
            </div>
            <div className="form-group mt-3">
              <button type="submit" variant="contained" onClick={handleSumbit}>
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

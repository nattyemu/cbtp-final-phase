import React, { useState } from "react";
import AuthService from "../../../Service/AuthService";
import "./AddUse.css";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ClearIcon from "@mui/icons-material/Clear";
function AddStudent({ popup }) {
  const initialFormState = {
    email: "",
    password: "",
    role: "STUDENT",
    department: "",
    faculty: "",
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    academicYear: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));

    // Clear error for the current field
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (form.email.length < 8) {
      newErrors.email = "Email must be at least 8 characters.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Email must be a valid format.";
    } else if (form.email.length > 42) {
      newErrors.email = "Email must be less than 42 characters.";
    }

    // Password validation (8-32 characters)
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/(?=.*[A-Z])/.test(form.password) || // At least one uppercase letter
      !/(?=.*[a-z])/.test(form.password) || // At least one lowercase letter
      !/(?=.*[0-9])/.test(form.password) || // At least one number
      !/(?=.*[@#:$%^&*!])/.test(form.password) // At least one special character
    ) {
      newErrors.password =
        "Password  must contain an uppercase letter, a lowercase letter, a number, and a special character.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (form.password.length > 42) {
      newErrors.password = "Password must be at most 42 characters.";
    }

    // Student ID validation (exactly 9 characters)
    if (!form.studentId) {
      newErrors.studentId = "Student ID is required.";
    } else if (form.studentId.length !== 9) {
      newErrors.studentId = "Student ID must be exactly 9 characters.";
    }

    // Faculty validation (3-32 characters)
    if (!form.faculty) {
      newErrors.faculty = "Faculty is required.";
    } else if (form.faculty.length < 3 || form.faculty.length > 32) {
      newErrors.faculty = "Faculty must be between 3 and 32 characters.";
    }

    // Department validation (3-32 characters)
    if (!form.department) {
      newErrors.department = "Department is required.";
    } else if (form.department.length < 3 || form.department.length > 32) {
      newErrors.department = "Department must be between 3 and 32 characters.";
    }

    // First Name validation (3-34 characters)
    if (!form.firstName) {
      newErrors.firstName = "First Name is required.";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.firstName)) {
      newErrors.firstName = "First Name must not contain symbols or numbers.";
    } else if (form.firstName.length > 42) {
      newErrors.firstName = "First Name must be less than 42 characters.";
    }

    // Last Name validation (3-34 characters)
    if (!form.lastName) {
      newErrors.lastName = "Last Name is required.";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Last Name must not contain symbols or numbers.";
    } else if (form.lastName.length > 42) {
      newErrors.lastName = "Last Name must be less than 42 characters.";
    }

    if (!form.middleName) {
      newErrors.middleName = "Middle Name is required.";
    } else if (form.middleName.length < 2) {
      newErrors.middleName = "Middle Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.middleName)) {
      newErrors.middleName = "Middle Name must not contain symbols or numbers.";
    } else if (form.middleName.length > 42) {
      newErrors.middleName = "Middle Name must be less than 42 characters.";
    }

    // Academic Year validation (e.g., 2023/24)
    if (!form.academicYear) {
      newErrors.academicYear = "Academic year is required.";
    } else if (!/^\d{4}\/\d{2}$/.test(form.academicYear)) {
      newErrors.academicYear =
        "Academic year must be in the format YYYY/YY (e.g., 2023/24).";
    } else if (form.academicYear.length > 12) {
      newErrors.academicYear = "Academic Year must be less than 12 characters.";
    }

    // Gender validation
    if (!form.sex) {
      newErrors.sex = "Gender is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await AuthService.register(form);

      if (response?.success) {
        toast.success(response?.message);
        setForm(initialFormState); // Reset form on success
        popDown();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Failed to add student");
    }
  };
  const popDown = () => {
    popup();
  };
  return (
    <div className="add-user p-5 w-screen items-center relative">
      <ClearIcon
        onClick={popDown}
        className="absolute top-0 right-0 hover:text-red-400 ml-[-22px] text-[#141430]"
        style={{ cursor: "pointer" }}
      />
      <div className="shadow-lg p-4 rounded bg-white ml-24">
        <h2 className="text-center text-2xl font-bold mb-6">Add Student</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Email", type: "email", id: "email" },
              { label: "Password", type: "password", id: "password" },
              { label: "Student ID", type: "text", id: "studentId" },
              { label: "Faculty", type: "text", id: "faculty" },
              { label: "Department", type: "text", id: "department" },
              { label: "First Name", type: "text", id: "firstName" },
              { label: "Middle Name", type: "text", id: "middleName" },
              { label: "Last Name", type: "text", id: "lastName" },
              {
                label: "Academic Year (e.g., 2023/24)",
                type: "text",
                id: "academicYear",
              },
            ].map(({ label, type, id }) =>
              label == "Password" ? (
                <div key={id} className="addstudent relative">
                  <label htmlFor={id}>{label}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    value={form[id]}
                    onChange={handleChange}
                    className={`${
                      errors[id] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <span
                    className="absolute right-2 top-8 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {errors[id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                  )}
                </div>
              ) : (
                <div key={id} className="addstudent">
                  <label htmlFor={id}>{label}</label>
                  <input
                    type={type}
                    id={id}
                    value={form[id]}
                    onChange={handleChange}
                    className={`${
                      errors[id] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                  )}
                </div>
              )
            )}
            <div className="addstudent ">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className={`${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="STUDENT">Student</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
            <div className="addstudent">
              <label htmlFor="sex">Sex</label>
              <select
                id="sex"
                value={form.sex}
                onChange={handleChange}
                className={`${
                  errors.sex ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.sex && (
                <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
              )}
            </div>

            <div className="addstudent mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

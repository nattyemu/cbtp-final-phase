import React, { useState } from "react";
import AuthService from "../../../Service/AuthService";
import "./AddUse.css";
import { toast } from "react-toastify";

function AddStudent() {
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));

    // Clear error for the current field
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation (8-32 characters)
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8 || form.password.length > 32) {
      newErrors.password = "Password must be between 8 and 32 characters.";
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
      newErrors.firstName = "First name is required.";
    } else if (form.firstName.length < 3 || form.firstName.length > 34) {
      newErrors.firstName = "First name must be between 3 and 34 characters.";
    } else if (!/^[a-zA-Z\s-]+$/.test(form.firstName)) {
      newErrors.firstName =
        "First name can only contain letters, spaces, and hyphens.";
    }

    // Last Name validation (3-34 characters)
    if (!form.lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (form.lastName.length < 3 || form.lastName.length > 34) {
      newErrors.lastName = "Last name must be between 3 and 34 characters.";
    } else if (!/^[a-zA-Z\s-]+$/.test(form.lastName)) {
      newErrors.lastName =
        "Last name can only contain letters, spaces, and hyphens.";
    }

    if (form.middleName && !/^[a-zA-Z\s-]+$/.test(form.middleName)) {
      newErrors.middleName =
        "Middle name can only contain letters, spaces, and hyphens.";
    }

    // Academic Year validation (e.g., 2023/24)
    if (!form.academicYear) {
      newErrors.academicYear = "Academic year is required.";
    } else if (!/^\d{4}\/\d{2}$/.test(form.academicYear)) {
      newErrors.academicYear =
        "Academic year must be in the format YYYY/YY (e.g., 2023/24).";
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
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Failed to add student");
    }
  };

  return (
    <div className="add-user p-5">
      <div className="shadow">
        <h2 className="text-center fs-2 fw-bold">Add Student</h2>

        <form onSubmit={handleSubmit}>
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
          ].map(({ label, type, id }) => (
            <div key={id} className="addstudent">
              <label htmlFor={id}>{label}</label>
              <input
                type={type}
                id={id}
                value={form[id]}
                onChange={handleChange}
                required
                className={`${
                  errors[id] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[id] && (
                <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
          <div className="addstudent">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              required
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
              required
              className={`${errors.sex ? "border-red-500" : "border-gray-300"}`}
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
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

import React, { useState } from "react";
import AuthService from "../../../Service/AuthService";
import "./AddUse.css";
import { toast } from "react-toastify";

function AddUser() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
  });
  const [loading, setLoading] = useState(false); // Loading state to disable the button
  const [errors, setErrors] = useState({}); // Error state for validation

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (form.email.length < 8) {
      newErrors.email = "Email must be at least 8 characters.";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Role validation
    if (!form.role) {
      newErrors.role = "Role is required.";
    }

    // First Name validation
    if (!form.firstName) {
      newErrors.firstName = "First Name is required.";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters.";
    }

    // Middle Name validation
    if (!form.middleName) {
      newErrors.middleName = "Middle Name is required.";
    } else if (form.middleName.length < 2) {
      newErrors.middleName = "Middle Name must be at least 2 characters.";
    }

    // Last Name validation
    if (!form.lastName) {
      newErrors.lastName = "Last Name is required.";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters.";
    }

    // Gender validation
    if (!form.sex) {
      newErrors.sex = "Gender is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const validationErrors = validateForm();
    setErrors(validationErrors); // Show validation errors
    if (Object.keys(validationErrors).length > 0) {
      return; // Stop submission if validation fails
    }
    setLoading(true); // Set loading state to true while submitting
    try {
      const response = await AuthService.register(form);
      if (response.success) {
        console.log(response.data.message);
        toast.success(response?.message);
        setForm({
          email: "",
          password: "",
          role: "",
          firstName: "",
          middleName: "",
          lastName: "",
          sex: "",
        });
        setErrors({}); // Clear errors on successful submission
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state after request is finished
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };

  return (
    <div className="add-user p-5 ">
      <div className="shadow">
        <h2 className="text-center fs-2 fw-bold">Add User</h2>
        <form>
          <div className="d-flex">
            <div className="form-group me-5">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={form.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="DEPARTMENT">Department</option>
              <option value="LIBRARY">Librarian</option>
              <option value="GARD">Gard</option>
              <option value="CAFE">CafeHead</option>
              <option value="SUPERPROCTOR">Proctor Head</option>
              <option value="PROCTOR">Proctor</option>
              <option value="POLICE">Police Officer</option>
            </select>
            {errors.role && <p className="text-red-600">{errors.role}</p>}
          </div>

          <div className="d-flex">
            <div className="form-group me-5">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="form-group me-5">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                value={form.middleName}
                onChange={handleChange}
              />
              {errors.middleName && (
                <p className="text-red-600">{errors.middleName}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sex">Gender</label>
            <select id="sex" value={form.sex} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex && <p className="text-red-600">{errors.sex}</p>}
          </div>

          <div className="form-group mt-3">
            <button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;

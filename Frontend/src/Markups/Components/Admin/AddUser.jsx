import React, { useState } from "react";
import AuthService from "../../../Service/AuthService";
import "./AddUse.css";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/; // Regular expression to allow only alphabets and spaces

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
    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/(?=.*[A-Z])/.test(form.password) || // At least one uppercase letter
      !/(?=.*[a-z])/.test(form.password) || // At least one lowercase letter
      !/(?=.*[0-9])/.test(form.password) || // At least one number
      !/(?=.*[@#:$%^&*!])/.test(form.password) // At least one special character
    ) {
      newErrors.password =
        "Password must contain an uppercase letter, a lowercase letter, a number, and a special character.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (form.password.length > 42) {
      newErrors.password = "Password must be at most 42 characters.";
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
    } else if (!nameRegex.test(form.firstName)) {
      newErrors.firstName = "First Name must not contain symbols or numbers.";
    } else if (form.firstName.length > 42) {
      newErrors.firstName = "First Name must be less than 42 characters.";
    }

    // Middle Name validation
    if (!form.middleName) {
      newErrors.middleName = "Middle Name is required.";
    } else if (form.middleName.length < 2) {
      newErrors.middleName = "Middle Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.middleName)) {
      newErrors.middleName = "Middle Name must not contain symbols or numbers.";
    } else if (form.middleName.length > 42) {
      newErrors.middleName = "Middle Name must be less than 42 characters.";
    }

    // Last Name validation
    if (!form.lastName) {
      newErrors.lastName = "Last Name is required.";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Last Name must not contain symbols or numbers.";
    } else if (form.lastName.length > 42) {
      newErrors.lastName = "Last Name must be less than 42 characters.";
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
      setLoading(false);
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
    <div className="add-user p-5  ">
      <div className="shadow-lg p-4 rounded bg-white ml-24">
        <h2 className="text-center text-2xl font-bold mb-6">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
            <div className="form-group relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />{" "}
              <span
                className="absolute right-2 top-8 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="REGISTRAR">Registrar</option>
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

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-group">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="form-group">
              <label
                htmlFor="middleName"
                className="block text-sm font-medium mb-1"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                value={form.middleName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter middle name"
              />
              {errors.middleName && (
                <p className="text-red-600">{errors.middleName}</p>
              )}
            </div>
            <div className="form-group">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="sex" className="block text-sm font-medium mb-1">
              Gender
            </label>
            <select
              id="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex && <p className="text-red-600">{errors.sex}</p>}
          </div>

          {/* Submit Button */}
          <div className="form-group text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;

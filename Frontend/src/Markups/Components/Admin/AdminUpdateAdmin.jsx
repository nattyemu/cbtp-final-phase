import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";
import { toast } from "react-toastify";

function AdminUpdateAdmin({ user }) {
  const initialFormState = {
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    email: "",
    password: "",
    role: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user?.profile?.firstName || "",
        middleName: user?.profile?.middleName || "",
        lastName: user?.profile?.lastName || "",
        sex: user.profile.sex || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    // Validate email
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (form.email.length < 8) {
      newErrors.email = "Email must be at least 8 characters.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Email must be a valid format.";
    }
    // Validate password (optional)
    if (form.password && form.password.trim().length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    // Validate role
    if (!form.role) newErrors.role = "Role is required.";

    // Validate first name
    if (!form.firstName) {
      newErrors.firstName = "First Name is required.";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.firstName)) {
      newErrors.firstName = "First Name must not contain symbols or numbers.";
    }

    // Validate middle name
    if (!form.middleName) {
      newErrors.middleName = "Middle Name is required.";
    } else if (form.middleName.length < 2) {
      newErrors.middleName = "Middle Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.middleName)) {
      newErrors.middleName = "Middle Name must not contain symbols or numbers.";
    }
    // Validate last name
    if (!form.lastName) {
      newErrors.lastName = "Last Name is required.";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters.";
    } else if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Last Name must not contain symbols or numbers.";
    }
    // Validate sex
    if (!form.sex) newErrors.sex = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await AuthService.updateAdminUser(form, user?.id);
      if (response?.success) {
        toast.success(response?.message);
        setForm(initialFormState); // Reset form on success
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Error updating user");
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-user p-5  w-screen">
      <div className="add-user-container shadow  w-screen">
        <h2 className="text-center fs-2 fw-bold">Update Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              aria-describedby="password-error"
            />
            {errors.password && (
              <p id="password-error" className="text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              aria-describedby="role-error"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="DEPARTMENT">Department</option>
              <option value="CAFE">Cafe</option>
              <option value="POLICE">Police</option>
              <option value="LIBRARY">Library</option>
              <option value="GARD">Gard</option>
              <option value="PROCTOR">Proctor</option>
              <option value="SUPERPROCTOR">Superproctor</option>
              <option value="REGISTRAR">Registrar</option>
              <option value="STUDENT">Student</option>
            </select>
            {errors.role && (
              <p id="role-error" className="text-red-600">
                {errors.role}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              aria-describedby="firstName-error"
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="middleName">Middle Name</label>
            <input
              type="text"
              id="middleName"
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              aria-describedby="middleName-error"
            />
            {errors.middleName && (
              <p id="middleName-error" className="text-red-600">
                {errors.middleName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              aria-describedby="lastName-error"
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
              aria-describedby="sex-error"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex && (
              <p id="sex-error" className="text-red-600">
                {errors.sex}
              </p>
            )}
          </div>

          <div className="form-group mt-3">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdateAdmin;

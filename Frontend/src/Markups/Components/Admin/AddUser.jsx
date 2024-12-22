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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Set loading state to true while submitting
    console.log(form);
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
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
              />
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
            </div>
            <div className="form-group me-5">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                value={form.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sex">Gender</label>
            <select id="sex" value={form.sex} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
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

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
            </div>
            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
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
              <option value="DEPARTMENT">Department</option>
              <option value="LIBRARY">Librarian</option>
              <option value="GARD">Gard</option>
              <option value="CAFE">CafeHead</option>
              <option value="SUPERPROCTOR">Proctor Head</option>
              <option value="PROCTOR">Proctor</option>
              <option value="POLICE">Police Officer</option>
            </select>
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

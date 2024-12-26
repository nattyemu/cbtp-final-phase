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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleFacultyChange = (e) => {
    const uniqueFaculties = Array.from(new Set(e.target.value.split(","))).join(
      ","
    );
    setForm((prevForm) => ({ ...prevForm, faculty: uniqueFaculties }));
  };

  return (
    <div className="w-[800px]">
      <div className="shadow-lg p-10 bg-white rounded-md  ml-48">
        <h2 className="text-center text-2xl font-bold mb-4">Add Student</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium ">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium "
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="form-group">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="middleName"
                className="block text-sm font-medium"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                value={form.middleName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
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
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              />
            </div>
          </div>

          {/* Role & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="form-group">
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              >
                <option value="STUDENT">Student</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sex" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="form-group">
              <label
                htmlFor="studentId"
                className="block text-sm font-medium "
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={form.studentId}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="academicYear"
                className="block text-sm font-medium"
              >
                Academic Year
              </label>
              <input
                type="text"
                id="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
              />
            </div>
          </div>

          {/* Faculty & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="form-group">
              <label
                htmlFor="faculty"
                className="block text-sm font-medium "
              >
                Faculty
              </label>
              <input
                type="text"
                id="faculty"
                value={form.faculty}
                onChange={handleFacultyChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="department"
                className="block text-sm font-medium"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 "
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 text-white font-semibold rounded focus:outline-none focus:ring-2 w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

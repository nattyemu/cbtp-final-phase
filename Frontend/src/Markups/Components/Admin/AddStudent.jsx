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
    <div className="add-user p-5">
      <div className="shadow">
        <h2 className="text-center fs-2 fw-bold">Add Student</h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Email", type: "email", id: "email" },
            { label: "Password", type: "password", id: "password" },
            { label: "Student ID", type: "text", id: "studentId" },
            {
              label: "Faculty",
              type: "text",
              id: "faculty",
              onChange: handleFacultyChange,
            },
            { label: "Department", type: "text", id: "department" },
            { label: "First Name", type: "text", id: "firstName" },
            { label: "Middle Name", type: "text", id: "middleName" },
            { label: "Last Name", type: "text", id: "lastName" },
            { label: "Academic Year", type: "text", id: "academicYear" },
          ].map(({ label, type, id, onChange = handleChange }) => (
            <div key={id} className="addstudent">
              <label htmlFor={id}>{label}</label>
              <input
                type={type}
                id={id}
                value={form[id]}
                onChange={onChange}
                required
              />
            </div>
          ))}

          <div className="addstudent">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              {/* Add other roles if needed */}
            </select>
          </div>

          <div className="addstudent">
            <label htmlFor="sex">Sex</label>
            <select id="sex" value={form.sex} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
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

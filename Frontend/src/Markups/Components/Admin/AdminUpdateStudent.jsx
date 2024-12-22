import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";
import { toast } from "react-toastify";

function AdminUpdateStudent({ user }) {
  const initialFormState = {
    faculty: "",
    department: "",
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    email: "",
    password: "",
    role: "",
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (user) {
      console.log("User data:", user); // Log the user object to check data
      setForm({
        faculty: user?.studentProfile?.faculty || "",
        department: user?.studentProfile?.department || "",
        studentId: user?.studentProfile?.studentId || "",
        firstName: user?.profile?.firstName || "",
        middleName: user?.profile?.middleName || "",
        lastName: user?.profile?.lastName || "",
        sex: user?.profile?.sex || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation to ensure studentId is present
    if (!form.studentId) {
      toast.error("Student ID is required");
      return;
    }

    try {
      const response = await AuthService.update(form, user?.id);
      if (response?.success) {
        toast.success(response?.message);
        setForm(initialFormState); // Reset form on success
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Error updating student:");
      console.error("Error updating student:", error);
    }
  };

  // Add a loading check or fallback rendering when user is undefined
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-user p-5">
      <div className="add-user-container shadow">
        <h2 className="text-center fs-2 fw-bold">Update Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
          </div>

          <div className="form-group">
            <label htmlFor="faculty">Faculty</label>
            <input
              type="text"
              id="faculty"
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="middleName">Middle Name</label>
            <input
              type="text"
              id="middleName"
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="form-group mt-3">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdateStudent;

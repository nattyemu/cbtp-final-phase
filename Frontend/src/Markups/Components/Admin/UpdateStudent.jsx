import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";
import { toast } from "react-toastify";

function UpdateStudent({ user }) {
  const initialFormState = {
    faculty: "",
    department: "",
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
  };
  const [form, setForm] = useState({
    faculty: user?.studentProfile?.faculty || "",
    department: user?.studentProfile?.department || "",
    firstName: user?.profile?.firstName || "",
    middleName: user?.profile?.middleName || "",
    lastName: user?.profile?.lastName || "",
    sex: user?.studentProfile?.sex || "",

    studentId: user?.studentProfile?.studentId || "",
  });

  useEffect(() => {
    if (user) {
      // console.log("User data:", user);
      setForm({
        faculty: user?.studentProfile?.faculty,
        department: user?.studentProfile?.department,
        studentId: user?.studentProfile?.studentId,
        firstName: user?.profile?.firstName,
        middleName: user?.profile?.middleName,
        lastName: user?.profile?.lastName,
        sex: user?.profile?.sex,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.update(form, user?.id);
      console.log(form);
      console.log(response);
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

  return (
    <div className="add-user p-5">
      <div className="add-user-container shadow">
        <h2 className="text-center fs-2 fw-bold">Update Student</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="studentId">Student ID</label>{" "}
            {/* Added field for studentId */}
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

export default UpdateStudent;

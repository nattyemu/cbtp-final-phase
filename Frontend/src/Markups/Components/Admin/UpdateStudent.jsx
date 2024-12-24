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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
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

  const validateForm = () => {
    const newErrors = {};

    // Validation checks for fields, including length
    if (!form.faculty.trim()) newErrors.faculty = "Faculty is required.";
    else if (form.faculty.trim().length < 6)
      newErrors.faculty = "Faculty must be at least 6 characters.";

    if (!form.department.trim())
      newErrors.department = "Department is required.";
    else if (form.department.trim().length < 2)
      newErrors.department = "Department must be at least 2 characters.";

    if (!form.studentId.trim()) newErrors.studentId = "Student ID is required.";
    else if (form.studentId.trim().length != 9)
      newErrors.studentId = "Student ID must be 9 characters.";

    if (!form.firstName.trim()) newErrors.firstName = "First Name is required.";
    else if (form.firstName.trim().length < 2)
      newErrors.firstName = "First Name must be at least 2 characters.";
    if (!form.middleName.trim())
      newErrors.middleName = "First Name is required.";
    else if (form.middleName.trim().length < 2)
      newErrors.middleName = "First Name must be at least 2 characters.";

    if (!form.lastName.trim()) newErrors.lastName = "Last Name is required.";
    else if (form.lastName.trim().length < 2)
      newErrors.lastName = "Last Name must be at least 2 characters.";

    if (!form.sex) newErrors.sex = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const response = await AuthService.update(form, user?.id);
      if (response?.success) {
        toast.success(response?.message);
        setForm(initialFormState); // Reset form to the updated state of the user
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
              aria-describedby="faculty-error"
            />
            {errors.faculty && (
              <p id="faculty-error" className="text-red-600">
                {errors.faculty}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              aria-describedby="department-error"
            />
            {errors.department && (
              <p id="department-error" className="text-red-600">
                {errors.department}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              aria-describedby="studentId-error"
            />
            {errors.studentId && (
              <p id="studentId-error" className="text-red-600">
                {errors.studentId}
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
            />{" "}
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
              <option value="">Select Sex</option>
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

export default UpdateStudent;

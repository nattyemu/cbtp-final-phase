import React, { useEffect, useState } from "react";
import AuthService from "../../../Service/AuthService";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// Updated regex to allow only alphabetic characters (including accented), spaces, apostrophes, and hyphens.
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

function AdminUpdateStudent({ user, removeUpdate }) {
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
  const [errors, setErrors] = useState({}); // State to hold error messages
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
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

    let formErrors = {}; // Temporary object to store errors

    // Validation
    if (!form.studentId || form.studentId.length !== 9) {
      formErrors.studentId = "Student ID is required and must be 9 characters.";
    }

    if (
      !form.firstName ||
      form.firstName.length < 2 ||
      form.firstName.length > 42 ||
      !nameRegex.test(form.firstName)
    ) {
      formErrors.firstName =
        "First Name is required, must be 2-42 characters, and cannot contain invalid symbols.";
    }

    if (
      !form.lastName ||
      form.lastName.length < 2 ||
      form.lastName.length > 42 ||
      !nameRegex.test(form.lastName)
    ) {
      formErrors.lastName =
        "Last Name is required, must be 2-42 characters, and cannot contain invalid symbols.";
    }

    if (
      form.middleName &&
      (form.middleName.length < 2 ||
        form.middleName.length > 42 ||
        !nameRegex.test(form.middleName))
    ) {
      formErrors.middleName =
        "Middle Name must be 2-42 characters and cannot contain invalid symbols.";
    }

    if (!form.email) {
      formErrors.email = "Email is required.";
    } else if (form.email.length < 8) {
      formErrors.email = "Email must be at least 8 characters.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      formErrors.email = "Email must be a valid format.";
    } else if (form.email.length > 42) {
      formErrors.email = "Email must be less than 42 characters.";
    }
    if (!form.role) {
      formErrors.role = "Role is required.";
    }

    if (form.password) {
      if (!form.password) {
        formErrors.password = "Password is required.";
      } else if (
        !/(?=.*[A-Z])/.test(form.password) || // At least one uppercase letter
        !/(?=.*[a-z])/.test(form.password) || // At least one lowercase letter
        !/(?=.*[0-9])/.test(form.password) || // At least one number
        !/(?=.*[@#:$%^&*!])/.test(form.password) // At least one special character
      ) {
        formErrors.password =
          "Password must contain an uppercase letter, a lowercase letter, a number, and a special character.";
      } else if (form.password.length < 8) {
        formErrors.password = "Password must be at least 8 characters.";
      } else if (form.password.length > 42) {
        formErrors.password = "Password must be at most 42 characters.";
      }
    }

    if (!form.faculty || form.faculty.length > 42) {
      formErrors.faculty =
        "Faculty is required and cannot exceed 42 characters.";
    }

    if (
      !form.department ||
      form.department.length < 2 ||
      form.department.length > 42
    ) {
      formErrors.department =
        "Department is required and must be 2-42 characters.";
    }

    if (!form.sex) {
      formErrors.sex = "Gender is required.";
    }

    // If there are errors, set the errors state and don't proceed
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await AuthService.update(form, user?.id);
      if (response?.success) {
        setForm(initialFormState); // Reset form on success
        setErrors({}); // Clear errors
        toast.success("Student updated successfully");
        popDown();
      } else {
        setErrors({ general: response?.message }); // Handle error response
      }
    } catch (error) {
      toast.error(response?.message);
      setErrors({ general: "Error updating student." });
      console.error("Error updating student:", error);
    }
  };

  // Add a loading check or fallback rendering when user is undefined
  if (!user) {
    return <div>Loading...</div>;
  }
  const popDown = () => {
    removeUpdate(false);
  };
  return (
    <div className="add-user pl-5 w-screen items-center">
      <div className="shadow-lg p-4 rounded bg-white ">
        <h2 className="text-center text-2xl font-bold mb-6">Update Student</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="text-red-500">{errors.general}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>

            <div className="form-group relative">
              <label htmlFor="password">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep current password"
              />
              <span
                className="absolute right-2 top-8 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
              {errors.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
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
              {errors.role && <div className="text-red-500">{errors.role}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="faculty">Faculty</label>
              <input
                type="text"
                id="faculty"
                value={form.faculty}
                onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              />
              {errors.faculty && (
                <div className="text-red-500">{errors.faculty}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              {errors.department && (
                <div className="text-red-500">{errors.department}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
              />
              {errors.studentId && (
                <div className="text-red-500">{errors.studentId}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <div className="text-red-500">{errors.firstName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                value={form.middleName}
                onChange={(e) =>
                  setForm({ ...form, middleName: e.target.value })
                }
              />
              {errors.middleName && (
                <div className="text-red-500">{errors.middleName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {errors.lastName && (
                <div className="text-red-500">{errors.lastName}</div>
              )}
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
              {errors.sex && <div className="text-red-500">{errors.sex}</div>}
            </div>

            <button type="submit" className="btn btn-primary">
              Update Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdateStudent;

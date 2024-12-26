import { useState, useContext, useEffect } from "react";
import "./Form.css";
import UserService from "../../../../Service/UserService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../../../../Context/Authcontext";
import getAuth from "../../../../Utilities/AuthHeader";

function LoginForm() {
  const {
    setIsLogged,
    isLogged,
    isAdmin,
    setIsAdmin,
    isDepartment,
    setIsDepartment,
    isCafe,
    setIsCafe,
    isPolice,
    setIsPolice,
    isLibrary,
    setIsLibrary,
    isGard,
    setIsGard,
    isProctor,
    setIsProctor,
    isSuperProctor,
    setIsSuperProctor,
    isRegistrar,
    setIsRegistrar,
    isStudent,
    setIsStudent,
    userData,
    fetchData,
    setUserData,
  } = useContext(userContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // Validation for email format
  const validateEmail = (email) => {
    // This pattern ensures valid emails like menge@gmail.com are allowed
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const checkIfLogin = async () => {
    const data = await getAuth();
    // console.log(userData);
    // console.log(isLogged);
    if (!isLogged) {
      return navigate("/login");
    }
    // console.log(data)
    // navigate acocording to user role
    return navigateToRolePage(data);
  };

  const handleEmailChange = (e) => {
    let email = e.target.value;
    let errorMessage = "";

    // Check for basic validation rules
    if (email && email.length <= 3) {
      errorMessage = "Email must be greater than 3 characters";
    } else if (email && email.indexOf("@") === -1) {
      errorMessage = 'Email must contain "@"';
    } else if (email && email.indexOf("@") !== email.lastIndexOf("@")) {
      errorMessage = 'Email must contain only one "@"';
    } else if (email && email.lastIndexOf(".") < email.indexOf("@")) {
      errorMessage = "Expected format: example@gmail.com";
    }

    // Update the form state
    setForm({ ...form, email });

    // Validate the email format using the updated regex
    if (!validateEmail(email)) {
      setErrors({
        ...errors,
        email: errorMessage || "Please enter a valid email address",
      });
    } else {
      setErrors({ ...errors, email: "" }); // Clear the error if the email is valid
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 54) {
      return "Password must be bettween 8 and 54 characters long";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setForm({ ...form, password });
    const passwordError = validatePassword(password);
    setErrors({ ...errors, password: passwordError });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!form.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else {
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

  // Role-based navigation after successful login
  const navigateToRolePage = (userData) => {
    if (userData) {
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "STUDENT") {
        navigate("/student");
      } else if (userData.role === "DEPARTMENT") {
        navigate("/department");
      } else if (userData.role === "CAFE") {
        navigate("/cafeHead");
      } else if (userData.role === "POLICE") {
        navigate("/police");
      } else if (userData.role === "GARD") {
        navigate("/gards");
      } else if (userData.role === "PROCTOR") {
        navigate("/proctor_GB");
      } else if (userData.role === "SUPERPROCTOR") {
        navigate("/proctorHead");
      } else if (userData.role === "LIBRARY") {
        navigate("/librirary");
      } else if (userData.role === "REGISTRAR") {
        navigate("/registral");
      } else {
        toast.error("No role found, please contact support.");
      }
    } else {
      toast.error("User data is not available.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogged) {
      console.log("check");
      checkIfLogin();
      return;
    } else {
      if (!validateForm()) {
        toast.error("Please fill the form before submitting.");
        return; // Prevent submission if validation fails
      }
    }

    try {
      const response = await UserService.login(form);
      if (response?.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({ userToken: response?.token })
        );
        toast.success(response.message);

        // Update context and navigate based on the user's role
        navigateToRolePage(response?.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className=" bg-slate-100 w-screen h-screen mx-auto flex justify-center items-center shadow-xl">
      <div className="login-box w-full shadow-xl">
        <h2 className="text-3xl font-bold text-black">Login</h2>
        <form autoComplete="off" onSubmit={handleSubmit} className="w-full">
          <div className="form-group w-full">
            <label htmlFor="userName" className="mb-3">
              Email
            </label>
            <input
              type="text"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="username"
              placeholder="Enter your email"
              autoComplete="off"
              value={form.email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <div className="invalid-feedback text-red-600">
                {errors.email}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="userPassword" className="mb-3">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter your password"
              autoComplete="off"
              value={form.password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <div className="invalid-feedback text-red-600">
                {errors.password}
              </div>
            )}
          </div>
          <div className="">
            {/* <Link to="/forgetPassword" className="forgot-password-link">
              Forgot Password?
            </Link> */}
          </div>
          <button type="submit" className="bg-gray-900 text-white py-2 w-full">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginForm;

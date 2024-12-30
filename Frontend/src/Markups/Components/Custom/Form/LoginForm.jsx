import { useState, useContext, useEffect } from "react";
import "./Form.css";
import UserService from "../../../../Service/UserService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../../../../Context/Authcontext";
import getAuth from "../../../../Utilities/AuthHeader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { jwtDecode } from "jwt-decode";

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
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const validateEmail = (email) => {
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

    if (email && email.length <= 3) {
      errorMessage = "Email must be greater than 3 characters";
    } else if (email && email.indexOf("@") === -1) {
      errorMessage = 'Email must contain "@"';
    } else if (email && email.indexOf("@") !== email.lastIndexOf("@")) {
      errorMessage = 'Email must contain only one "@"';
    } else if (email && email.lastIndexOf(".") < email.indexOf("@")) {
      errorMessage = "Expected format: example@gmail.com";
    } else if (form.email.length > 42) {
      errorMessage.email = "Email must be less than 42 characters.";
    }

    setForm({ ...form, email });

    if (!validateEmail(email)) {
      setErrors({
        ...errors,
        email: errorMessage || "Please enter a valid email address",
      });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 42) {
      return "Password must be between 8 and 42 characters long";
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
      checkIfLogin();
      return;
    } else {
      if (!validateForm()) {
        toast.error("Please fill the form before submitting.");
        return;
      }
    }

    try {
      const response = await UserService.login(form);
      if (response?.success) {
        const { token } = response;

        // Decode token to get expiration time
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000 - Date.now();

        // Save token to local storage
        localStorage.setItem("user", JSON.stringify({ userToken: token }));

        // Auto-logout on token expiry
        setTimeout(() => {
          localStorage.removeItem("user");
          setIsLogged(false);
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }, expirationTime);

        toast.success(response.message);

        navigateToRolePage(response?.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-slate-100 w-screen h-screen mx-auto flex justify-center items-center shadow-xl">
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
          <div className="form-group relative">
            <label htmlFor="userPassword" className="mb-3">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter your password"
              autoComplete="off"
              value={form.password}
              onChange={handlePasswordChange}
            />
            <span
              className="absolute right-2 top-12 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
            {errors.password && (
              <div className="invalid-feedback text-red-600">
                {errors.password}
              </div>
            )}
          </div>
          <div className="form-group">
            <Link
              to="/forgetPassword"
              className="forgot-password-link hover:text-black "
            >
              Forgot Password?
            </Link>
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

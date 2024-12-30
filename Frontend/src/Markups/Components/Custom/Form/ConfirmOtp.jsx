import React, { useState } from "react";
import "./conifrm.css"; // Make sure the filename is correct
import UserService from "../../../../Service/UserService";
import ResetPassword from "./ResetPassword";
import { toast } from "react-toastify";

function ConfirmOtp({ userId }) {
  const [form, setForm] = useState({ id: userId, otp: "" }); // Correctly initialize form with otp
  const [otpError, setOtpError] = useState("");
  const [resetPasswordShow, setResetPasswordShow] = useState(false);
  const validateOtp = (otp) => {
    if (!otp || typeof otp !== "string") {
      return "OTP is required.";
    }

    otp = otp.trim(); // Trim leading/trailing spaces

    if (otp.length !== 6) {
      return "OTP must be 6 digits.";
    }

    return ""; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValidationError = validateOtp(form.otp); // Validate OTP
    if (otpValidationError) {
      setOtpError(otpValidationError);
      return;
    } else {
      setOtpError(""); // Reset OTP error if validation passes
    }

    try {
      const response = await UserService.confirmOtp(form);
      // console.log(response);
      if (response.success) {
        toast.success("set new password");
        setResetPasswordShow(true);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("try again");
    }
  };

  return (
    <>
      {resetPasswordShow ? (
        <ResetPassword userId={userId} />
      ) : (
        <div className="container w-screen flex justify-center items-center">
          <div className="otp-box w-screen ">
            <h2 className="text-xl flex justify-center font-bold">
              Confirm OTP
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group w-full">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  placeholder="Enter the OTP"
                  value={form.otp} // Bind value to form state
                  onChange={(e) => {
                    setForm({
                      ...form,
                      otp: e.target.value,
                    });
                    setOtpError(validateOtp(e.target.value)); // Validate OTP as the user types
                  }}
                />
                {otpError && (
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}
              </div>
              <button type="submit" className="primary p-2">
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmOtp;

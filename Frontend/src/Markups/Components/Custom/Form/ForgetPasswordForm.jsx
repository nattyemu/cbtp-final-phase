import React, { useState } from 'react'
import './Form.css'
import { Link } from 'react-router-dom'
import UserService from '../../../../Service/UserService'
function ForgetPasswordForm() {
    const [form,setForm]=useState({})
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(form);
  
      const response = await UserService.forgetPassword(form);
    //  alert(response.message);
    }

  return (
    <>
  
  <div class="container">
    <div class="forgot-password-box">
      <h2>Forgot Password</h2>
      <p>Enter your email below to reset your password.</p>
      <form>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
          type="email"
           class="form-control" 
           id="email" required  
           onChange={(e) => {
            setForm({
              ...form,
              email: e.target.value,
            });
          }}

           />
        </div>
        <Link to="/confirmOtp"> <button onClick={handleSubmit} type="submit" class="btn btn-primary">Reset Password</button></Link>
       
      </form>
    </div>
  </div>

    </>
  )
}

export default ForgetPasswordForm
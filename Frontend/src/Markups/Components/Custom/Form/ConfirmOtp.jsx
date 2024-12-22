import React from 'react'
import './conifrm.css'
function ConfirmOtp() {
  return (
    <>
  <div class="container ">
    <div class="otp-box">
      <h2>Confirm OTP</h2>
      <form>
        <div class="form-group">
          <label for="otp">OTP</label>
          <input type="text" class="form-control" id="otp" placeholder="Enter the OTP"/>
        </div>
        <button type="submit" class="primary p-2">Verify</button>
      </form>
    </div>
  </div>
</>
  )
}

export default ConfirmOtp
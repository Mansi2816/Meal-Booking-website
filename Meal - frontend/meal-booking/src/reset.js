//frontend reset password
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './css/login.css';
import logo from './images/logo/logo.svg';

const ResetPage = () => {
  let navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    console.log('reset Password:', oldPassword, newPassword, confirmPassword);
    axios.post("http://localhost:5000/reset/resetPassword", {

      "oldPassword": oldPassword,
      "newPassword": newPassword,
      "confirmPassword": confirmPassword

    }).then((data) => {
      navigate("/")
      console.log(data);
    }).catch((error) => {
      alert("Password Changed Successfully")
      console.log(error);
    })
  };
  return (
    <div className="login-page">
      <div className="image-container">
      </div>
      <div className="login-form">
        <div className="logo-wrapper">
          <img src={logo} alt="Rishabh Software" />
          <span>Meal Facility</span>
        </div>
        <h1>Reset Password </h1>
        <form onSubmit={handleReset}>
          <label htmlFor='old-password'>Old Password</label>
          <input type="password" id="old-password" name="oldPassword" placeholder='Enter old password' required onChange={(e) => setOldPassword(e.target.value)} />

          <label htmlFor='new-password'>New Password</label>
          <input type="password" id="new-password" name="newPassword" placeholder='Enter new password' required onChange={(e) => setNewPassword(e.target.value)} />

          <label htmlFor='confirm-password'>Confirm Password</label>
          <input type="password" id="confirm-password" name="confirmPassword" placeholder='Enter confirm password' required onChange={(e) => setConfirmPassword(e.target.value)} />

          <br />
          <button type='submit'>Reset</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPage;

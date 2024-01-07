//frontend forgot password
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './css/forgot_password.css';
import logo from './images/logo/logo.svg';

const RecoverPassword = () => {
  let navigate = useNavigate();
  const [Username, setUsername] = useState("");

  const handleRecoverPassword = (e) => {
    e.preventDefault();

    console.log('Login with Username:', Username);
    axios.post("http://localhost:5000/Forgot/forgotPassword", {
      "Username": Username
    }).then((data) => {
      navigate("/resetpassword");
      console.log(data);
    }).catch((error) => {
      alert("something went wrong");
      console.log(error);
    });
  };

  return (
    <div className="forgotpass-page">
      <div className="forgotpass-image-container">
      </div>
      <div className="login-form">
        <div className="logo-wrapper">
          <img src={logo} alt="Rishabh Software" />
          <span>Meal Facility</span>
        </div>
        <h1>Forgot Password ?</h1>
        <p id='continue'>Enter the email below to continue.</p>
        <form onSubmit={handleRecoverPassword}>
          <label htmlFor='Username'>Email</label>
          <input
            type="text"
            id="Username"
            name="email"
            placeholder='Enter email'
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Link to='/'>Back to Login</Link>
          <br />
          <button type="submit" className='forgot-btn'>Send Email</button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;

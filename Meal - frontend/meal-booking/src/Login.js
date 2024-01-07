import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './css/login.css';
import logo from './images/logo/logo.svg';

const LoginPage = () => {
  let navigate = useNavigate()
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (e) => {
    e.preventDefault()

    // Add authentication logic here
    console.log('Logging in with:', Email, password);
    axios.post("http://localhost:5000/user/adminLogin", {

      "userName": Email,
      "password": password

    }).then((data) => {
      navigate("/calender")
      console.log(data);
    }).catch((error) => {
      alert("Something went wrong")
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
        <h1>Sign in to your account</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor='email'>Email</label>
          <input type="text" id="email" name="email" placeholder='Enter email'
            value={Email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor='password'>Password</label>
          <input type="password" id="password" name="password" placeholder='Enter passowrd'
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Link to="/forgotpassword" id="forgot">Forgot Password</Link>
          <br />
          {/* <button onClick={handleLogin}>Log In</button> */}
          <button type='submit'> Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
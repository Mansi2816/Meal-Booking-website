import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/navbar.css';


const Navbar = () => {
  let navigate = useNavigate()
  const handleLogout = () => {
    navigate("/")
    // Implement your logout functionality
    console.log('User logged out');
  };
  return (
    <header>
      <div className="navbar">
        <div className="logo">
        </div>
        <p>Meal Booking</p>
        <div className="nav-links">
          <Link to="/calender">Calender</Link>
          <Link to="/employeereg">Employee Registration</Link>
          <Link to="/bookinglist">Booking List</Link>
          <Link to="/addbooking">Add Booking</Link>
          <Link to="/disabledate">Disable Date</Link>
          <Link to="/disabledatelist">Disable Date List</Link>
          <Link to="/resetPassword">Change Password</Link>


        </div>
        <div className='logoutContainer'>
          <button onClick={handleLogout} className='logoutButton'>


            {/* <Link to="/login">Logout</Link> */}

            {/* {<script>

              const logoutButton = document.getElementById('logoutButton');


              function handleLogout() {

                window.location.href = '/'
              }

              logoutButton.addEventListener('click', handleLogout);
            </script>} */}

            Logout

          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

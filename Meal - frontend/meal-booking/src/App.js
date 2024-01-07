import { Routes, Route } from "react-router-dom";

import LoginPage from './Login';
import ForgotPassword from './Forgot_password';
// import App from './App';
import Calendar from "./Calendar";
import EmployeeForm from "./Employee_Registration";
import AddBooking from './AddBooking';
import BookingList from "./BookingList";
import DisableDateList from './DisableDateList';
import DisableDate from './DisableDate';
import './css/App.css'
import reset from "./reset";


function App() {
  return (
    <Routes>
<Route path="/" Component={LoginPage} />
      <Route path="/forgotpassword" Component={ForgotPassword} />
      <Route path="/Calender" Component={Calendar} />
      <Route path="/employeereg" Component={EmployeeForm} />
      <Route path="/addbooking" Component={AddBooking} />
      <Route path="/bookinglist" Component={BookingList} />
      <Route path="/disabledate" Component={DisableDate} />
      <Route path="/disabledatelist" Component={DisableDateList} />
      <Route path="/resetpassword" Component={reset} />
    </Routes>
  );
}
export default App;
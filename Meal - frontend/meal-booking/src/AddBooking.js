import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/addBooking.css'; // Import your custom CSS file
import Navbar from './Navbar';
import Footer from './Footer';

// Your functional component
const BookingPage = () => {
  // State variables
  const [bookingType, setBookingType] = useState('Employee');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [departmentSearch, setDepartmentSearch] = useState('');
  // const [selectedEmployees, setSelectedEmployees] = useState([]);
  // const [employeeData, setEmployeeData] = useState([]); // Assuming you fetch this data from your database

  // Fetch employee data based on department search
  useEffect(() => {
    // Implement your API call to fetch employee data based on departmentSearch
    // Update employeeData state with the fetched data
    // Example:
    // const fetchedData = fetchDataFromDatabase(departmentSearch);
    // setEmployeeData(fetchedData);
  }, [departmentSearch]);

  // Function to handle employee selection
  // const handleEmployeeSelection = (employeeId) => {
  //   // Toggle employee selection
  //   const updatedSelection = selectedEmployees.includes(employeeId)
  //     ? selectedEmployees.filter((id) => id !== employeeId)
  //     : [...selectedEmployees, employeeId];

  //   setSelectedEmployees(updatedSelection);
  // };

  // Function to handle booking
  const handleBooking = () => {
    // Implement booking logic
    // You can use selectedEmployees, startDate, endDate, and bookingType for further processing
    // Example:
    // console.log("Booking Details:", { bookingType, startDate, endDate, selectedEmployees });
  };

  return (
    <>
      <Navbar />
      <div className='backadd'>
        <div className="booking-container">
          {/* Booking Type Selection */}
          <div className="booking-type">
            <label>
              Booking Type:
              <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                <option value="Employee">Employee</option>
                <option value="NonEmployee">Non Employee</option>
                <option value="Custom">Custom</option>
              </select>
            </label>
          </div>

          {/* Date Picker */}
          <div className="date-picker">
            <label>Start Date:</label>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <label>End Date:</label>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>

          {/* Department Search */}
          <div className="department-search">
            <label>Search Department:</label>
            <input type="text" value={departmentSearch} onChange={(e) => setDepartmentSearch(e.target.value)} />
          </div>

          <div className="notes">
            <label>Notes:</label>
            <textarea rows="4" cols="50" placeholder="Enter notes here..." />
          </div>

          {/* Employee Table
          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody> */}
          {/* {employeeData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleEmployeeSelection(employee.id)}
                  />
                </td>
              </tr> */}
          {/* ))} */}
          {/* </tbody>
            </table>
          </div> */}

          {/* Book Button */}
          <button onClick={handleBooking}>Book</button>
        </div>
        
      </div>
      <Footer />
    </>
  );
};


export default BookingPage;
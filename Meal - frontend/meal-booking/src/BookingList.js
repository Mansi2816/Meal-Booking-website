import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Navbar from './Navbar';
import Footer from './Footer';
import 'react-datepicker/dist/react-datepicker.css';
import './css/bookingList.css';
// import axios from 'axios';

const BookingList = () => {
  const [bookingType, setBookingType] = useState('Employees');
  const [dateFilter, setDateFilter] = useState('Current Month');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookings] = useState([]);
  const [totalMeals, setTotalMeals] = useState(0);

  // useEffect(() => {
  //  const fetchData = async () => {
  //   // const response = await axios.get('http://localhost:3000/bookings');
  //   const bookingsData = response.data;
  //   setBookings(bookingsData);
  //  };

  //  fetchData();
  // }, []);


  const handleBookingTypeChange = (event) => {
    setBookingType(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const calculateTotalMeals = () => {
    // Add your logic here to calculate total meals based on selected time period
    // For example, you can iterate through bookings and sum up the totalMealsBooked
    let total = 0;
    for (const booking of bookings) {
      total += booking.totalMealsBooked;
    }
    setTotalMeals(total);
  };

  const renderEmployeesTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department Name</th>
            {dateFilter !== 'Single Date' && <th>Total Meals Booked</th>}
            {dateFilter !== 'Single Date' && <th>Meal Dates</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.employeeId}>
              <td>{booking.employeeId}</td>
              <td>{booking.employeeName}</td>
              <td>{booking.departmentName}</td>
              {dateFilter !== 'Single Date' && (
                <>
                  <td>{booking.totalMealsBooked}</td>
                  <td>{booking.mealDates.join(', ')}</td>

                  <tr>

                  </tr>

                </>
              )}
            </tr>
          ))
          }
        </tbody >
      </table >
    );
  };

  const renderNonEmployeeTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr>
              <td>{booking.category}</td>
              <td>{booking.count}</td>
              <td>{booking.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCustomTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr>
              <td>{booking.category}</td>
              <td>{booking.count}</td>
              <td>{booking.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <>
      <Navbar />
      <div className='back-booking-list'>
        <div className="booking-list">
          <div className="booking-list-filters">
            {/* Booking Type Select */}
            <label>Booking Type:</label>
            <select value={bookingType} onChange={handleBookingTypeChange}>
              <option value="Employees">Employees</option>
              <option value="Non Employees">Non Employees</option>
              <option value="Custom">Custom</option>
            </select>

            {/* Date Filter Select */}
            <label>Date Filter:</label>
            <select value={dateFilter} onChange={handleDateFilterChange}>
              <option value="Current Month">Current Month</option>
              <option value="Single Date">Single Date</option>
              <option value="Custom Range">Custom Range</option>
            </select>

            {/* Move DatePicker and Button */}
            {dateFilter === 'Single Date' && (
              <div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            )}

            {dateFilter === 'Custom Range' && (
              <>
                <label> Start Date:
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                  />
                </label>
                <label> End Date:
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </label>
              </>
            )}

            {/* Calculate Total Meals Button */}
            <button onClick={calculateTotalMeals}>Calculate Total Meals</button>
          </div>

          {bookingType === 'Employees' && renderEmployeesTable()}
          {bookingType === 'Non Employees' && renderNonEmployeeTable()}
          {bookingType === 'Custom' && renderCustomTable()}

          {dateFilter !== 'Single Date' && (
            <div className='total'>
              <p>Total Meals Booked: {totalMeals}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingList;
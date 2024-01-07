import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Navbar from './Navbar';
import Footer from './Footer';
import 'react-calendar/dist/Calendar.css';
import './css/calendar.css';

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addBook, setAddBook] = useState(/* initial value */);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // You can implement logic here to fetch meal bookings for the selected date
    // For now, let's assume you have the data for the number of employee, non-employee, and custom bookings
  };

  const handleAddBook = (AddBooking) => {
    setAddBook(AddBooking);
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} value={selectedDate} />
          {/* Assuming 'addbooking' is a component that accepts onChange prop */}
          <addbooking onChange={handleAddBook} value={addBook} />
        </div>
        <div className="booking-summary-container">
          <div className="booking-summary-inner">
            <h2 className='summary'>Booking Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Non-Employee</th>
                  <th>Custom</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedDate.toDateString()}</td>
                  <td>5</td> {/* Replace with the actual number of employee bookings */}
                  <td>3</td> {/* Replace with the actual number of non-employee bookings */}
                  <td>2</td> {/* Replace with the actual number of custom bookings */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DatePicker;

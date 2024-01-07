import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './css/disableDate.css';

const DisableDateForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle the form submission logic here
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Reason:', reason);

    // Add your logic to disable dates
  };

  return (
    <>
    <Navbar/>
    <div className='backDisable'>
    <div className='container'>
      <h1>Disable Date: Add</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="reason">Reason:</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className='disableDatebtn'>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default DisableDateForm;
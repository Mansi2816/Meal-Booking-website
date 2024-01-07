import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './css/disableDateList.css';

const DateListPage = () => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAddDate = () => {
    if (newDate && newReason) {
      setDates([...dates, { date: newDate, reason: newReason }]);
      setNewDate('');
      setNewReason('');
    }
  };

  return (
    <>
    <Navbar/>
    <div className='backlist'>
    <div className='disableDateList'>
    <div>
        <h2>Add New Date</h2>
        <label>
          Date:
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </label>
        <label>
          Reason:
          <input
            type="text"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
          />
        </label>
        <button onClick={handleAddDate}>Add Date</button>
      </div>

      <h1>Disable Date List</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default DateListPage;
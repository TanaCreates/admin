import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Adjust the path as needed
import { ref, push, set } from 'firebase/database';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');

  // Handle adding a new employee
  const handleAddEmployee = async () => {
    if (!name || !surname || !email || !personalEmail || !idNumber || !phoneNumber || !password || !position) {
      alert('All fields are required!');
      return;
    }

    const employeeData = {
      name,
      surname,
      email,
      personalEmail,
      idNumber: Number(idNumber), // Convert ID number to a number
      phoneNumber: Number(phoneNumber), // Convert phone number to a number
      password,
      position,
    };

    try {
      const newEmployeeRef = push(ref(db, 'Employees')); // Generate unique key for the employee
      await set(newEmployeeRef, employeeData); // Push data to Firebase
      alert('Employee added successfully!');
      resetForm(); // Reset the form after submission
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Could not add employee. Please try again.');
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setName('');
    setSurname('');
    setEmail('');
    setPersonalEmail('');
    setIdNumber('');
    setPhoneNumber('');
    setPassword('');
    setPosition('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Employee</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="email"
        placeholder="Work Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="email"
        placeholder="Personal Email"
        value={personalEmail}
        onChange={(e) => setPersonalEmail(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="ID Number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />
      {/* Dropdown for Position */}
      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      >
        <option value="">Select Position</option>
        <option value="Frontstore">Frontstore</option>
        <option value="Manager">Manager</option>
        <option value="Pod Section">Pod Section</option>
      </select>

      <button onClick={handleAddEmployee} style={{ padding: '10px', width: '100%', backgroundColor: '#4CAF50', color: 'white' }}>
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployee;

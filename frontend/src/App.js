import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorLogin from './components/auth/DoctorLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/" element={<Navigate to="/doctor/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import Notes from './pages/Notes';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import SignupSuccess from './pages/Auth/SignupSuccess';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/Auth/ResetPassword';
import DateRecords from './pages/DateRecords';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/date-records/:date" element={<DateRecords />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
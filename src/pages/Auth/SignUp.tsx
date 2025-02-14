import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import SignInWithGoogle from "./SignInWithGoogle";
import { ToastContainer } from "react-toastify";

export default function SignUp() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const { sendOtpToEmail, verifyOtp, setPasswordAndSignUp,signUp } = useAuth();
  const handleSendOtp = async (e) => {
    e.preventDefault();
   const otpSentSuccess =  await sendOtpToEmail(fullname,email);
    if(otpSentSuccess){
      setOtpSent(true);
    }
   
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verified = await verifyOtp(email, otp);
    if (verified) setOtpVerified(true);
  };
  const handleSetPassword = async (e) => {
    e.preventDefault();
    await setPasswordAndSignUp(fullname, password);
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //    signUp(fullname, email, password);

  //   // if (success) {
  //   //   navigate('/signup-success');
  //   // } else {
  //   //   setError("Email already exists");
  //   // }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
        <div className="mb-4">
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>
        <div className="mb-4">
             {!otpSent && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white mb-4"
              required
            />
            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
              Send OTP
            </button>
          </form>
        )}
          </div>

          <div className="mb-4">
             {otpSent && !otpVerified && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white mb-4"
              required
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white">
              Verify OTP
            </button>
          </form>
        )}
          </div>
         
          
          <div className="mb-6">
            {otpVerified && (
          <form onSubmit={handleSetPassword}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set Password"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white mb-4"
              required
            />
            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
            Signup
            </button>
          </form>
        )}
          </div>
        
        </div>
        <div className="flex items-center mt-6">
      <div className="w-full border-t border-gray-600"></div>
      <p className="px-4 text-gray-400">or</p>
      <div className="w-full border-t border-gray-600"></div>
    </div>
    <div className="flex justify-center mt-4">
      <SignInWithGoogle />
            </div>
      </div>
      <ToastContainer />
    </div>
  );
}
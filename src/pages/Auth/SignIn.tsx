import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { ToastContainer } from "react-toastify";
import SignInWithGoogle from "./SignInWithGoogle";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = signIn(email, password);
    
    // if (success) {
    //   navigate('/');
    // } else {
    //   setError("Invalid email or password");
    // }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
          required
        />
          </div>
          <div className="mb-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
          required
        />
          </div>
          <button 
        type="submit"
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
          >
        Sign In
          </button>
        </form>
        
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
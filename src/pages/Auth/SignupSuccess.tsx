import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function SignupSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to sign in page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Signup Successful!</h2>
        <p className="text-gray-400 mb-6">
          Your account has been created successfully. Redirecting you to the login page...
        </p>
        <div className="animate-pulse text-purple-500">
          Please wait...
        </div>
      </div>
    </div>
  );
}
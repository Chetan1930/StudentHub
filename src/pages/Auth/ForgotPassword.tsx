import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <button
          onClick={() => navigate('/signin')}
          className="text-gray-400 hover:text-purple-500 transition-colors flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>

        <p className="text-gray-400 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('error') 
              ? 'bg-red-500/10 text-red-500' 
              : 'bg-green-500/10 text-green-500'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Send className="w-5 h-5 animate-pulse" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Reset Instructions
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
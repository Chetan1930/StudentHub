import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../context/firebase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then((userEmail) => setEmail(userEmail))
        .catch(() => setError('Invalid or expired password reset link.'));
    } else {
      setError('Missing reset code.');
    }
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      navigate('/signin', {
        state: { message: 'Password reset successful! Please sign in.' }
      });
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* <button
          onClick={() => navigate('/signin')}
          className="text-gray-400 hover:text-purple-500 flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </button> */}

        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
        </div>

        {email && (
          <p className="text-gray-400 mb-4">Resetting password for: <strong>{email}</strong></p>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 flex items-start gap-2">
            <KeyRound className="w-5 h-5 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {/* <div className="mt-6 text-center text-gray-400">
          <p>
            Remember your password?{' '}
            <Link to="/signin" className="text-purple-500 hover:text-purple-400">Sign In</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}

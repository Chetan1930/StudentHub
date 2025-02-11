import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  GraduationCap,
  LogIn,
  UserPlus,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileMenu from './ProfileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-500" : "text-gray-300 hover:text-purple-500";
  };

  // Protected navigation helper

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      navigate('/signin', { state: { from: path } });
      return;
    }
    navigate(path);
  };

  useEffect(() => {
    // This effect will run every time the user changes
  }, [user]);
  

  return (
    <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">StudentHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`transition-colors ${isActive('/')}`}>
              Home
            </Link>
            {/* Protected Routes */}
            <button 
              onClick={() => handleProtectedNavigation('/attendance')}
              className={`transition-colors ${isActive('/attendance')}`}
            >
              Attendance
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/notes')}
              className={`transition-colors ${isActive('/notes')}`}
            >
              Notes
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/portfolio')}
              className={`transition-colors ${isActive('/portfolio')}`}
            >
              Portfolio Builder
            </button>
            <Link to="/contact" className={`transition-colors ${isActive('/contact')}`}>
              Contact Us
            </Link>
            <Link to="/about" className={`transition-colors ${isActive('/about')}`}>
              About Us
            </Link>
          </div>

          {/* Auth Buttons or Profile Menu */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            ) : user ? (
              <ProfileMenu />
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="px-4 py-2 text-gray-300 hover:text-purple-500 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link to="/" className={`transition-colors ${isActive('/')}`}>
                Home
              </Link>
              {/* Protected Mobile Routes */}
              <button 
                onClick={() => handleProtectedNavigation('/attendance')}
                className={`text-left transition-colors ${isActive('/attendance')}`}
              >
                Attendance
              </button>
              <button 
                onClick={() => handleProtectedNavigation('/notes')}
                className={`text-left transition-colors ${isActive('/notes')}`}
              >
                Notes
              </button>
              <button 
                onClick={() => handleProtectedNavigation('/portfolio')}
                className={`text-left transition-colors ${isActive('/portfolio')}`}
              >
                Portfolio Builder
              </button>
              <Link to="/contact" className={`transition-colors ${isActive('/contact')}`}>
                Contact Us
              </Link>
              <Link to="/about" className={`transition-colors ${isActive('/about')}`}>
                About Us
              </Link>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                ) : user ? (
                  <ProfileMenu />
                ) : (
                  <>
                    <Link 
                      to="/signin" 
                      className="px-4 py-2 text-gray-300 hover:text-purple-500 transition-colors flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
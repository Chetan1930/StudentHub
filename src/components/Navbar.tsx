import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  GraduationCap,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-500" : "text-gray-300 hover:text-purple-500";
  };

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
            <Link to="/" className={`transition-colors ${isActive('/')}`}>Home</Link>
            <Link to="/attendance" className={`transition-colors ${isActive('/attendance')}`}>Attendance</Link>
            <Link to="/notes" className={`transition-colors ${isActive('/notes')}`}>Notes</Link>
            <Link to="/portfolio" className={`transition-colors ${isActive('/portfolio')}`}>Portfolio Builder</Link>
            <Link to="/contact" className={`transition-colors ${isActive('/contact')}`}>Contact Us</Link>
            <Link to="/about" className={`transition-colors ${isActive('/about')}`}>About Us</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link to="/" className={`transition-colors ${isActive('/')}`}>Home</Link>
              <Link to="/attendance" className={`transition-colors ${isActive('/attendance')}`}>Attendance</Link>
              <Link to="/notes" className={`transition-colors ${isActive('/notes')}`}>Notes</Link>
              <Link to="/portfolio" className={`transition-colors ${isActive('/portfolio')}`}>Portfolio Builder</Link>
              <Link to="/contact" className={`transition-colors ${isActive('/contact')}`}>Contact Us</Link>
              <Link to="/about" className={`transition-colors ${isActive('/about')}`}>About Us</Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
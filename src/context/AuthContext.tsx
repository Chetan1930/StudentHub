import React, { createContext, useContext, useState } from 'react';

// This is just for demo, replace this with your database
const DEMO_USERS = [
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = (email, password) => {
    // Check if user exists and password matches
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setUser(user);
      return true;
    }
    return false;
  };

  const signUp = (name, email, password) => {
    // Check if user already exists
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) {
      return false;
    }
    
    // In real app, you would:
    // 1. Connect to Supabase
    // 2. Insert into auth.users table
    // 3. Handle email verification if needed
    
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Sign-in failed");
      });
  };

  const signUp = (name, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          fullname: name,
          photo: "",
        });
        
        window.location.href = "/";
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Sign-up failed");
      });
  };

  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        setUser(null);
        
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Sign-out failed");
      });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";
import { updatePassword,sendPasswordResetEmail,signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "./firebase";
import {collection,query,where,getDocs, setDoc, doc,getDoc,getFirestore } from "firebase/firestore";

import { sendEmail } from "./sendEmail";
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState(null);
  const [storedEmail, setStoredEmail] = useState("");
  const db = getFirestore();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //   });
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: userDoc.exists() ? userDoc.data().fullname : user.displayName,
          photo: userDoc.exists() ? userDoc.data().photo : user.photoURL,
        });
      } else {
        setUser(null);
      }
    });
  
    return unsubscribe;
  }, []);


  const sendOtpToEmail = async (email) => {
    try {
     
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        toast.error("User already exists. Please log in.");
        return false; 
      }

      const userDoc =  querySnapshot.docs[0].data();
      const fullname = userDoc.fullname;
  
      
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      setOtp(generatedOtp);
      setStoredEmail(email);
  
      await sendEmail(fullname, email, generatedOtp); // Send OTP with name
      toast.success(`OTP sent to ${email}`);
      return true;
    } catch (err) {
      toast.error("Failed to send OTP.");
      return false;
    }
  };

  const verifyOtp = async (email, enteredOtp) => {
    if (email !== storedEmail || parseInt(enteredOtp) !== otp) {
      toast.error("Invalid OTP. Try again.");
      return false;
    }
    toast.success("OTP Verified! Set your password.");
    return true;
  };


  const setPasswordAndSignUp = async (fullname, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, storedEmail, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullname: fullname,
        photo: "",
      });

      toast.success("Signup Successful!");
      setStoredEmail("");
      setOtp(null);
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message);
    }
  };
  const resetPassword = async (email) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success("Password reset instructions sent to your email.");
    } catch (error) {
      toast.error(error.message || "Failed to send password reset email.");
    }
  };





  const signIn = (email, password) => {
     signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Sign-in failed");
      });
  };
  // const signUp = (name, email, password) => {
  //  createUserWithEmailAndPassword(auth, email, password)
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;
  //       await setDoc(doc(db, "users", user.uid), {
  //         email: user.email,
  //         fullname: name,
  //         photo: "",
  //       });
        
  //       window.location.href = "/";
  //     })
  //     .catch((err) => {
  //       toast.error(err instanceof Error ? err.message : "Sign-up failed");
  //     });
  // };

  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        setUser(null);
        window.location.href = '/signin';
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Sign-out failed");
      });
  };

  return (
    <AuthContext.Provider value={{ user,sendOtpToEmail,verifyOtp,setPasswordAndSignUp, signIn, signOut,resetPassword }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
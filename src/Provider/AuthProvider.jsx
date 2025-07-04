// React core
import { useEffect, useState, useCallback } from "react";

// PropTypes for validating props
import PropTypes from "prop-types";

// Firebase Auth SDK
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

// Firebase configuration (custom setup)
import auth from "../Firebase/firebase.config";

// Context for sharing auth across app
import { AuthContext } from "./AuthContext";

// Initialize Google and Facebook Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Ensure user is initialized to null
  const [loading, setLoading] = useState(true);

  // Create a new user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update User
  const updateUser = (displayName, photoURL) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    });
  };

  // Sign in with email and password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out user
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once user is set
    });
    return () => unSubscribe(); // Cleanup subscription on unmount
  }, []);

  // Provide auth info to the rest of the app
  const authInfo = {
    user,
    loading,
    createUser,
    logOut,
    signIn,
    signInWithGoogle,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

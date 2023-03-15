import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
// Firebase Imports
import { auth, db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = (email, password, displayName) => {
    setError(null);
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.user });

        // Denormalize user email & uuid with custom doc id of uuid
        try {
          setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
            displayName: displayName,
          });
        } catch (err) {
          console.error(err.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return { error, loading, signup };
};

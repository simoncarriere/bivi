import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

// Firebase Imports
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const useSignin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    setError(null);
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.user });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return { error, loading, login };
};

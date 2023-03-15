import { createContext, useReducer, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null, currentRoom: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    case "SET_CURRENT_ROOM":
      return { ...state, currentRoom: action.payload };
    case "DELETE_CURRENT_ROOM":
      return { ...state, currentRoom: action.payload };
    default:
      return state;
  }
};

// Children = to our app/root component providing access to our auth state data globally
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false, // Prevent a flashed unauthenticated state on load (true when we make the initial connect to firebase auth and figures out if we're logged in or not)
    currentRoom: null,
  });

  // Fires immediately to connect with firebase auth to see if user is logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user }); // user default to null if logged out
      unsub();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

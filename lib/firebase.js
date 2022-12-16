import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getFunctions} from 'firebase/functions'

const firebaseConfig = {
    apiKey: "AIzaSyBbdNzJHy4WufxD4QLCDRVljc9tdL0ZVHA",
    authDomain: "barebones-3d11c.firebaseapp.com",
    projectId: "barebones-3d11c",
    storageBucket: "barebones-3d11c.appspot.com",
    messagingSenderId: "1093321436265",
    appId: "1:1093321436265:web:32ccb88760b8fbe54f86f8",
    measurementId: "G-T7R7V05DTS"
  };
  
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app)  
export const auth = getAuth(app)
export const functions = getFunctions(app)
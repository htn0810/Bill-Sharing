import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Add your Firebase config here
  authDomain: "bill-sharing-e5f7e.firebaseapp.com",
  projectId: "bill-sharing-e5f7e",
  storageBucket: "bill-sharing-e5f7e.firebasestorage.app",
  messagingSenderId: "78295854205",
  appId: "1:78295854205:web:0e719b90611cea09d6d514",
  measurementId: "G-HYF0EB4560",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

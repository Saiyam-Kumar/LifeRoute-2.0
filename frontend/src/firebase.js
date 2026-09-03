import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQs0MK89XM9JJIYXzvMRWMJYE39zV2um8",
  authDomain: "liferoute-2-0.firebaseapp.com",
  projectId: "liferoute-2-0",
  storageBucket: "liferoute-2-0.firebasestorage.app",
  messagingSenderId: "910235459944",
  appId: "1:910235459944:web:0c17620d02646d3f1bf6dd",
  measurementId: "G-YGJYDJSQ57"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
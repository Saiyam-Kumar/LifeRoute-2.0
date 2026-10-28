import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNLEi7AmDagT3CgN-5GJdo9VMsBPpLPrI",
  authDomain: "liferoute-2-0-demo.firebaseapp.com",
  projectId: "liferoute-2-0-demo",
  storageBucket: "liferoute-2-0-demo.firebasestorage.app",
  messagingSenderId: "493149684812",
  appId: "1:493149684812:web:c73183a0142b44b81260e9",
  measurementId: "G-JTCTJT64VG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const analytics = getAnalytics(app);

export default app;
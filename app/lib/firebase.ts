import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT2ORn2LH54Q7UDDZ1rzKTX87z7pUbKVc",
  authDomain: "teamscope-e7b15.firebaseapp.com",
  projectId: "teamscope-e7b15",
  storageBucket: "teamscope-e7b15.firebasestorage.app",
  messagingSenderId: "170751335367",
  appId: "1:170751335367:web:bfd86c16fa1e90f1bc97e2",
  measurementId: "G-474FZF2G39",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
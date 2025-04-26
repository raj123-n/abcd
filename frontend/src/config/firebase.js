import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBRyWzGl9drPADQ1XrNgxL20V5tiD99Xxo",
  authDomain: "help-c0571.firebaseapp.com",
  projectId: "help-c0571",
  storageBucket: "help-c0571.firebasestorage.app",
  messagingSenderId: "600652981510",
  appId: "1:600652981510:web:ce19bd0e00974a378d2a87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCox5O_bme3tuNThyCD4a9DJavdhA8D2qE",
  authDomain: "todo-list-app-df146.firebaseapp.com",
  projectId: "todo-list-app-df146",
  storageBucket: "todo-list-app-df146.firebasestorage.app",
  messagingSenderId: "657666586499",
  appId: "1:657666586499:web:dc8e367de107878a7a28b6",
  measurementId: "G-RQST817TX6",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

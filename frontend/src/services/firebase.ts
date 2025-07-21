// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_ZyPZ4gyc6epbIGMIBWr0kpfainrFfmY",
  authDomain: "ai-chatbot-845e9.firebaseapp.com",
  projectId: "ai-chatbot-845e9",
  storageBucket: "ai-chatbot-845e9.firebasestorage.app",
  messagingSenderId: "558225862883",
  appId: "1:558225862883:web:9a22f722a5a7a6222c15d6",
  measurementId: "G-DR1Y77YTRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
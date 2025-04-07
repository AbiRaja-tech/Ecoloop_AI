// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBhGG1gqFR0nGQnJv9B2mfOks23VyOeOxQ",
  authDomain: "eco-loop-c972c.firebaseapp.com",
  projectId: "eco-loop-c972c",
  storageBucket: "eco-loop-c972c.firebasestorage.app",
  messagingSenderId: "51958367991",
  appId: "1:51958367991:web:8915581fe0a280419e75f2",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('Firebase Config:', firebaseConfig); // Should log your config
console.log('Firestore initialized:', db);

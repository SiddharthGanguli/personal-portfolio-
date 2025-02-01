// firebase.js

// Import the Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFcKo9yeY8_XdHG13tx6FS_9l4RKrFkFo",
  authDomain: "personal-portfolio-902d8.firebaseapp.com",
  projectId: "personal-portfolio-902d8",
  storageBucket: "personal-portfolio-902d8.firebasestorage.app",
  messagingSenderId: "1026899552063",
  appId: "1:1026899552063:web:a6baa5eef4e03a476c158a",
  measurementId: "G-RYL5DNY3C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to upload content to Firestore
async function uploadContent(title, link) {
  try {
    const docRef = await addDoc(collection(db, "social_content"), {
      title: title,
      link: link,
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error uploading content: ", e);
    throw e;  // Re-throw the error to be handled in dashboard.js
  }
}

// Function to fetch content from Firestore
async function fetchContent() {
  try {
    const q = query(collection(db, "social_content"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Handle fetched data here (e.g., display on Social Hub)
      console.log(doc.id, " => ", doc.data());
    });
  } catch (e) {
    console.error("Error fetching content: ", e);
    throw e;  // Re-throw the error to be handled in dashboard.js
  }
}

export { uploadContent, fetchContent };

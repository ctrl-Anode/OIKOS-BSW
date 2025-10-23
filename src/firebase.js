// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// Function to check if the user is an admin
export async function isAdmin(user) {
  if (!user) return false;
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

// Function to add a new word to Firestore
export async function addWord(word, category = null) {
  try {
    const wordData = {
      word,
      category,
      difficulty: 'CVC', // Default difficulty level
      createdAt: new Date()
    };
    await db.collection('words').add(wordData);
    console.log('Word added successfully:', word);
  } catch (error) {
    console.error('Error adding word to Firestore:', error);
  }
}

// Function to upload audio file to Firebase Storage
export async function uploadAudio(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Audio uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw error;
  }
}

// Function to edit an existing word in Firestore
export async function editWord(wordId, updatedData) {
  try {
    const wordRef = doc(db, 'words', wordId);
    await updateDoc(wordRef, updatedData);
    console.log('Word updated successfully:', wordId);
  } catch (error) {
    console.error('Error updating word in Firestore:', error);
  }
}

// Function to delete a word from Firestore
export async function deleteWord(wordId) {
  try {
    const wordRef = doc(db, 'words', wordId);
    await deleteDoc(wordRef);
    console.log('Word deleted successfully:', wordId);
  } catch (error) {
    console.error('Error deleting word from Firestore:', error);
  }
}

// Function to upload full word audio and phonics audios
export async function uploadWordAudios(word, fullAudioFile, letterAudioFiles) {
  try {
    const audioUrls = {
      full: null,
      letters: []
    };

    // Upload full word audio
    if (fullAudioFile) {
      const fullAudioPath = `audio/${word}/full.mp3`;
      audioUrls.full = await uploadAudio(fullAudioFile, fullAudioPath);
    }

    // Upload phonics audios for each letter
    for (const [index, letterFile] of letterAudioFiles.entries()) {
      const letterAudioPath = `audio/${word}/letter_${index + 1}.mp3`;
      const letterUrl = await uploadAudio(letterFile, letterAudioPath);
      audioUrls.letters.push(letterUrl);
    }

    // Store audio URLs in Firestore
    const wordData = {
      word,
      audios: audioUrls,
      createdAt: new Date()
    };
    await db.collection('words').add(wordData);

    console.log('Word audios uploaded and stored successfully:', word);
  } catch (error) {
    console.error('Error uploading word audios:', error);
  }
}

/* Import the Firebase modules that you need in your app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };*/
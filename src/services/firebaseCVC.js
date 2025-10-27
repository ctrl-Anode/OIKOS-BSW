import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';

// Upload single audio and return its URL
export async function uploadCvcAudio(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Add new CVC word
export async function addCvcWord({ word, category, updatedAt }) {
  // Validate word
  if (!word || !word.trim()) {
    throw new Error('Word cannot be empty.');
  }
  
  const cvcWord = word.trim().toUpperCase();
  
  if (cvcWord.length !== 3) {
    throw new Error('Word must be exactly 3 characters long.');
  }
  
  // Validate CVC pattern
  const cvcPattern = /^[^aeiou][aeiou][^aeiou]$/i;
  if (!cvcPattern.test(cvcWord)) {
    throw new Error('Word must follow Consonant-Vowel-Consonant pattern.');
  }
  
  // Validate category
  if (!category || !category.trim()) {
    throw new Error('Category is required.');
  }
  
  return await addDoc(collection(db, 'cvcWords'), {
    word: cvcWord,
    category: category.trim(),
    difficulty: 'CVC',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Check if a CVC word exists in the database (case-insensitive)
export async function cvcWordExists(word) {
  const snapshot = await getDocs(collection(db, 'cvcWords'));
  return snapshot.docs.some(doc => doc.data().word.toLowerCase() === word.trim().toLowerCase());
}

// Fetch all CVC words
export async function getAllCvcWords() {
  const snapshot = await getDocs(collection(db, 'cvcWords'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update an existing CVC word
export async function updateCvcWord(id, { word, category, updatedAt }) {
  const wordRef = doc(db, 'cvcWords', id);
  await updateDoc(wordRef, {
    word,
    category,
    updatedAt: new Date().toISOString()
  });
}

// Delete a CVC word without requiring audio paths
export async function deleteCvcWord(id) {
  const wordRef = doc(db, 'cvcWords', id);

  // Delete Firestore document
  await deleteDoc(wordRef);
}

// Add a word to the user's wordBucket collection
export async function addWordToBucket(userId, word) {
  if (typeof userId !== 'string' || !userId.trim()) {
    console.error('Invalid userId provided to addWordToBucket:', userId);
    throw new Error('Invalid userId');
  }

  if (!word || typeof word.id !== 'string' || typeof word.word !== 'string') {
    console.error('Invalid word object provided to addWordToBucket:', word);
    throw new Error('Invalid word object');
  }

  try {
    const bucketCollection = collection(db, `wordBucket_${userId}`);

    // Check if the word already exists in the bucket
    const existingWordsQuery = query(bucketCollection, where('id', '==', word.id));
    const snapshot = await getDocs(existingWordsQuery);

    if (snapshot.empty) {
      await addDoc(bucketCollection, word);
    } else {
      console.log('Word already exists in the bucket:', word.word);
    }
  } catch (error) {
    console.error('Error adding word to bucket:', error);
    throw error;
  }
}

// Remove a word from the user's wordBucket collection
export async function removeWordFromBucket(userId, wordId) {
  if (typeof userId !== 'string' || !userId.trim()) {
    console.error('Invalid userId provided to removeWordFromBucket:', userId);
    throw new Error('Invalid userId');
  }

  try {
    const bucketCollection = collection(db, `wordBucket_${userId}`);
    const wordQuery = query(bucketCollection, where('id', '==', wordId));
    const snapshot = await getDocs(wordQuery);

    if (!snapshot.empty) {
      const wordDoc = snapshot.docs[0];
      await deleteDoc(wordDoc.ref);
    } else {
      console.warn('Word not found in bucket for removal:', wordId);
    }
  } catch (error) {
    console.error('Error removing word from bucket:', error);
    throw error;
  }
}

// Listen to real-time updates for the user's wordBucket collection
export function listenToWordBucket(userId, callback) {
  if (typeof userId !== 'string' || !userId.trim()) {
    console.error('Invalid userId provided to listenToWordBucket:', userId);
    throw new Error('Invalid userId');
  }

  try {
    const bucketCollection = collection(db, `wordBucket_${userId}`);

    // Listen for real-time updates
    return onSnapshot(bucketCollection, (snapshot) => {
      const bucket = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(bucket);
    });
  } catch (error) {
    console.error('Error setting up listener for word bucket:', error);
    throw error;
  }
}

// Add a new category to the database
export async function addCategory({ name }) {
  if (!name || !name.trim()) {
    throw new Error('Category name cannot be empty.');
  }
  
  const categoryName = name.trim();
  
  if (categoryName.length < 2) {
    throw new Error('Category name must be at least 2 characters long.');
  }
  
  return await addDoc(collection(db, 'cvc_category'), {
    name: categoryName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Check if a category exists in the database (case-insensitive)
export async function categoryExists(categoryName) {
  const snapshot = await getDocs(collection(db, 'cvc_category'));
  return snapshot.docs.some(doc => doc.data().name.toLowerCase() === categoryName.trim().toLowerCase());
}

// Get all categories
export async function getAllCategories() {
  const snapshot = await getDocs(collection(db, 'cvc_category'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
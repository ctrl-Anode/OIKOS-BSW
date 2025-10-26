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
  return await addDoc(collection(db, 'cvcWords'), {
    word,
    category,
    difficulty: 'CVC',
    updatedAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
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

// Delete a CVC word and its associated audio files
export async function deleteCvcWord(id, audioPaths) {
  const wordRef = doc(db, 'cvcWords', id);

  // Delete audio files from Firebase Storage
  for (const path of audioPaths) {
    const audioRef = ref(storage, path);
    await deleteObject(audioRef);
  }

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
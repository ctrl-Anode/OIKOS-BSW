import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, getDoc } from 'firebase/firestore';

// Upload single audio and return its URL
export async function uploadCvcAudio(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Add new CVC word
export async function addCvcWord({ word, category, audios }) {
  return await addDoc(collection(db, 'cvcWords'), {
    word,
    category,
    difficulty: 'CVC',
    audios,
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
export async function updateCvcWord(id, updatedData) {
  const wordRef = doc(db, 'cvcWords', id);
  await updateDoc(wordRef, {
    ...updatedData,
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

// Add a word to the user's bucket
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
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bucket = userData.bucket || [];

      // Add the word to the bucket if it's not already there
      if (!bucket.some((item) => item.id === word.id)) {
        bucket.push(word);
        await updateDoc(userRef, { bucket });
      }
    } else {
      // Create the bucket if the user document doesn't exist
      await updateDoc(userRef, { bucket: [word] });
    }
  } catch (error) {
    console.error('Error adding word to bucket:', error);
    throw error;
  }
}

// Remove a word from the user's bucket
export async function removeWordFromBucket(userId, wordId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bucket = userData.bucket || [];

      // Filter out the word with the given wordId
      const updatedBucket = bucket.filter((item) => item.id !== wordId);
      await updateDoc(userRef, { bucket: updatedBucket });
    }
  } catch (error) {
    console.error('Error removing word from bucket:', error);
    throw error;
  }
}
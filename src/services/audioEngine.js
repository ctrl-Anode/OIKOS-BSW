import { openDB } from 'idb';

const CACHE_DB_NAME = 'audioCacheDB';
const CACHE_STORE_NAME = 'audioCache';

export const audioEngine = {
  mode: localStorage.getItem('audioMode') || 'firebase',

  setMode(newMode) {
    this.mode = newMode;
    localStorage.setItem('audioMode', newMode);
  },

  getMode() {
    return this.mode;
  },

  async playWord(word, audioUrl) {
    if (audioUrl) {
      try {
        await this.playFirebaseAudio(audioUrl);
      } catch (error) {
        console.warn('Firebase audio failed:', error);
      }
    } else {
      console.warn('No audio URL provided for the word.');
    }
  },

  async playLetters(word, letterUrls = []) {
    for (let i = 0; i < letterUrls.length; i++) {
      if (letterUrls[i]) {
        try {
          await this.playFirebaseAudio(letterUrls[i]);
        } catch (error) {
          console.warn(`Firebase audio failed for letter ${word[i]}:`, error);
        }
      } else {
        console.warn(`No audio URL provided for letter ${word[i]}.`);
      }
      await new Promise((resolve) => setTimeout(resolve, 600)); // Delay between letters
    }
  },

  async playFirebaseAudio(url) {
    try {
      const cachedUrl = await this.getCachedAudio(url);
      const audio = new Audio(cachedUrl || url);
      await audio.play();
      if (!cachedUrl) {
        await this.cacheAudio(url);
      }
    } catch (error) {
      console.warn('Firebase audio failed:', error);
      throw new Error('Firebase audio not available');
    }
  },

  playTTSAudio(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    speechSynthesis.cancel(); // Stop previous utterances
    speechSynthesis.speak(utter);
  },

  async preloadAudios(urls = []) {
    const validUrls = urls.filter((url) => url); // Filter out invalid URLs

    const cachePromises = validUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        await this.cacheAudio(url, objectUrl);
      } catch (error) {
        console.warn(`Failed to preload audio for URL: ${url}`, error);
      }
    });

    await Promise.all(cachePromises);
  },

  async preloadRandomWordAudios(words) {
    const urls = words.flatMap((word) => [
      word.audioUrl,
      ...(Array.isArray(word.letterAudioUrls) ? word.letterAudioUrls : [])
    ]);
    await this.preloadAudios(urls);
  },

  async cacheAudio(url, objectUrl = null) {
    if (!url) {
      console.warn('Invalid URL provided to cacheAudio:', url);
      return; // Exit early if the URL is invalid
    }

    const db = await this.getCacheDB();
    const cachedUrl = objectUrl || url;
    try {
      // Ensure the `url` is explicitly provided as the key
      await db.put(CACHE_STORE_NAME, cachedUrl, url);
      console.log(`Audio cached successfully for URL: ${url}`);
    } catch (error) {
      console.error(`Failed to cache audio for URL: ${url}`, error);
    }
  },

  async getCachedAudio(url) {
    const db = await this.getCacheDB();
    return await db.get(CACHE_STORE_NAME, url);
  },

  async clearCache() {
    const db = await this.getCacheDB();
    await db.clear(CACHE_STORE_NAME);
  },

  async getCacheDB() {
    return await openDB(CACHE_DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
          db.createObjectStore(CACHE_STORE_NAME);
        }
      }
    });
  }
};
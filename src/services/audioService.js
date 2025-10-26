// Audio Service to handle Firebase Storage audio fetching and Web Speech TTS fallback

import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Fetch audio from Firebase Storage
export async function playStorageAudio(url) {
  try {
    const audio = new Audio(url);
    await audio.play();
  } catch (error) {
    console.error("Error playing storage audio:", error);
  }
}

// Use Web Speech API to play text-to-speech
export function playTTS(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Error with TTS playback:", error);
  }
}

// Get the current audio mode (firebase or tts)
export function getAudioMode() {
  return import.meta.env.VITE_AUDIO_MODE || "firebase";
}
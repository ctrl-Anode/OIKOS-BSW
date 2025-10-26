/**
 * Speak a letter using the Web Speech API.
 * @param {string} letter - The letter to speak.
 */
export function getPhonicsAudio(letter) {
  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.rate = 1; // Normal speed
  speechSynthesis.speak(utterance);
}

/**
 * Speak a word using the Web Speech API.
 * @param {string} word - The word to speak.
 */
export function getWordAudio(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 1; // Normal speed
  speechSynthesis.speak(utterance);
}

/**
 * Speak a word slowly using the Web Speech API.
 * @param {string} word - The word to speak slowly.
 */
export function getSlowPronunciation(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.5; // Slow speed
  speechSynthesis.speak(utterance);
}
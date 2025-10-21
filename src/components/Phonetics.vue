<template>
  <div class="flex flex-wrap justify-center gap-2 mt-4">
    <button
      v-for="(ph, idx) in phonetics"
      :key="idx"
      class="phonetic-btn"
      @click="speakPhonetic(ph)"
    >{{ ph }}</button>
  </div>
</template>

<script setup>
// ✅ FIX: Remove the import! Just use defineProps directly.
const props = defineProps({
  phonetics: {
    type: Array,
    required: true
  }
})

// Map phonetic chunks to their IPA or sound representation
const phoneticSounds = {
  // Single letters
  'a': 'ah',      // as in "cat"
  'b': 'buh',
  'c': 'kuh',
  'd': 'duh',
  'e': 'eh',
  'f': 'fuh',
  'g': 'gu',
  'h': 'huh',
  'i': 'ih',
  'j': 'juh',
  'k': 'kuh',
  'l': 'luh',
  'm': 'muh',
  'n': 'nuh',
  'o': 'aw',
  'p': 'puh',
  'q': 'kwuh',
  'r': 'ruh',
  's': 'suh',
  't': 'tuh',
  'u': 'uh',
  'v': 'vuh',
  'w': 'wuh',
  'x': 'ks',
  'y': 'yuh',
  'z': 'zi',

  // Common digraphs and blends
  'ch': 'ch',
  'sh': 'sh',
  'th': 'tah',
  'wh': 'wh',
  'ph': 'f',
  'ng': 'ng',
  'ee': 'e',
  'ea': 'ee',
  'ai': 'ay',
  'ay': 'ay',
  'oa': 'oh',
  'ow': 'ow',
  'ou': 'ow',
  'oi': 'oy',
  'oy': 'oy',
  'ar': 'ar',
  'er': 'er',
  'ir': 'er',
  'or': 'or',
  'ur': 'er',

  // Example whole words (add more as needed)
  'cat': 'kuh æ tuh',
  'dog': 'duh aw guh',
  'the': 'th eh',
  'see': 'sss ee',
  'run': 'ruh uh nuh'
}

function speakPhonetic(ph) {
  const sound = phoneticSounds[ph] || ph
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utter = new window.SpeechSynthesisUtterance(sound)
    utter.rate = 0.7
    window.speechSynthesis.speak(utter)
  }
}
</script>

<style scoped>
.phonetic-btn {
  background: #e0e7ff;
  color: #4f46e5;
  font-weight: bold;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.phonetic-btn:hover {
  background: #c7d2fe;
}
</style>
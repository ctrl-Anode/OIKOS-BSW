<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Learn CVC Words</h3>
    <!-- Teaching Screen -->
    <div class="flex flex-col items-center mb-8">
      <div class="mb-2 font-semibold">Teaching Screen</div>
      <div
        class="bg-white rounded-xl shadow p-8 flex flex-col items-center"
        @touchstart="startTouch($event)"
        @touchend="endTouch($event, selectedWord?.word)"
      >
        <div class="text-3xl font-bold mb-4">
          {{ selectedWord?.word || 'Draw a word!' }}
        </div>
        <div class="flex gap-4 mb-4">
          <button
            v-for="(letter, idx) in selectedWord?.word?.split('') || []"
            :key="idx"
            class="bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl shadow"
            @click="playPhonetic(letter)"
          >
            {{ letter }}
          </button>
        </div>
        <button
          v-if="selectedWord"
          class="bg-green-500 text-white px-6 py-2 rounded font-bold shadow"
          @click="speakWord(selectedWord.word)"
        >
          Play Word
        </button>
      </div>
    </div>

    <!-- Draw CVC Word Button -->
    <div class="flex justify-center mb-6">
      <button
        class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded shadow"
        @click="drawWord"
        :disabled="filteredWords.length === 0"
      >
        🪄 Draw CVC Word
      </button>
    </div>

    <!-- Word Bucket -->
    <div class="bg-gray-50 rounded-xl shadow p-6">
      <h4 class="font-bold text-lg mb-4">Word Bucket</h4>
      <div class="flex gap-2 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search words..."
          class="border px-3 py-2 rounded w-full"
        />
        <select v-model="selectedCategory" class="border px-3 py-2 rounded">
          <option value="">All Categories</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.name"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div
        v-for="word in filteredWords"
        :key="word.id"
        class="flex items-center justify-between bg-white rounded-lg shadow mb-3 px-4 py-3"
      >
        <span class="font-bold text-lg">{{ word.word }}</span>
        <button
          class="bg-green-400 text-white px-4 py-1 rounded font-bold"
          @click="selectWord(word)"
        >
          Select
        </button>
        <button
          class="bg-red-500 text-white px-4 py-1 rounded font-bold"
          @click="removeWord(word.id)"
        >
          Remove
        </button>
      </div>
      <div
        v-if="filteredWords.length === 0"
        class="text-gray-500 text-center py-4"
      >
        No words found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const cvcWords = ref([]);
const categories = ref([]);
const selectedWord = ref(null);
const search = ref("");
const selectedCategory = ref("");

// Swipe detection for teaching screen
let touchStartX = 0;
function startTouch(e) {
  touchStartX = e.changedTouches[0].screenX;
}
function endTouch(e, word) {
  const touchEndX = e.changedTouches[0].screenX;
  if (Math.abs(touchEndX - touchStartX) > 50 && word) {
    speakWord(word);
  }
}

// Fetch words and categories
onMounted(async () => {
  const wordSnap = await getDocs(collection(db, "cvcWords"));
  cvcWords.value = wordSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const catSnap = await getDocs(collection(db, "cvc_category"));
  categories.value = catSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});

// Draw random word
function drawWord() {
  if (filteredWords.value.length === 0) return;
  const idx = Math.floor(Math.random() * filteredWords.value.length);
  selectedWord.value = filteredWords.value[idx];
}

// Select word from bucket
function selectWord(word) {
  selectedWord.value = word;
}

// Remove word
async function removeWord(id) {
  await deleteDoc(doc(db, "cvcWords", id));
  cvcWords.value = cvcWords.value.filter((w) => w.id !== id);
  if (selectedWord.value?.id === id) selectedWord.value = null;
}

// Filtered words
const filteredWords = computed(() => {
  let words = cvcWords.value;
  if (search.value) {
    words = words.filter((w) =>
      w.word.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (selectedCategory.value) {
    words = words.filter((w) => w.category === selectedCategory.value);
  }
  return words;
});

// Play phonetic audio for letter
function playPhonetic(letter) {
  if (!letter) return;
  const audio = new Audio(
    new URL(
      `../../assets/phonetics/${letter.toLowerCase()}.mp3`,
      import.meta.url
    ).href
  );
  audio.play();
}

// Speak word aloud
function speakWord(word) {
  if (!word) return;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.rate = 0.7;
    window.speechSynthesis.speak(utter);
  }
}
</script>

<style scoped>
.learn-cvc-view {
  padding: 20px;
}
.cvc-word-card {
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cvc-word-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.letter-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
  font-weight: bold;
  padding: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.letter-btn:hover {
  background-color: #c7d2fe;
}
.play-btn {
  background-color: #34d399;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.play-btn:hover {
  background-color: #059669;
}
.toggle-case-btn {
  background-color: #60a5fa;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.toggle-case-btn:hover {
  background-color: #2563eb;
}
.random-word-btn {
  background-color: #fbbf24;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}
.random-word-btn:hover {
  background-color: #f59e0b;
  transform: scale(1.05);
}
.word-bucket-sidebar {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.bucket-item {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.delete-btn {
  background-color: #ef4444;
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.delete-btn:hover {
  background-color: #dc2626;
}
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.bounce-in {
  animation: bounceIn 0.5s ease-out;
}
@keyframes bounceIn {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
.hover-scale:hover {
  transform: scale(1.1);
}
.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.teaching-screen {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}
.current-word-display {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: inline-block;
}
.filter-controls {
  display: flex;
  gap: 10px;
}
.search-input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 100%;
}
.category-select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination-btn {
  background-color: #60a5fa;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.pagination-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}
.pagination-btn:hover:not(:disabled) {
  background-color: #2563eb;
}
</style>

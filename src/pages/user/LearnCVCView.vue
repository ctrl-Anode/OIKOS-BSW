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

    <!-- Draw CVC Word + Filters + Bucket Toggle -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div class="flex items-center gap-3">
        <button
          class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded shadow"
          @click="drawWord"
          :disabled="filteredWords.length === 0"
        >
          🪄 Draw CVC Word
        </button>
        <button
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-3 rounded shadow"
          @click="showBucket = !showBucket"
        >
          {{ showBucket ? 'Hide' : 'Show' }} Word Bucket
        </button>
      </div>
      <div class="flex gap-2">
        <div class="flex items-center gap-2">
          <select
            v-model="selectedCategoriesPool"
            multiple
            class="border px-3 py-2 rounded min-w-52 max-w-64"
            :size="Math.min(6, categories.length + 1)"
            title="Hold Ctrl/Cmd to select multiple"
          >
            <option value="ALL">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
          <button
            class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-3 py-2 rounded"
            @click="showPool = !showPool"
          >
            {{ showPool ? 'Hide' : 'Show' }} Word Pool
            <span class="ml-2 inline-flex items-center justify-center text-xs font-bold bg-slate-700 text-white rounded-full px-2 min-w-[1.5rem]">
              {{ poolCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toggleable Word Bucket Sidebar -->
    <div v-if="showBucket" class="fixed inset-0 z-40">
      <!-- Dark overlay (tap to close) -->
      <transition name="fade">
        <div class="absolute inset-0 bg-black/30" @click="showBucket = false"></div>
      </transition>
      <!-- Sidebar (left side) -->
      <transition name="slide-left">
        <aside class="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl p-4 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-lg">My Word Bucket</h4>
          <button class="text-gray-600 hover:text-black" @click="showBucket = false">✖</button>
        </div>
        <!-- Bucket-specific filters -->
        <div class="flex gap-2 mb-3">
          <input
            v-model="searchBucket"
            type="text"
            placeholder="Search my bucket..."
            class="border px-3 py-2 rounded w-full"
          />
          <select v-model="selectedCategoryBucket" class="border px-3 py-2 rounded">
            <option value="">All</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="word in filteredBucketWords"
            :key="word.id"
            class="flex items-center justify-between bg-white rounded-lg border mb-3 px-4 py-3"
          >
            <span class="font-bold text-lg">{{ word.word }}</span>
            <button class="bg-green-500 text-white px-3 py-1 rounded font-bold" @click="selectWord(word)">Select</button>
          </div>
          <div v-if="filteredBucketWords.length === 0" class="text-gray-500 text-center py-4">
            No words in your bucket yet.
          </div>
        </div>
        </aside>
      </transition>
    </div>
  </div>

  <!-- Toggleable Word Pool Sidebar (Right) -->
  <div v-if="showPool" class="fixed inset-0 z-40">
    <!-- Dark overlay (tap to close) -->
    <transition name="fade">
      <div class="absolute inset-0 bg-black/30" @click="showPool = false"></div>
    </transition>
    <!-- Sidebar (right side) -->
    <transition name="slide-right">
      <aside class="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl p-4 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-lg">Word Pool</h4>
          <button class="text-gray-600 hover:text-black" @click="showPool = false">✖</button>
        </div>
        <div class="text-xs text-gray-500 mb-2">Showing words from selected categories.</div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="word in filteredWords"
            :key="word.id"
            class="flex items-center justify-between bg-white rounded-lg border mb-3 px-4 py-3"
          >
            <span class="font-bold text-lg">{{ word.word }}</span>
            <button class="bg-blue-500 text-white px-3 py-1 rounded font-bold" @click="selectWord(word)">Select</button>
          </div>
          <div v-if="filteredWords.length === 0" class="text-gray-500 text-center py-4">
            No words found for current selection.
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { addWordToBucket, listenToWordBucket } from "../../services/firebaseCVC";
import { useToast } from "vue-toastification";

const cvcWords = ref([]); // All available words to draw from
const categories = ref([]);
const selectedWord = ref(null);
// Independent filters
const selectedCategoriesPool = ref(["ALL"]); // default All
const searchBucket = ref("");
const selectedCategoryBucket = ref("");
const showBucket = ref(false);
const showPool = ref(false);
const userId = ref(null);
const bucketWords = ref([]); // User's personal bucket (live)
let unsubscribeAuth = null;
let unsubscribeBucket = null;
const toast = useToast();

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
  // Load all words and categories for drawing/filters
  const wordSnap = await getDocs(collection(db, "cvcWords"));
  cvcWords.value = wordSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const catSnap = await getDocs(collection(db, "cvc_category"));
  categories.value = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Restore sidebar toggle persisted state
  try {
    const saved = localStorage.getItem("learnCvc_showBucket");
    showBucket.value = saved === "1";
  } catch (_) {}
  try {
    const savedPool = localStorage.getItem("learnCvc_showPool");
    showPool.value = savedPool === "1";
  } catch (_) {}

  // Restore draw pool filters
  try {
    const savedCats = localStorage.getItem("learnCvc_selectedCategoriesPool");
    if (savedCats) {
      const arr = JSON.parse(savedCats);
      if (Array.isArray(arr) && arr.length > 0) {
        selectedCategoriesPool.value = arr;
      }
    }
  } catch (_) {}

  // Auth and per-user bucket listener
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    // Clean up old bucket listener
    if (unsubscribeBucket) {
      unsubscribeBucket();
      unsubscribeBucket = null;
    }
    if (user) {
      userId.value = user.uid;
      unsubscribeBucket = listenToWordBucket(user.uid, (bucket) => {
        bucketWords.value = bucket;
      });
    } else {
      userId.value = null;
      bucketWords.value = [];
    }
  });
});

onUnmounted(() => {
  if (unsubscribeBucket) unsubscribeBucket();
  if (unsubscribeAuth) unsubscribeAuth();
});

// Persist toggle state across route changes
watch(showBucket, (val) => {
  try {
    localStorage.setItem("learnCvc_showBucket", val ? "1" : "0");
  } catch (_) {}
});
watch(showPool, (val) => {
  try {
    localStorage.setItem("learnCvc_showPool", val ? "1" : "0");
  } catch (_) {}
});
// Persist pool filters
watch(selectedCategoriesPool, (arr) => {
  try {
    // Enforce exclusive 'ALL' selection: if 'ALL' with others, reduce to only 'ALL';
    const a = Array.isArray(arr) ? [...arr] : [];
    if (a.includes("ALL") && a.length > 1) {
      selectedCategoriesPool.value = ["ALL"]; // normalize selection
      return; // watcher will run again and persist normalized state
    }
    localStorage.setItem("learnCvc_selectedCategoriesPool", JSON.stringify(a));
  } catch (_) {}
});

// Draw random word
async function drawWord() {
  if (filteredWords.value.length === 0) return;
  const idx = Math.floor(Math.random() * filteredWords.value.length);
  const drawn = filteredWords.value[idx];
  selectedWord.value = drawn;
  // Add to user's personal bucket (no duplicates)
  if (userId.value && drawn) {
    const exists = bucketWords.value.some((w) => w.id === drawn.id);
    if (exists) {
      toast.info("Already in your bucket");
    } else {
      try {
        await addWordToBucket(userId.value, drawn);
        toast.success("Added to your bucket");
      } catch (e) {
        console.error("addWordToBucket error:", e);
        toast.error("Couldn't add to bucket");
      }
    }
  } else if (!userId.value) {
    // Inform user that saving requires login
    toast.info("Log in to save words to your bucket");
  }
}

// Select word from bucket
function selectWord(word) {
  selectedWord.value = word;
  showBucket.value = false; // Automatically close the Word Bucket sidebar when a word is selected
  showPool.value = false; // Automatically close the Word Pool sidebar when a word is selected
}

// Removing words from the bucket is disabled in user view

// Filtered pool for drawing (from all words)
const filteredWords = computed(() => {
  let words = cvcWords.value;
  // Category filter: 'ALL' means no restriction, empty array also treated as all
  const cats = selectedCategoriesPool.value || [];
  const treatAll = cats.length === 0 || cats.includes("ALL");
  if (!treatAll) {
    words = words.filter((w) => cats.includes(w.category));
  }
  return words;
});

// Pool size badge
const poolCount = computed(() => filteredWords.value.length);

// Filtered user's bucket for sidebar listing
const filteredBucketWords = computed(() => {
  let words = bucketWords.value;
  if (searchBucket.value) {
    words = words.filter((w) => w.word.toLowerCase().includes(searchBucket.value.toLowerCase()));
  }
  if (selectedCategoryBucket.value) {
    words = words.filter((w) => w.category === selectedCategoryBucket.value);
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

/* Sidebar transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200 overflow-hidden"
  >
    <Topbar class="flex-shrink-0 fixed top-0 left-0 w-full z-20" />

    <!-- Music Control Button (Always Visible) -->
    <button
      @click.stop="showMusicControls = !showMusicControls"
      class="fixed bottom-4 right-4 z-30 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
      :class="{ 'animate-pulse': isMusicPlaying }"
    >
      <span class="text-2xl">{{ isMusicPlaying ? '🎵' : '🎶' }}</span>
    </button>

    <!-- Background Music Player Overlay (Toggleable) -->
    <div v-if="showMusicControls" class="fixed inset-0 z-29" @click="showMusicControls = false">
      <!-- Transparent overlay to catch clicks -->
    </div>

    <!-- Background Music Player (Toggleable) -->
    <transition name="slide-up">
      <div v-if="showMusicControls" class="fixed bottom-20 right-4 z-30 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border-2 border-purple-300" @click.stop>
        <div class="flex flex-col gap-3 min-w-[200px]">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-bold text-purple-700 flex items-center gap-1">
              <span class="text-lg">🎵</span>
              <span>Music Controls</span>
            </span>
            <button
              @click="showMusicControls = false"
              class="text-gray-500 hover:text-gray-800 transition-colors duration-200 text-xl font-bold"
            >
              ✖
            </button>
          </div>
          <button
            @click="toggleMusic"
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <span class="text-lg">{{ isMusicPlaying ? '⏸️' : '▶️' }}</span>
            <span class="text-sm">{{ isMusicPlaying ? 'Pause' : 'Play' }}</span>
          </button>
          
          <!-- Background Music Volume -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Background Music</label>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-600">🔉</span>
              <input
                type="range"
                min="0"
                max="100"
                v-model="musicVolume"
                @input="updateVolume"
                class="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span class="text-xs font-semibold text-purple-700 min-w-[35px]">{{ musicVolume }}%</span>
            </div>
          </div>
          
          <!-- Celebration Volume -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Celebration Sound</label>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-600">🎉</span>
              <input
                type="range"
                min="0"
                max="100"
                v-model="celebrationVolume"
                @input="updateCelebrationVolume"
                class="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider-celebration"
              />
              <span class="text-xs font-semibold text-pink-700 min-w-[35px]">{{ celebrationVolume }}%</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main
      class="flex-1 overflow-y-auto mt-[72px] sm:mt-[80px] flex flex-col items-center px-4 py-6 sm:py-12"
    >
      <div
        class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-8xl"
      >
        <!-- Header -->
        <div class="text-center mb-8">
          <h2
            class="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2"
          >
            TinyTalkers
          </h2>
          <p class="text-gray-600 text-sm sm:text-base">Master CVC words through interactive learning</p>
          
          <!-- Chosen Categories Display -->
          <div class="mt-4 flex items-center justify-center gap-2 flex-wrap">
            <span class="text-sm font-semibold text-purple-700">Active Filters:</span>
            <div class="flex items-center gap-2 flex-wrap justify-center">
              <span 
                v-for="cat in displayedCategories" 
                :key="cat"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-300 shadow-sm"
              >
                {{ cat }}
              </span>
              <span 
                v-if="displayedCategories.length === 0"
                class="text-sm text-gray-500 italic"
              >
                No categories selected
              </span>
            </div>
          </div>
        </div>

        <!-- Combined LearnCVCView content starts -->
        <div>
          <!-- Teaching Screen -->
          <div class="mb-8">
            <h3 class="text-lg sm:text-xl font-bold text-purple-700 mb-4 flex items-center justify-center gap-2">
              <span class="text-2xl">📚</span>
              <span>Teaching Screen</span>
            </h3>
            <div
              class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200 p-6 sm:p-10 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              @touchstart="startTouch($event)"
              @touchend="endTouch($event, selectedWord?.word)"
            >
              <div class="text-4xl sm:text-6xl font-black mb-6 text-purple-800 tracking-wide min-h-[60px] flex items-center justify-center">
                {{ selectedWord?.word?.toUpperCase() || '✨ Draw a word! ✨' }}
              </div>
              <div class="flex flex-wrap gap-3 mb-6 justify-center">
                <button
                  v-for="(letter, idx) in selectedWord?.word?.split('') || []"
                  :key="idx"
                  class="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95 uppercase"
                  @click="playPhonetic(letter)"
                >
                  {{ letter }}
                </button>
              </div>
              <button
                v-if="selectedWord"
                class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2"
                @click="speakWord(selectedWord.word)"
              >
                <span class="text-xl">🔊</span>
                <span>Play Word</span>
              </button>
              <div v-else class="text-gray-500 text-sm">Swipe or tap to hear the word!</div>
            </div>
          </div>

          <!-- Draw CVC Word + Filters + Bucket Toggle -->
          <div class="flex flex-col gap-3 mb-8">
            <!-- Desktop: Single row with all buttons -->
            <div class="hidden lg:flex lg:flex-row lg:items-center lg:justify-center gap-3 flex-wrap">
              <button
                class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                @click="showCategoryFilter = !showCategoryFilter"
              >
                <span class="text-lg">🏷️</span>
                <span>{{ showCategoryFilter ? 'Hide' : 'Show' }} Categories</span>
              </button>
              <button
                class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 min-w-[200px]"
                @click="drawWord"
                :disabled="filteredWords.length === 0 || drawCooldown > 0"
              >
                <span class="text-xl">{{ drawCooldown > 0 ? '⏱️' : '🪄' }}</span>
                <span>{{ drawCooldown > 0 ? `Wait ${drawCooldown}s` : 'Draw CVC Word' }}</span>
              </button>
              <button
                class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                @click="showBucket = !showBucket"
              >
                <span class="text-xl">🪣</span>
                <span>{{ showBucket ? 'Hide' : 'Show' }} My Bucket</span>
              </button>
              <button
                class="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 relative"
                @click="showPool = !showPool"
              >
                <span class="text-lg">📋</span>
                <span>{{ showPool ? 'Hide' : 'Show' }} Pool</span>
                <span class="inline-flex items-center justify-center text-xs font-bold bg-white text-slate-700 rounded-full px-2.5 py-0.5 min-w-[2rem]">
                  {{ poolCount }}
                </span>
              </button>
            </div>

            <!-- Mobile: Stacked layout -->
            <div class="flex flex-col gap-3 lg:hidden">
              <button
                class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                @click="drawWord"
                :disabled="filteredWords.length === 0 || drawCooldown > 0"
              >
                <span class="text-xl">{{ drawCooldown > 0 ? '⏱️' : '🪄' }}</span>
                <span>{{ drawCooldown > 0 ? `Wait ${drawCooldown}s` : 'Draw CVC Word' }}</span>
              </button>
              <button
                class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                @click="showBucket = !showBucket"
              >
                <span class="text-xl">🪣</span>
                <span>{{ showBucket ? 'Hide' : 'Show' }} My Bucket</span>
              </button>
              <button
                class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                @click="showCategoryFilter = !showCategoryFilter"
              >
                <span class="text-lg">🏷️</span>
                <span>{{ showCategoryFilter ? 'Hide' : 'Show' }} Categories</span>
              </button>
              <button
                class="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 relative"
                @click="showPool = !showPool"
              >
                <span class="text-lg">📋</span>
                <span>{{ showPool ? 'Hide' : 'Show' }} Pool</span>
                <span class="inline-flex items-center justify-center text-xs font-bold bg-white text-slate-700 rounded-full px-2.5 py-0.5 min-w-[2rem]">
                  {{ poolCount }}
                </span>
              </button>
            </div>
          </div>

          <!-- Toggleable Category Filter Sidebar -->
          <div v-if="showCategoryFilter" class="fixed inset-0 z-40">
            <!-- Dark overlay (tap to close) -->
            <transition name="fade">
              <div class="absolute inset-0 bg-black/30" @click="showCategoryFilter = false"></div>
            </transition>
            <!-- Sidebar (right side) -->
            <transition name="slide-right">
              <aside class="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl p-4 flex flex-col overflow-hidden">
                <div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-200">
                  <h4 class="font-bold text-lg text-purple-700 flex items-center gap-2">
                    <span class="text-xl">🏷️</span>
                    <span>Category Filter</span>
                  </h4>
                  <button class="text-gray-500 hover:text-gray-800 transition-colors duration-200 text-xl font-bold" @click="showCategoryFilter = false">✖</button>
                </div>
                <div class="text-xs text-gray-500 mb-3 bg-purple-50 p-2 rounded-lg border border-purple-200">
                  Select categories to filter the word pool
                </div>
                <div class="mb-3">
                  <input
                    v-model="searchCategory"
                    type="text"
                    placeholder="🔍 Search categories..."
                    class="border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-3 py-2 rounded-lg w-full transition-all duration-200"
                  />
                </div>
                <div class="flex-1 overflow-y-auto">
                  <div class="space-y-2">
                    <label 
                      v-if="!searchCategory"
                      class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer"
                      :class="selectedCategoriesPool.includes('ALL') ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200 hover:border-purple-300'"
                    >
                      <input 
                        type="checkbox" 
                        value="ALL" 
                        v-model="selectedCategoriesPool"
                        class="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-400"
                      />
                      <span class="font-semibold text-gray-700">All Categories</span>
                    </label>
                    <label 
                      v-for="cat in filteredCategories" 
                      :key="cat.id"
                      class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer"
                      :class="selectedCategoriesPool.includes(cat.name) ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200 hover:border-purple-300'"
                    >
                      <input 
                        type="checkbox" 
                        :value="cat.name" 
                        v-model="selectedCategoriesPool"
                        class="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-400"
                      />
                      <span class="font-medium text-gray-700">{{ cat.name }}</span>
                    </label>
                    <div v-if="filteredCategories.length === 0" class="text-gray-500 text-center py-8 text-sm">
                      <div class="text-4xl mb-2">🔍</div>
                      <div>No categories found</div>
                      <div class="text-xs mt-1">Try a different search</div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t-2 border-gray-200">
                  <div class="text-sm text-gray-600 text-center">
                    <span class="font-semibold">{{ poolCount }}</span> word{{ poolCount !== 1 ? 's' : '' }} available
                  </div>
                </div>
              </aside>
            </transition>
          </div>

          <!-- Toggleable Word Bucket Sidebar -->
          <div v-if="showBucket" class="fixed inset-0 z-40">
            <!-- Dark overlay (tap to close) -->
            <transition name="fade">
              <div class="absolute inset-0 bg-black/30" @click="showBucket = false"></div>
            </transition>
            <!-- Sidebar (left side) -->
            <transition name="slide-left">
              <aside class="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl p-4 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-200">
                <h4 class="font-bold text-lg text-purple-700 flex items-center gap-2">
                  <span class="text-xl">🪣</span>
                  <span>My Word Bucket</span>
                </h4>
                <button class="text-gray-500 hover:text-gray-800 transition-colors duration-200 text-xl font-bold" @click="showBucket = false">✖</button>
              </div>
              <!-- Bucket-specific filters -->
              <div class="flex flex-col gap-2 mb-3">
                <input
                  v-model="searchBucket"
                  type="text"
                  placeholder="🔍 Search my bucket..."
                  class="border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-3 py-2 rounded-lg w-full transition-all duration-200"
                />
                <select v-model="selectedCategoryBucket" class="border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-3 py-2 rounded-lg transition-all duration-200">
                  <option value="">All Categories</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
              <div class="flex-1 overflow-y-auto space-y-2">
                <div
                  v-for="word in filteredBucketWords"
                  :key="word.id"
                  class="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 px-4 py-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <span class="font-bold text-lg text-purple-700">{{ word.word }}</span>
                  <button class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95" @click="selectWord(word)">Select</button>
                </div>
                <div v-if="filteredBucketWords.length === 0" class="text-gray-500 text-center py-8 text-sm">
                  <div class="text-4xl mb-2">📭</div>
                  <div>No words in your bucket yet.</div>
                  <div class="text-xs mt-1">Draw words to add them!</div>
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
            <aside class="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl p-4 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200">
                <h4 class="font-bold text-lg text-slate-700 flex items-center gap-2">
                  <span class="text-xl">📋</span>
                  <span>Word Pool</span>
                </h4>
                <button class="text-gray-500 hover:text-gray-800 transition-colors duration-200 text-xl font-bold" @click="showPool = false">✖</button>
              </div>
              <div class="text-xs text-gray-500 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                Showing {{ filteredWords.length }} word{{ filteredWords.length !== 1 ? 's' : '' }} from selected categories
              </div>
              <!-- Pool search -->
              <div class="mb-3">
                <input
                  v-model="searchPool"
                  type="text"
                  placeholder="🔍 Search pool..."
                  class="border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 px-3 py-2 rounded-lg w-full transition-all duration-200"
                />
              </div>
              <div class="flex-1 overflow-y-auto space-y-2">
                <div
                  v-for="word in filteredWords"
                  :key="word.id"
                  class="flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border-2 border-slate-200 px-4 py-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div class="flex flex-col">
                    <span class="font-bold text-lg text-slate-700">{{ word.word }}</span>
                    <span class="text-xs text-gray-500">{{ word.category }}</span>
                  </div>
                  <button class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95" @click="selectWord(word)">Select</button>
                </div>
                <div v-if="filteredWords.length === 0" class="text-gray-500 text-center py-8 text-sm">
                  <div class="text-4xl mb-2">🔍</div>
                  <div>No words found</div>
                  <div class="text-xs mt-1">Try adjusting your filters</div>
                </div>
              </div>
            </aside>
          </transition>
        </div>
        <!-- Combined LearnCVCView content ends -->
      </div>
    </main>
  </div>
</template>

<script setup>
import Topbar from "../../components/Topbar.vue";
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
const searchPool = ref(""); // search for words in pool
const searchCategory = ref(""); // search for categories in filter
const selectedCategoryBucket = ref("");
const showBucket = ref(false);
const showPool = ref(false);
const showCategoryFilter = ref(false);
const userId = ref(null);
const bucketWords = ref([]); // User's personal bucket (live)
let unsubscribeAuth = null;
let unsubscribeBucket = null;
const toast = useToast();

// Draw cooldown
const drawCooldown = ref(0);
let cooldownTimer = null;

// Background Music
const bgMusicRef = ref(null);
const isMusicPlaying = ref(true);
const musicVolume = ref(5);
const celebrationVolume = ref(20);
const showMusicControls = ref(false);

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

// Background Music Functions
function initBackgroundMusic() {
  try {
    bgMusicRef.value = new Audio('/kids-bg-music.mp3');
    bgMusicRef.value.loop = true;
    bgMusicRef.value.volume = musicVolume.value / 100;
    
    // Restore music state from localStorage
    const savedVolume = localStorage.getItem('bgMusicVolume');
    if (savedVolume) {
      musicVolume.value = parseInt(savedVolume);
      bgMusicRef.value.volume = musicVolume.value / 100;
    }
    
    const savedCelebrationVolume = localStorage.getItem('celebrationVolume');
    if (savedCelebrationVolume) {
      celebrationVolume.value = parseInt(savedCelebrationVolume);
    }
    
    const savedPlaying = localStorage.getItem('bgMusicPlaying');
    if (savedPlaying === 'true') {
      // Auto-play only if user had it playing before
      bgMusicRef.value.play().catch(err => {
        console.log('Auto-play prevented:', err);
        isMusicPlaying.value = false;
      });
      isMusicPlaying.value = true;
    }
  } catch (error) {
    console.error('Error initializing background music:', error);
    toast.warning('Background music file not found');
  }
}

function toggleMusic() {
  if (!bgMusicRef.value) return;
  
  if (isMusicPlaying.value) {
    bgMusicRef.value.pause();
    isMusicPlaying.value = false;
  } else {
    bgMusicRef.value.play().catch(err => {
      console.error('Error playing music:', err);
      toast.error('Could not play music');
    });
    isMusicPlaying.value = true;
  }
  
  localStorage.setItem('bgMusicPlaying', isMusicPlaying.value.toString());
}

function updateVolume() {
  if (bgMusicRef.value) {
    bgMusicRef.value.volume = musicVolume.value / 100;
    localStorage.setItem('bgMusicVolume', musicVolume.value.toString());
  }
}

function updateCelebrationVolume() {
  localStorage.setItem('celebrationVolume', celebrationVolume.value.toString());
}

// Fetch words and categories
onMounted(async () => {
  // Initialize background music
  initBackgroundMusic();
  
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
  try {
    const savedCategoryFilter = localStorage.getItem("learnCvc_showCategoryFilter");
    showCategoryFilter.value = savedCategoryFilter === "1";
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
  
  // Clean up background music
  if (bgMusicRef.value) {
    bgMusicRef.value.pause();
    bgMusicRef.value = null;
  }
  
  // Clean up cooldown timer
  if (cooldownTimer) {
    clearInterval(cooldownTimer);
    cooldownTimer = null;
  }
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
watch(showCategoryFilter, (val) => {
  try {
    localStorage.setItem("learnCvc_showCategoryFilter", val ? "1" : "0");
  } catch (_) {}
});
// Persist pool filters
watch(selectedCategoriesPool, (arr, oldArr) => {
  try {
    const a = Array.isArray(arr) ? [...arr] : [];
    const old = Array.isArray(oldArr) ? [...oldArr] : [];
    
    // Smart "ALL" handling:
    // If "ALL" was just added and there are other selections, remove other selections
    // If another category was just added and "ALL" is present, remove "ALL"
    if (a.includes("ALL") && a.length > 1) {
      const allWasJustAdded = !old.includes("ALL");
      if (allWasJustAdded) {
        // User just selected "ALL", clear other selections
        selectedCategoriesPool.value = ["ALL"];
        return;
      } else {
        // User selected a specific category while "ALL" was already selected, remove "ALL"
        selectedCategoriesPool.value = a.filter(cat => cat !== "ALL");
        return;
      }
    }
    
    // If nothing selected, default back to "ALL"
    if (a.length === 0) {
      selectedCategoriesPool.value = ["ALL"];
      return;
    }
    
    localStorage.setItem("learnCvc_selectedCategoriesPool", JSON.stringify(a));
  } catch (_) {}
});

// Play celebration sound
function playCelebration() {
  // Pause background music if playing
  const wasMusicPlaying = isMusicPlaying.value;
  if (wasMusicPlaying && bgMusicRef.value) {
    bgMusicRef.value.pause();
  }
  
  try {
    const celebrationAudio = new Audio('/celebration.mp3');
    celebrationAudio.volume = celebrationVolume.value / 100; // Use user-defined volume
    
    // Resume background music after celebration finishes
    celebrationAudio.addEventListener('ended', () => {
      if (wasMusicPlaying && bgMusicRef.value) {
        setTimeout(() => {
          bgMusicRef.value.play().catch(err => {
            console.log('Could not resume music:', err);
          });
        }, 200);
      }
    });
    
    // Also handle error case
    celebrationAudio.addEventListener('error', () => {
      console.log('Celebration audio not found');
      // Resume music even if celebration fails
      if (wasMusicPlaying && bgMusicRef.value) {
        setTimeout(() => {
          bgMusicRef.value.play().catch(err => {
            console.log('Could not resume music:', err);
          });
        }, 200);
      }
    });
    
    celebrationAudio.play().catch(err => {
      console.log('Could not play celebration:', err);
      // Resume music if celebration fails to play
      if (wasMusicPlaying && bgMusicRef.value) {
        bgMusicRef.value.play().catch(err => {
          console.log('Could not resume music:', err);
        });
      }
    });
  } catch (error) {
    console.error('Error with celebration audio:', error);
    // Resume music on error
    if (wasMusicPlaying && bgMusicRef.value) {
      bgMusicRef.value.play().catch(err => {
        console.log('Could not resume music:', err);
      });
    }
  }
}

// Draw random word
async function drawWord() {
  if (filteredWords.value.length === 0) return;
  if (drawCooldown.value > 0) return; // Prevent drawing during cooldown
  
  const idx = Math.floor(Math.random() * filteredWords.value.length);
  const drawn = filteredWords.value[idx];
  selectedWord.value = drawn;
  
  // Start 5-second cooldown
  drawCooldown.value = 10;
  cooldownTimer = setInterval(() => {
    drawCooldown.value--;
    if (drawCooldown.value <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
  
  // Add to user's personal bucket (no duplicates)
  if (userId.value && drawn) {
    const exists = bucketWords.value.some((w) => w.id === drawn.id);
    if (exists) {
      toast.info("Already in your bucket");
    } else {
      try {
        await addWordToBucket(userId.value, drawn);
        playCelebration(); // Play celebration sound
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
  // Auto-close sidebars when word is selected
  showBucket.value = false;
  showPool.value = false;
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
  // Search filter
  if (searchPool.value) {
    words = words.filter((w) => w.word.toLowerCase().includes(searchPool.value.toLowerCase()));
  }
  return words;
});

// Pool size badge
const poolCount = computed(() => filteredWords.value.length);

// Display chosen categories
const displayedCategories = computed(() => {
  const cats = selectedCategoriesPool.value || [];
  if (cats.length === 0 || cats.includes("ALL")) {
    return ["All Categories"];
  }
  return cats;
});

// Filtered categories for category filter sidebar
const filteredCategories = computed(() => {
  if (!searchCategory.value) return categories.value;
  const search = searchCategory.value.toLowerCase();
  return categories.value.filter((cat) => 
    cat.name.toLowerCase().includes(search)
  );
});

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
  
  // Pause background music if playing
  const wasMusicPlaying = isMusicPlaying.value;
  if (wasMusicPlaying && bgMusicRef.value) {
    bgMusicRef.value.pause();
  }
  
  const audio = new Audio(
    new URL(
      `../../assets/phonetics/${letter.toLowerCase()}.mp3`,
      import.meta.url
    ).href
  );
  
  // Resume background music after phonetic finishes
  audio.addEventListener('ended', () => {
    if (wasMusicPlaying && bgMusicRef.value) {
      bgMusicRef.value.play().catch(err => {
        console.log('Could not resume music:', err);
      });
    }
  });
  
  audio.play();
}

// Speak word aloud
function speakWord(word) {
  if (!word) return;
  if ("speechSynthesis" in window) {
    // Pause background music if playing
    const wasMusicPlaying = isMusicPlaying.value;
    if (wasMusicPlaying && bgMusicRef.value) {
      bgMusicRef.value.pause();
    }
    
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.rate = 0.7;
    
    // Resume background music after speech finishes
    utter.addEventListener('end', () => {
      if (wasMusicPlaying && bgMusicRef.value) {
        // Add a small delay before resuming to make it feel more natural
        setTimeout(() => {
          bgMusicRef.value.play().catch(err => {
            console.log('Could not resume music:', err);
          });
        }, 300);
      }
    });
    
    window.speechSynthesis.speak(utter);
  }
}
</script>

<style scoped>
/* Optional: Smooth scrolling for better UX */
main {
  scroll-behavior: smooth;
}

/* Styles merged from LearnCVCView.vue */
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

/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Celebration slider styling */
.slider-celebration::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(to right, #ec4899, #f97316);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-celebration::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: linear-gradient(to right, #ec4899, #f97316);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}

.slider-celebration::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.slider-celebration::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Music controls slide-up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Pulse animation for music button */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
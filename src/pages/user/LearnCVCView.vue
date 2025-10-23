<template>
  <div class="learn-cvc-view">
    <h1 class="text-2xl font-bold mb-6">Learn CVC Words</h1>

    <!-- Teaching Screen -->
    <div class="teaching-screen mb-6 relative">
      <h2 class="text-xl font-bold">Teaching Screen</h2>
      <div v-if="currentWord" class="current-word-display">
        <h3 class="text-3xl font-bold mb-4">
          {{ isUppercase ? currentWord.word.toUpperCase() : currentWord.word.toLowerCase() }}
        </h3>

        <div class="flex gap-2 mb-4">
          <button
            v-for="(letter, index) in currentWord.word.split('')"
            :key="index"
            class="letter-btn hover-scale"
            @click="playLetter(currentWord.audios.letters[index], letter)"
          >
            {{ isUppercase ? letter.toUpperCase() : letter.toLowerCase() }}
          </button>
        </div>

        <button class="play-btn" @click="playFullWord(currentWord.audios.full, currentWord.word)">
          Play Word
        </button>
      </div>
      <div v-else class="text-gray-500">No word selected.</div>

      <!-- Toggle Case Button -->
      <button class="toggle-case-btn absolute bottom-4 right-4" @click="toggleCase">
        {{ isUppercase ? 'LC' : 'UC' }}
      </button>
    </div>

    <div class="mt-8 text-center">
      <button class="random-word-btn" @click="drawWord">
        🎲 Draw CVC Word
      </button>
    </div>

    <div class="word-bucket-sidebar">
      <h2 class="text-xl font-bold mb-4">Word Bucket</h2>

      <!-- Search and Filter Controls -->
      <div class="filter-controls mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search words..."
          class="search-input"
        />
        <select v-model="selectedCategory" class="category-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Paginated and Filtered Word List -->
      <div v-if="paginatedWords.length === 0" class="text-center text-gray-500">
        No words match your criteria.
      </div>

      <ul v-else class="space-y-4">
        <li v-for="word in paginatedWords" :key="word.id" class="bucket-item">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">{{ word.word.toUpperCase() }}</h3>
              <button
                class="play-btn"
                @click="selectWord(word)"
              >
                Select
              </button>
            </div>
            <button
              class="delete-btn"
              @click="removeFromBucket(word.id)"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="pagination-controls mt-4 flex justify-center items-center gap-2">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import {
  getAllCvcWords,
  addWordToBucket,
  removeWordFromBucket,
  listenToWordBucket
} from '../../services/firebaseCVC';
import { audioEngine } from '../../services/audioEngine';
import { auth } from '../../firebase';

export default {
  name: 'LearnCVCView',
  setup() {
    const words = ref([]);
    const wordBucket = ref([]);
    const currentWord = ref(null);
    const isUppercase = ref(true);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const categories = computed(() => {
      const uniqueCategories = new Set(wordBucket.value.map((word) => word.category));
      return Array.from(uniqueCategories);
    });

    const filteredWords = computed(() => {
      return wordBucket.value.filter((word) => {
        const matchesSearch = word.word.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategory.value
          ? word.category === selectedCategory.value
          : true;
        return matchesSearch && matchesCategory;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredWords.value.length / itemsPerPage.value);
    });

    const paginatedWords = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredWords.value.slice(start, end);
    });

    const fetchWords = async () => {
      words.value = await getAllCvcWords();
    };

    const playFullWord = async (audioUrl, word) => {
      await audioEngine.playWord(word, audioUrl);
    };

    const playLetter = async (letterAudioUrl, letter) => {
      await audioEngine.playWord(letter, letterAudioUrl);
    };

    const addToBucket = async (word) => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('User is not authenticated. Cannot add to bucket.');
        return;
      }

      try {
        await addWordToBucket(userId, word);
      } catch (error) {
        console.error('Error adding word to bucket:', error);
      }
    };

    const removeFromBucket = async (wordId) => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('User is not authenticated. Cannot remove from bucket.');
        return;
      }

      try {
        await removeWordFromBucket(userId, wordId);
        wordBucket.value = wordBucket.value.filter((word) => word.id !== wordId);
      } catch (error) {
        console.error('Error removing word from bucket:', error);
      }
    };

    const drawWord = async () => {
      try {
        const allWords = await getAllCvcWords();
        if (allWords.length > 0) {
          const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
          const userId = auth.currentUser?.uid;

          if (!userId) {
            console.error('User is not authenticated. Cannot draw word.');
            return;
          }

          // Add the drawn word to Firestore if it doesn't already exist
          if (!wordBucket.value.some((w) => w.id === randomWord.id)) {
            await addToBucket(randomWord);
          }

          currentWord.value = randomWord;
        } else {
          alert('No words available to draw.');
        }
      } catch (error) {
        console.error('Error drawing word:', error);
      }
    };

    const selectWord = (word) => {
      currentWord.value = word;
    };

    const toggleCase = () => {
      isUppercase.value = !isUppercase.value;
    };

    const listenToBucketUpdates = () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.warn('User is not authenticated. Cannot listen to bucket updates.');
        return;
      }

      listenToWordBucket(userId, (updatedBucket) => {
        wordBucket.value = updatedBucket;
      });
    };

    onMounted(() => {
      fetchWords();

      // Wait for authentication before setting up the listener
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          listenToBucketUpdates();
        } else {
          console.warn('User is not authenticated. Skipping bucket updates listener.');
        }

        // Unsubscribe from the auth state listener after it runs once
        unsubscribe();
      });
    });

    return {
      words,
      wordBucket,
      currentWord,
      isUppercase,
      searchQuery,
      selectedCategory,
      currentPage,
      itemsPerPage,
      categories,
      filteredWords,
      totalPages,
      paginatedWords,
      playFullWord,
      playLetter,
      addToBucket,
      removeFromBucket,
      drawWord,
      selectWord,
      toggleCase
    };
  }
};
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
  0%, 20%, 50%, 80%, 100% {
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
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
        CVC Words
      </h1>
      <p class="text-gray-600 text-lg">Manage words and categories</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <p class="text-gray-600 text-lg font-semibold">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="words.length === 0" class="flex justify-center items-center min-h-96">
      <p class="text-gray-600 text-xl font-semibold">No words available yet</p>
    </div>

    <div v-else>
      <!-- Filter Section -->
      <div class="flex flex-wrap gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by word"
          class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        <select
          v-model="selectedCategory"
          class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Words List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="word in paginatedWords"
          :key="word.id"
          class="bg-white rounded-2xl shadow-lg p-6 relative transition-all duration-300"
          :class="{ 'newly-added': newlyAddedIds.has(word.id), 'word-card-enter': true }"
        >
          <h3 class="text-3xl font-bold text-center">{{ word.word.toUpperCase() }}</h3>
          <p class="text-center text-gray-600 mt-2">{{ word.category }}</p>
          <div
            class="absolute inset-0 bg-opacity-75 bg-gray-800 flex items-center justify-center gap-3"
            :class="{ 'opacity-100': visibleWordId === word.id, 'opacity-0': visibleWordId !== word.id }"
            @click.stop
          >
            <button
              @click="openEditModal(word)"
              class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(word.id)"
              class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          </div>
          <button
            @click="toggleVisibility(word.id)"
            class="absolute top-2 right-2 bg-transparent text-gray-800 font-bold py-1 px-2 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-6 gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
        >
          Previous
        </button>
        <span class="text-gray-700 font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <transition name="modal" v-if="editingWord">
      <div class="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
          <div class="bg-purple-500 p-6 text-white">
            <h3 class="text-2xl font-bold">Edit Word</h3>
          </div>
          <div class="p-6">
            <!-- Validation Errors Display -->
            <div v-if="validationErrors.length > 0" class="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p class="font-bold text-red-700 mb-2">⚠️ Validation Errors:</p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="(error, index) in validationErrors" :key="index" class="text-red-600 text-sm">
                  {{ error }}
                </li>
              </ul>
            </div>
            
            <label class="block text-sm font-bold text-gray-700 mb-2">Word (CVC Format)</label>
            <input
              v-model="editingWord.word"
              @input="validateInRealTime"
              type="text"
              maxlength="3"
              placeholder="e.g., cat, dog, run"
              class="w-full px-4 py-3 border-2 rounded-lg transition-colors"
              :class="validationErrors.length > 0 ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-purple-500'"
            />
            <p class="text-xs text-gray-500 mt-1">Must be 3 letters: Consonant-Vowel-Consonant</p>
            
            <label class="block text-sm font-bold text-gray-700 mt-4 mb-2">Category</label>
            <select
              v-model="editingWord.category"
              @change="validateInRealTime"
              class="w-full px-4 py-3 border-2 rounded-lg transition-colors"
              :class="!editingWord.category ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="p-6 flex justify-end gap-3">
            <button
              @click="closeEditModal"
              class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              :disabled="validationErrors.length > 0 || !editingWord.word || !editingWord.category"
              class="px-6 py-3 font-bold rounded-lg transition-colors"
              :class="validationErrors.length > 0 || !editingWord.word || !editingWord.category 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal" v-if="showDeleteConfirm">
      <div class="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
          <div class="bg-red-500 p-6 text-white">
            <h3 class="text-2xl font-bold">Delete Word?</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-700 text-lg mb-6">Are you sure you want to delete this word?</p>
            <div class="flex gap-3">
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                @click="deleteWord()"
                class="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getAllCvcWords, updateCvcWord, deleteCvcWord } from '../../services/firebaseCVC';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from 'vue-toastification';

export default {
  name: 'CVCList',
  setup() {
    const toast = useToast();
    const words = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const editingWord = ref(null);
    const showDeleteConfirm = ref(false);
    const wordToDelete = ref(null);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const validationErrors = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const unsubscribeWords = ref(null);
    const unsubscribeCategories = ref(null);
    const visibleWordId = ref(null);
    const newlyAddedIds = ref(new Set());

    const loadWords = async () => {
      try {
        loading.value = true;
        const fetchedWords = await getAllCvcWords();
        words.value = fetchedWords;
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadCategories = () => {
      const categoriesCol = collection(db, 'cvc_category');
      unsubscribeCategories.value = onSnapshot(
        categoriesCol,
        (snapshot) => {
          categories.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        (error) => {
          console.error('Error listening to categories:', error);
        }
      );
    };

    const openEditModal = (word) => {
      editingWord.value = { ...word };
      validationErrors.value = [];
    };

    const closeEditModal = () => {
      editingWord.value = null;
      validationErrors.value = [];
    };
    
    const validateInRealTime = () => {
      if (!editingWord.value) return;
      
      validationErrors.value = [];
      
      // Validate word
      if (editingWord.value.word) {
        const validation = validateCVCWord(editingWord.value.word);
        if (!validation.isValid) {
          validationErrors.value = [...validation.errors];
        }
      }
      
      // Validate category
      if (!editingWord.value.category) {
        validationErrors.value.push('Category is required');
      }
    };

    const validateCVCWord = (word) => {
      // Validation rules
      const errors = [];
      
      // 1. Check if word exists and is not empty
      if (!word || !word.trim()) {
        errors.push('Word cannot be empty');
        return { isValid: false, errors };
      }
      
      // 2. Trim and convert to lowercase for validation
      const cleanWord = word.trim().toLowerCase();
      
      // 3. Check if it's exactly 3 letters (CVC format)
      if (cleanWord.length !== 3) {
        errors.push('Word must be exactly 3 letters (CVC format)');
      }
      
      // 4. Check if it contains only letters
      if (!/^[a-z]+$/i.test(cleanWord)) {
        errors.push('Word must contain only letters');
      }
      
      // 5. Check CVC pattern: consonant-vowel-consonant
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      const consonants = 'bcdfghjklmnpqrstvwxyz';
      
      if (cleanWord.length === 3) {
        const firstLetter = cleanWord[0];
        const middleLetter = cleanWord[1];
        const lastLetter = cleanWord[2];
        
        // First letter should be a consonant
        if (!consonants.includes(firstLetter)) {
          errors.push('First letter must be a consonant');
        }
        
        // Middle letter should be a vowel
        if (!vowels.includes(middleLetter)) {
          errors.push('Middle letter must be a vowel (a, e, i, o, u)');
        }
        
        // Last letter should be a consonant
        if (!consonants.includes(lastLetter)) {
          errors.push('Last letter must be a consonant');
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        cleanWord
      };
    };

    const saveChanges = async () => {
      try {
        // Validate word field
        if (!editingWord.value || !editingWord.value.word) {
          toast.error('Word is required');
          return;
        }
        
        // Validate category field
        if (!editingWord.value.category || editingWord.value.category.trim() === '') {
          toast.error('Category is required');
          return;
        }
        
        // Check if category exists in the categories list
        const categoryExists = categories.value.some(
          cat => cat.name === editingWord.value.category
        );
        
        if (!categoryExists) {
          toast.error('Selected category does not exist');
          return;
        }
        
        // Validate CVC format
        const validation = validateCVCWord(editingWord.value.word);
        
        if (!validation.isValid) {
          // Show all validation errors
          validation.errors.forEach(error => {
            toast.error(error);
          });
          return;
        }
        
        // Check for duplicates (excluding current word)
        const duplicate = words.value.find(
          w => w.word.toLowerCase() === validation.cleanWord && w.id !== editingWord.value.id
        );
        
        if (duplicate) {
          toast.error(`Word "${validation.cleanWord}" already exists in category "${duplicate.category}"`);
          return;
        }
        
        // If all validations pass, update the word
        await updateCvcWord(editingWord.value.id, {
          word: validation.cleanWord,
          category: editingWord.value.category.trim(),
        });
        
        closeEditModal();
        toast.success('Word updated successfully!');
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes: ' + error.message);
      }
    };

    const confirmDelete = (id) => {
      if (id) {
        wordToDelete.value = id;
        showDeleteConfirm.value = true;
      } else {
        console.error('Invalid word ID provided to confirmDelete');
        toast.error('Invalid word ID.');
      }
    };

    const deleteWord = async () => {
      try {
        const id = wordToDelete.value;
        if (!id || typeof id !== 'string') {
          toast.error('No word selected to delete.');
          return;
        }
        await deleteCvcWord(id);
        words.value = words.value.filter((word) => word.id !== id);
        showDeleteConfirm.value = false;
        wordToDelete.value = null;
        toast.success('Word deleted successfully!');
      } catch (error) {
        console.error('Error deleting word:', error);
        toast.error('Failed to delete word.');
      }
    };

    const filteredWords = computed(() => {
      return words.value.filter((word) => {
        const matchesSearch = word.word.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = !selectedCategory.value || word.category === selectedCategory.value;
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

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const toggleVisibility = (id) => {
      visibleWordId.value = visibleWordId.value === id ? null : id;
    };

    onMounted(async () => {
      // Real-time updates for cvcWords
      const wordsCol = collection(db, 'cvcWords');
      let isFirstLoad = true;
      
      unsubscribeWords.value = onSnapshot(
        wordsCol,
        (snapshot) => {
          const previousIds = new Set(words.value.map(w => w.id));
          const newWords = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          
          // Detect newly added words (only after first load)
          if (!isFirstLoad) {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const newId = change.doc.id;
                if (!previousIds.has(newId)) {
                  // Mark as newly added
                  newlyAddedIds.value.add(newId);
                  // Show toast notification
                  toast.success(`New word "${change.doc.data().word}" added!`);
                  // Remove highlight after 3 seconds
                  setTimeout(() => {
                    newlyAddedIds.value.delete(newId);
                  }, 3000);
                }
              }
              
              // Handle updates
              if (change.type === 'modified') {
                toast.info(`Word "${change.doc.data().word}" updated`);
              }
            });
          }
          
          words.value = newWords;
          loading.value = false;
          isFirstLoad = false;
        },
        (error) => {
          console.error('Error listening to cvcWords:', error);
          loading.value = false;
        }
      );

      await loadCategories();
    });

    onUnmounted(() => {
      if (unsubscribeWords.value) {
        unsubscribeWords.value();
      }
      if (unsubscribeCategories.value) {
        unsubscribeCategories.value();
      }
    });

    return {
      words,
      categories,
      loading,
      editingWord,
      showDeleteConfirm,
      searchQuery,
      selectedCategory,
      currentPage,
      itemsPerPage,
      filteredWords,
      paginatedWords,
      totalPages,
      validationErrors,
      openEditModal,
      closeEditModal,
      saveChanges,
      confirmDelete,
      deleteWord,
      nextPage,
      prevPage,
      visibleWordId,
      toggleVisibility,
      validateInRealTime,
      newlyAddedIds
    };
  },
};
</script>

<style scoped>
.cvc-list {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Newly added word highlight animation */
.newly-added {
  animation: highlightPulse 2s ease-in-out;
  border: 3px solid #10b981 !important;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5) !important;
}

@keyframes highlightPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.8);
  }
}

/* Card enter animation */
.word-card-enter {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Toast notification styles enhancement */
.newly-added::before {
  content: '✨ NEW';
  position: absolute;
  top: -12px;
  right: 10px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0) translateY(-10px);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) translateY(-5px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
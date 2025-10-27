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
          class="bg-white rounded-2xl shadow-lg p-6 relative"
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
            <label class="block text-sm font-bold text-gray-700 mb-2">Word</label>
            <input
              v-model="editingWord.word"
              type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            />
            <label class="block text-sm font-bold text-gray-700 mt-4 mb-2">Category</label>
            <select
              v-model="editingWord.category"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
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
              class="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg"
            >
              Save
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
    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const unsubscribeWords = ref(null);
    const unsubscribeCategories = ref(null);
    const visibleWordId = ref(null);

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
    };

    const closeEditModal = () => {
      editingWord.value = null;
    };

    const saveChanges = async () => {
      try {
        await updateCvcWord(editingWord.value.id, {
          word: editingWord.value.word,
          category: editingWord.value.category,
        });
        closeEditModal();
        toast.success('Word updated successfully!');
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes.');
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
      unsubscribeWords.value = onSnapshot(
        wordsCol,
        (snapshot) => {
          words.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          loading.value = false;
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
      openEditModal,
      closeEditModal,
      saveChanges,
      confirmDelete,
      deleteWord,
      nextPage,
      prevPage,
      visibleWordId,
      toggleVisibility
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
/* ...existing styles... */
</style>
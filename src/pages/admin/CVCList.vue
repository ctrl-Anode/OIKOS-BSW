<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
        CVC Words
      </h1>
      <p class="text-gray-600 text-lg">Learn Consonant-Vowel-Consonant words with audio</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="text-center">
        <div class="inline-block">
          <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-600 text-lg font-semibold">Loading words...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="words.length === 0" class="flex justify-center items-center min-h-96">
      <div class="text-center">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-gray-600 text-xl font-semibold">No words available yet</p>
        <p class="text-gray-500 mt-2">Start adding CVC words to get started!</p>
      </div>
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

      <!-- Words Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <transition-group name="fade" tag="div" class="contents">
          <div
            v-for="word in paginatedWords"
            :key="word.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 transform"
          >
            <!-- Card Header -->
            <div
              class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white cursor-pointer"
              @click="toggleCard(word)"
            >
              <h3 class="text-3xl font-bold text-center">{{ word.word.toUpperCase() }}</h3>
              <p class="text-center text-purple-100 text-sm mt-2">{{ word.category }}</p>
            </div>

            <!-- Card Content -->
            <div v-if="!word.collapsed" class="p-6">
              <!-- Full Audio -->
              <div class="mb-6">
                <h4 class="font-bold text-gray-700 mb-3 flex items-center">
                  <span class="text-2xl mr-2">🔊</span>
                  Full Word
                </h4>
                <audio
                  v-if="word.audios.full"
                  :src="word.audios.full"
                  controls
                  class="w-full rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></audio>
                <p v-else class="text-sm text-gray-500">No audio available. Add one during edit.</p>
              </div>

              <!-- Letter Audios -->
              <div class="mb-6">
                <h4 class="font-bold text-gray-700 mb-3 flex items-center">
                  <span class="text-2xl mr-2">🔤</span>
                  Letter Sounds
                </h4>
                <div class="space-y-3">
                  <div v-for="(audio, index) in word.audios.letters" :key="index" class="bg-gray-50 p-3 rounded-lg">
                    <p class="text-sm text-gray-600 mb-2 font-semibold">Letter {{ index + 1 }}</p>
                    <audio
                      v-if="audio"
                      :src="audio"
                      controls
                      class="w-full rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></audio>
                    <p v-else class="text-sm text-gray-500">No audio available. Add one during edit.</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button
                  @click="openEditModal(word)"
                  class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>✏️</span>
                  Edit
                </button>
                <button
                  @click="confirmDelete(word.id)"
                  class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-6 gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
        >
          Previous
        </button>
        <span class="text-gray-700 font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <transition name="modal" v-if="editingWord">
      <div class="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white sticky top-0">
            <h3 class="text-2xl font-bold">{{ editingWord.id ? '✏️ Edit CVC Word' : '🆕 Add CVC Word' }}</h3>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Word Input -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Word
              </label>
              <input
                v-model="editingWord.word"
                type="text"
                maxlength="3"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-bold text-2xl tracking-widest uppercase focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="Enter 3-letter CVC word"
              />
            </div>

            <!-- Category Input -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                v-model="editingWord.category"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Audio Uploads -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Full Word Audio
              </label>
              <input
                type="file"
                accept="audio/*"
                @change="previewAudio('full', $event)"
                class="hidden"
                ref="fullAudioInput"
              />
              <button
                @click="triggerAudioInput('full')"
                class="w-full px-4 py-3 border-2 border-dashed border-purple-400 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-purple-700 font-semibold"
              >
                📤 Upload Full Audio
              </button>
              <p v-if="newAudios.full" class="text-green-600 mt-1 text-sm">
                ✅ Full audio ready: {{ newAudios.full.name || 'Uploaded file' }}
              </p>
            </div>

            <div v-for="(audio, index) in editingWord.audios.letters" :key="index">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                Letter {{ index + 1 }} Audio
              </label>
              <input
                type="file"
                accept="audio/*"
                @change="previewAudio(`letter${index}`, $event)"
                class="hidden"
                :ref="el => (letterAudioInputs[index] = el)"
              />
              <button
                @click="triggerAudioInput(`letter${index}`)"
                class="w-full px-4 py-3 border-2 border-dashed border-purple-400 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-purple-700 font-semibold"
              >
                📤 Upload Letter {{ index + 1 }} Audio
              </button>
              <p v-if="newAudios[`letter${index}`]" class="text-green-600 mt-1 text-sm">
                ✅ Letter {{ index + 1 }} audio ready: {{ newAudios[`letter${index}`].name || 'Uploaded file' }}
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 p-6 flex gap-3 justify-end sticky bottom-0 border-t">
            <button
              @click="closeEditModal"
              class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-200"
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
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <h3 class="text-2xl font-bold">Delete Word?</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-700 text-lg mb-6">Are you sure you want to delete this word? This action cannot be undone.</p>
            <div class="flex gap-3">
              <button
                @click="showDeleteConfirm = false"
                class="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                @click="deleteWord(wordToDelete)"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all"
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
import { ref, onMounted, computed } from 'vue';
import { 
  getAllCvcWords, 
  deleteCvcWord, 
  uploadCvcAudio, 
  updateCvcWord 
} from '../../services/firebaseCVC';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { useToast } from 'vue-toastification';

export default {
  name: 'CVCList',
  setup() {
    const toast = useToast();
    const words = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const editingWord = ref(null);
    const newAudios = ref({});
    const showDeleteConfirm = ref(false);
    const wordToDelete = ref(null);
    const fullAudioInput = ref(null);
    const letterAudioInputs = ref([]);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(6);

    // ------------------------
    // Load Words
    // ------------------------
    const loadWords = async () => {
      try {
        loading.value = true;
        const fetchedWords = await getAllCvcWords();
        words.value = fetchedWords.map((word) => ({ ...word, collapsed: true }));
      } catch (error) {
        console.error('Error fetching CVC words:', error);
      } finally {
        loading.value = false;
      }
    };

    // ------------------------
    // Load Categories
    // ------------------------
    const loadCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cvc_category'));
        categories.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // ------------------------
    // Edit Modal
    // ------------------------
    const openEditModal = (word) => {
      editingWord.value = JSON.parse(JSON.stringify(word));
      newAudios.value = {};
    };

    const closeEditModal = () => {
      editingWord.value = null;
      newAudios.value = {};
    };

    // ------------------------
    // Audio Preview & Upload
    // ------------------------
    const previewAudio = (key, event) => {
      const file = event.target.files[0];
      if (file) {
        newAudios.value[key] = file; // store actual file, not preview URL
      }
    };

    const triggerAudioInput = (key) => {
      if (key === 'full') {
        fullAudioInput.value?.click();
      } else {
        const index = parseInt(key.replace('letter', ''), 10);
        letterAudioInputs.value[index]?.click();
      }
    };

    // ------------------------
    // Validate CVC structure
    // ------------------------
    const isCVCWord = (word) => {
      const cvcPattern = /^[^aeiou][aeiou][^aeiou]$/i;
      return cvcPattern.test(word);
    };

    // ------------------------
    // Save Changes (Edit)
    // ------------------------
    const saveChanges = async () => {
      try {
        // Validate word
        if (!editingWord.value.word.trim() || editingWord.value.word.length !== 3 || !isCVCWord(editingWord.value.word)) {
          toast.error('Please enter a valid 3-letter CVC word (Consonant-Vowel-Consonant).');
          return;
        }

        const updatedAudios = { ...editingWord.value.audios };

        // Replace existing audio files if new ones are uploaded
        for (const key in newAudios.value) {
          const newFile = newAudios.value[key];
          if (!newFile) continue;

          const path = `cvcWords/${editingWord.value.id}/${key}-audio-${Date.now()}`;

          if (key === 'full') {
            updatedAudios.full = await uploadCvcAudio(newFile, path);
          } else if (key.includes('letter')) {
            const index = parseInt(key.replace('letter', ''), 10);
            updatedAudios.letters[index] = await uploadCvcAudio(newFile, path);
          }
        }

        await updateCvcWord(editingWord.value.id, {
          word: editingWord.value.word,
          category: editingWord.value.category,
          audios: updatedAudios
        });

        // Automatically refresh the words list
        await loadWords();
        closeEditModal();

        // Clear fields after saving
        editingWord.value = null;
        newAudios.value = {};

        toast.success('CVC word updated successfully!');
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes. Please try again.');
      }
    };

    // ------------------------
    // Delete Old Audio (Helper)
    // ------------------------
    const deleteOldAudio = async (audioUrl) => {
      try {
        if (!audioUrl) return;
        const pathStart = audioUrl.indexOf('/o/') + 3;
        const pathEnd = audioUrl.indexOf('?');
        const filePath = decodeURIComponent(audioUrl.substring(pathStart, pathEnd));
        const fileRef = storageRef(storage, filePath);
        await deleteObject(fileRef);
        console.log('Deleted old audio:', filePath);
      } catch (error) {
        console.warn('Failed to delete old audio:', error);
      }
    };

    // ------------------------
    // Delete Entire Word
    // ------------------------
    const confirmDelete = (id) => {
      wordToDelete.value = id;
      showDeleteConfirm.value = true;
    };

    const deleteWord = async (id) => {
      const word = words.value.find((w) => w.id === id);
      if (!word) return;

      const audioPaths = [];
      if (word.audios) {
        if (word.audios.full) audioPaths.push(word.audios.full);
        if (word.audios.letters) audioPaths.push(...word.audios.letters.filter(Boolean));
      }

      try {
        await deleteCvcWord(id, audioPaths);
        words.value = words.value.filter((w) => w.id !== id);
        showDeleteConfirm.value = false;
        toast.success('CVC word deleted successfully!');
      } catch (error) {
        console.error('Error deleting CVC word:', error);
        toast.error('Failed to delete the word. Please try again.');
      }
    };

    const toggleCard = (word) => {
      word.collapsed = !word.collapsed;
    };

    // ------------------------
    // Filtering and Pagination
    // ------------------------
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

    onMounted(async () => {
      await loadWords();
      await loadCategories();
    });

    return {
      words,
      categories,
      loading,
      editingWord,
      newAudios,
      showDeleteConfirm,
      fullAudioInput,
      letterAudioInputs,
      searchQuery,
      selectedCategory,
      currentPage,
      itemsPerPage,
      filteredWords,
      paginatedWords,
      totalPages,
      openEditModal,
      closeEditModal,
      previewAudio,
      triggerAudioInput,
      saveChanges,
      isCVCWord,
      confirmDelete,
      deleteWord,
      toggleCard,
      nextPage,
      prevPage,
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
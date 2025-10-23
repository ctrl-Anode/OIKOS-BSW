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

    <!-- Words Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <transition-group name="fade" tag="div" class="contents">
        <div
          v-for="word in words"
          :key="word.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 transform"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <h3 class="text-3xl font-bold text-center">{{ word.word.toUpperCase() }}</h3>
            <p class="text-center text-purple-100 text-sm mt-2">{{ word.category }}</p>
          </div>

          <!-- Card Content -->
          <div class="p-6">
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

    <!-- Edit Modal -->
    <transition name="modal" v-if="editingWord">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white sticky top-0">
            <h3 class="text-2xl font-bold">Edit CVC Word</h3>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Word Input -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <span class="text-lg mr-2">📝</span>Word
              </label>
              <input
                v-model="editingWord.word"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Enter word"
              />
            </div>

            <!-- Category Input -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <span class="text-lg mr-2">🏷️</span>Category
              </label>
              <input
                v-model="editingWord.category"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Enter category"
              />
            </div>

            <!-- Full Audio -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-bold text-gray-700 mb-3">🔊 Full Audio</h4>
              <audio v-if="editingWord.audios.full" :src="editingWord.audios.full" controls class="w-full mb-3 rounded"></audio>
              <p v-else class="text-sm text-gray-500">No audio available. Add one below.</p>
              <label class="block">
                <span class="text-sm font-semibold text-gray-700 mb-2 block">Replace/Add Full Audio:</span>
                <input
                  type="file"
                  accept="audio/*"
                  @change="previewAudio('full', $event)"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </label>
              <audio v-if="newAudios.full" :src="newAudios.full" controls class="w-full mt-3 rounded"></audio>
            </div>

            <!-- Letter Audios -->
            <div v-for="(audio, index) in editingWord.audios.letters" :key="index" class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-bold text-gray-700 mb-3">🔤 Letter {{ index + 1 }} Audio</h4>
              <audio v-if="audio" :src="audio" controls class="w-full mb-3 rounded"></audio>
              <p v-else class="text-sm text-gray-500">No audio available. Add one below.</p>
              <label class="block">
                <span class="text-sm font-semibold text-gray-700 mb-2 block">Replace/Add Letter {{ index + 1 }} Audio:</span>
                <input
                  type="file"
                  accept="audio/*"
                  @change="previewAudio(`letter${index}`, $event)"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </label>
              <audio v-if="newAudios[`letter${index}`]" :src="newAudios[`letter${index}`]" controls class="w-full mt-3 rounded"></audio>
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
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal" v-if="showDeleteConfirm">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
import { ref, onMounted } from 'vue';
import { getAllCvcWords, deleteCvcWord, uploadCvcAudio, updateCvcWord } from '../../services/firebaseCVC';

export default {
  name: 'CVCList',
  setup() {
    const words = ref([]);
    const loading = ref(true);
    const editingWord = ref(null);
    const newAudios = ref({});
    const showDeleteConfirm = ref(false);
    const wordToDelete = ref(null);

    const loadWords = async () => {
      try {
        loading.value = true;
        words.value = await getAllCvcWords();
      } catch (error) {
        console.error('Error fetching CVC words:', error);
      } finally {
        loading.value = false;
      }
    };

    const openEditModal = (word) => {
      editingWord.value = JSON.parse(JSON.stringify(word));
      newAudios.value = {};
    };

    const closeEditModal = () => {
      editingWord.value = null;
      newAudios.value = {};
    };

    const previewAudio = (key, event) => {
      const file = event.target.files[0];
      if (file) {
        newAudios.value[key] = URL.createObjectURL(file);
      }
    };

    const saveChanges = async () => {
      try {
        const updatedAudios = { ...editingWord.value.audios };

        // Ensure the audios object and its properties exist
        if (!updatedAudios.full) {
          updatedAudios.full = null;
        }
        if (!updatedAudios.letters) {
          updatedAudios.letters = [];
        }

        // Upload new audios if provided
        for (const key in newAudios.value) {
          const file = newAudios.value[key];
          const path = `cvcWords/${editingWord.value.id}/${key}-audio-${Date.now()}`;

          if (key.includes('letter')) {
            const index = parseInt(key.replace('letter', ''));
            updatedAudios.letters[index] = await uploadCvcAudio(file, path);
          } else if (key === 'full') {
            updatedAudios.full = await uploadCvcAudio(file, path);
          }
        }

        // Update Firestore
        await updateCvcWord(editingWord.value.id, {
          word: editingWord.value.word,
          category: editingWord.value.category,
          audios: updatedAudios
        });

        // Refresh the word list
        await loadWords();
        closeEditModal();
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    };

    const confirmDelete = (id) => {
      wordToDelete.value = id;
      showDeleteConfirm.value = true;
    };

    const deleteWord = async (id) => {
      const wordToDelete = words.value.find((word) => word.id === id);
      if (!wordToDelete) {
        console.error('Word not found.');
        return;
      }

      const audioPaths = [];

      // Collect audio paths if they exist
      if (wordToDelete.audios) {
        if (wordToDelete.audios.full) {
          audioPaths.push(wordToDelete.audios.full);
        }
        if (wordToDelete.audios.letters && Array.isArray(wordToDelete.audios.letters)) {
          audioPaths.push(...wordToDelete.audios.letters.filter(Boolean));
        }
      }

      if (audioPaths.length === 0) {
        console.warn('No audio paths to delete for the word.');
      }

      try {
        await deleteCvcWord(id, audioPaths);
        words.value = words.value.filter((word) => word.id !== id);
        showDeleteConfirm.value = false;
      } catch (error) {
        console.error('Error deleting CVC word:', error);
      }
    };

    onMounted(loadWords);

    return {
      words,
      loading,
      editingWord,
      newAudios,
      showDeleteConfirm,
      openEditModal,
      closeEditModal,
      previewAudio,
      saveChanges,
      confirmDelete,
      deleteWord
    };
  }
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
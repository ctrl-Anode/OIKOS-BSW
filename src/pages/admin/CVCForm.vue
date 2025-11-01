<template>
  <div class="p-6 bg-white rounded-xl shadow">
    <h2 class="text-xl font-bold mb-4">
      {{ isEditing ? "✏️ Edit CVC Word" : "🆕 Add CVC Word" }}
    </h2>
    <form @submit.prevent="saveWord">
      <!-- Word Input -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">Word</label>
        <input
          v-model="form.word"
          maxlength="3"
          required
          class="border p-2 rounded w-full text-center font-bold text-xl"
        />
      </div>

      <!-- Category Select -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">Category</label>
        <select
          v-model="form.category"
          required
          class="border p-2 rounded w-full"
        >
          <option disabled value="">Select Category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-purple-500 text-white px-4 py-2 rounded"
        >
          💾 {{ isEditing ? "Update Word" : "Save Word" }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="bg-gray-300 px-4 py-2 rounded"
        >
          ✖ Cancel
        </button>
      </div>
    </form>

    <!-- Divider -->
    <div class="my-6 border-t border-gray-300"></div>

    <!-- Excel Upload Section -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-dashed border-blue-300">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          📊 Bulk Upload via Excel
        </h3>
        <button
          type="button"
          @click="showExcelInfo = !showExcelInfo"
          class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 font-semibold text-sm"
          title="Show Excel format information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>File Format Info</span>
        </button>
      </div>

      <!-- File Input -->
      <div class="flex items-center gap-3">
        <label class="flex-1 cursor-pointer">
          <div class="flex items-center justify-center gap-2 p-4 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="font-semibold text-blue-700">
              {{ selectedFileName || 'Choose Excel File' }}
            </span>
          </div>
          <input
            type="file"
            accept=".xlsx, .xls"
            @change="handleFileUpload"
            class="hidden"
            ref="fileInput"
          />
        </label>
        <button
          v-if="selectedFileName"
          type="button"
          @click="clearFile"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          title="Clear selected file"
        >
          ✖
        </button>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploading" class="mt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">Processing...</span>
          <span class="text-sm text-gray-600">{{ uploadProgress }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: uploadProgress }"></div>
        </div>
      </div>
    </div>

    <!-- Excel Info Modal -->
    <transition name="modal-fade">
      <div
        v-if="showExcelInfo"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="showExcelInfo = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
            <div class="flex items-center gap-3">
              <span class="text-3xl">📋</span>
              <div>
                <h3 class="text-xl sm:text-2xl font-bold">Excel File Requirements</h3>
                <p class="text-blue-100 text-xs sm:text-sm mt-0.5">Format guidelines for bulk upload</p>
              </div>
            </div>
            <button
              @click="showExcelInfo = false"
              class="p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <!-- Column Requirements -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span class="text-xl">📊</span>
                  <span>Required Columns</span>
                </h4>
                <ul class="space-y-3">
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p class="font-semibold text-gray-800">Column 1: "CVC Word"</p>
                      <p class="text-sm text-gray-600 mt-1">Must contain exactly 3-letter words following Consonant-Vowel-Consonant pattern</p>
                      <p class="text-xs text-blue-600 mt-1">Examples: CAT, DOG, PIG, SUN, RUN</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <p class="font-semibold text-gray-800">Column 2: "Category"</p>
                      <p class="text-sm text-gray-600 mt-1">Category name (minimum 2 characters)</p>
                      <p class="text-xs text-purple-600 mt-1">New categories are automatically created if they don't exist</p>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- File Format -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span class="text-xl">📄</span>
                  <span>File Format</span>
                </h4>
                <p class="text-sm text-gray-600">Excel files (.xlsx or .xls)</p>
              </div>

              <!-- Validation Rules -->
              <div class="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span class="text-xl">✓</span>
                  <span>Validation Rules</span>
                </h4>
                <ul class="space-y-2">
                  <li class="flex items-start gap-2 text-sm text-gray-700">
                    <span class="text-green-500 font-bold">✓</span>
                    <span>Words must be exactly 3 characters long</span>
                  </li>
                  <li class="flex items-start gap-2 text-sm text-gray-700">
                    <span class="text-green-500 font-bold">✓</span>
                    <span>Words must follow CVC pattern (Consonant-Vowel-Consonant)</span>
                  </li>
                  <li class="flex items-start gap-2 text-sm text-gray-700">
                    <span class="text-green-500 font-bold">✓</span>
                    <span>Duplicate words will be skipped (case-insensitive)</span>
                  </li>
                  <li class="flex items-start gap-2 text-sm text-gray-700">
                    <span class="text-green-500 font-bold">✓</span>
                    <span>Category names must be at least 2 characters</span>
                  </li>
                  <li class="flex items-start gap-2 text-sm text-gray-700">
                    <span class="text-green-500 font-bold">✓</span>
                    <span>Categories are matched case-insensitively</span>
                  </li>
                </ul>
              </div>

              <!-- Example Table -->
              <div class="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-2 border-gray-300">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span class="text-xl">📝</span>
                  <span>Example Format</span>
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead>
                      <tr class="bg-gradient-to-r from-blue-100 to-purple-100">
                        <th class="border-2 border-gray-300 px-4 py-2 text-left font-bold text-gray-800">CVC Word</th>
                        <th class="border-2 border-gray-300 px-4 py-2 text-left font-bold text-gray-800">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white hover:bg-blue-50 transition-colors">
                        <td class="border-2 border-gray-300 px-4 py-2 font-mono font-semibold text-blue-600">CAT</td>
                        <td class="border-2 border-gray-300 px-4 py-2">Animals</td>
                      </tr>
                      <tr class="bg-gray-50 hover:bg-blue-50 transition-colors">
                        <td class="border-2 border-gray-300 px-4 py-2 font-mono font-semibold text-blue-600">DOG</td>
                        <td class="border-2 border-gray-300 px-4 py-2">Animals</td>
                      </tr>
                      <tr class="bg-white hover:bg-blue-50 transition-colors">
                        <td class="border-2 border-gray-300 px-4 py-2 font-mono font-semibold text-blue-600">SUN</td>
                        <td class="border-2 border-gray-300 px-4 py-2">Nature</td>
                      </tr>
                      <tr class="bg-gray-50 hover:bg-blue-50 transition-colors">
                        <td class="border-2 border-gray-300 px-4 py-2 font-mono font-semibold text-blue-600">RUN</td>
                        <td class="border-2 border-gray-300 px-4 py-2">Actions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="border-t-2 border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
            <button
              @click="showExcelInfo = false"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { addCvcWord, updateCvcWord, addCategory, categoryExists, cvcWordExists } from '../../services/firebaseCVC'
import { useToast } from 'vue-toastification';
import * as XLSX from 'xlsx';

const props = defineProps({
  wordData: { type: Object, default: null },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['saved', 'cancel'])

// Form Data
const form = ref({
  word: props.wordData?.word || '',
  category: props.wordData?.category || ''
})

const isEditing = computed(() => !!props.wordData)
const toast = useToast()

// Excel upload state
const showExcelInfo = ref(false)
const selectedFileName = ref('')
const isUploading = ref(false)
const uploadProgress = ref('0%')
const fileInput = ref(null)

// Force uppercase + limit to 3 letters
watch(
  () => form.value.word,
  newWord => {
    if (newWord) form.value.word = newWord.toUpperCase().slice(0, 3)
  }
)

// UI helpers
const getLetterColor = i => ['text-pink-600', 'text-blue-600', 'text-green-600'][i]
const getLetterButtonStyle = i =>
  [
    'border-pink-300 hover:border-pink-600 hover:bg-pink-50 text-pink-700',
    'border-blue-300 hover:border-blue-600 hover:bg-blue-50 text-blue-700',
    'border-green-300 hover:border-green-600 hover:bg-green-50 text-green-700'
  ][i]
const getLetterLabel = i => ['First Letter', 'Second Letter', 'Third Letter'][i]

// Validate CVC structure
const isCVCWord = (word) => {
  const cvcPattern = /^[^aeiou][aeiou][^aeiou]$/i;
  return cvcPattern.test(word);
};

// Save Word
const saveWord = async () => {
  try {
    // Validate word format
    if (!form.value.word.trim() || form.value.word.length !== 3) {
      toast.error('Please enter a valid 3-letter word.')
      return
    }
    
    if (!isCVCWord(form.value.word)) {
      toast.error('Please enter a valid CVC word (Consonant-Vowel-Consonant).')
      return
    }
    
    if (!form.value.category.trim()) {
      toast.error('Category is required.')
      return
    }

    // Check for duplicates (only when adding new word, not editing)
    if (!isEditing.value) {
      const exists = await cvcWordExists(form.value.word);
      if (exists) {
        toast.error(`The word "${form.value.word}" already exists in the database.`);
        return;
      }
    }

    const payload = {
      word: form.value.word,
      category: form.value.category,
      updatedAt: new Date().toISOString()
    }

    if (isEditing.value) {
      await updateCvcWord(props.wordData.id, payload)
      toast.success('CVC word updated successfully!')
    } else {
      await addCvcWord(payload)
      toast.success('CVC word added successfully!')
    }

    emit('saved')

    // Clear fields after saving
    form.value = {
      word: '',
      category: ''
    }
  } catch (err) {
    console.error('❌ Error saving CVC word:', err)
    toast.error(err.message || 'Upload failed. Check console for details.')
  }
}

// Handle Excel File Upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFileName.value = file.name;
  isUploading.value = true;
  uploadProgress.value = '0%';

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    uploadProgress.value = '10%';

    if (rows.length === 0) {
      toast.error('Excel file is empty!');
      isUploading.value = false;
      return;
    }

    let processedCount = 0;
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const word = row['CVC Word']?.toString().toUpperCase().slice(0, 3);
      const category = row['Category']?.toString().trim();

      // Update progress
      uploadProgress.value = `${Math.round(10 + (i / rows.length) * 90)}%`;

      if (!word || !isCVCWord(word)) {
        toast.error(`Row ${i + 1}: Invalid CVC word - "${row['CVC Word']}"`);
        errorCount++;
        continue;
      }

      if (!category) {
        toast.error(`Row ${i + 1}: Category missing for word "${word}"`);
        errorCount++;
        continue;
      }

      // Validate category name length
      if (category.length < 2) {
        toast.error(`Row ${i + 1}: Category name must be at least 2 characters - "${category}"`);
        errorCount++;
        continue;
      }

      // Check if category exists in database (case-insensitive), add if not
      const doesCategoryExist = await categoryExists(category);
      if (!doesCategoryExist) {
        try {
          await addCategory({ name: category });
          // Update local categories list
          props.categories.push({ 
            name: category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          toast.success(`✨ New category added: ${category}`);
        } catch (error) {
          toast.error(`Row ${i + 1}: Failed to add category "${category}" - ${error.message}`);
          errorCount++;
          continue;
        }
      }

      // Check if word exists, skip if it does
      const wordExists = await cvcWordExists(word);
      if (wordExists) {
        toast.info(`Word already exists, skipped: ${word}`);
        skippedCount++;
        continue;
      }

      // Add new CVC word
      try {
        await addCvcWord({
          word,
          category,
          updatedAt: new Date().toISOString(),
        });
        addedCount++;
        processedCount++;
      } catch (error) {
        toast.error(`Row ${i + 1}: Failed to add word "${word}" - ${error.message}`);
        errorCount++;
      }
    }

    uploadProgress.value = '100%';
    
    // Summary notification
    toast.success(
      `Upload complete! ✅ Added: ${addedCount} | ⏭️ Skipped: ${skippedCount} | ❌ Errors: ${errorCount}`,
      { timeout: 5000 }
    );

    emit('saved');
  } catch (err) {
    console.error('❌ Error processing Excel file:', err);
    toast.error('Failed to process the file. Check console for details.');
  } finally {
    isUploading.value = false;
    uploadProgress.value = '0%';
  }
};

// Clear selected file
const clearFile = () => {
  selectedFileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.95) translateY(-20px);
}

.modal-fade-enter-to > div,
.modal-fade-leave-from > div {
  transform: scale(1) translateY(0);
}
</style>

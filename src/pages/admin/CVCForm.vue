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
          class="text-blue-600 hover:text-blue-800 transition-colors"
          title="Show Excel format information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <!-- Info Panel -->
      <transition name="slide-fade">
        <div v-if="showExcelInfo" class="mb-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
          <h4 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            📋 Excel File Requirements
          </h4>
          <ul class="text-sm text-gray-600 space-y-2 ml-4">
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span><strong>Column 1: "CVC Word"</strong> - Must contain exactly 3-letter words following Consonant-Vowel-Consonant pattern (e.g., CAT, DOG, PIG, SUN)</span>
            </li>
            <li class="flex items-start">
              <span class="text-purple-500 mr-2">•</span>
              <span><strong>Column 2: "Category"</strong> - Category name (minimum 2 characters). New categories are automatically created if they don't exist.</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span><strong>File Format:</strong> .xlsx or .xls file</span>
            </li>
            <li class="flex items-start">
              <span class="text-red-500 mr-2">•</span>
              <span><strong>Validation Rules:</strong></span>
            </li>
            <ul class="ml-6 mt-1 space-y-1 text-xs text-gray-500">
              <li>✓ Words must be exactly 3 characters long</li>
              <li>✓ Words must follow CVC pattern (Consonant-Vowel-Consonant)</li>
              <li>✓ Duplicate words will be skipped (case-insensitive)</li>
              <li>✓ Category names must be at least 2 characters</li>
              <li>✓ Categories are matched case-insensitively</li>
            </ul>
          </ul>
          <div class="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-xs font-semibold text-gray-700 mb-1">Example Format:</p>
            <table class="text-xs w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-2 py-1">CVC Word</th>
                  <th class="border border-gray-300 px-2 py-1">Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-2 py-1">CAT</td>
                  <td class="border border-gray-300 px-2 py-1">Animals</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-2 py-1">DOG</td>
                  <td class="border border-gray-300 px-2 py-1">Animals</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-2 py-1">SUN</td>
                  <td class="border border-gray-300 px-2 py-1">Nature</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>

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
/* Slide fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

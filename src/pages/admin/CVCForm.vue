<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-purple-700">
        {{ isEditing ? "✏️ Edit CVC Word" : "🆕 Add CVC Word" }}
      </h2>
      <button
        @click="$emit('cancel')"
        class="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
      >
        ✖ Cancel
      </button>
    </div>

    <!-- Word Input -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Word</label>
      <input
        v-model="form.word"
        type="text"
        maxlength="3"
        placeholder="Enter 3-letter CVC word"
        class="w-full p-3 border rounded-xl text-center font-bold text-2xl tracking-widest uppercase"
      />
    </div>

    <!-- Category Select -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
      <select
        v-model="form.category"
        class="w-full p-3 border rounded-xl"
      >
        <option disabled value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Audio Upload Section -->
    <div class="space-y-4">
      <!-- Full Word Audio -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          🔊 Full Word Audio
        </label>
        <input
          ref="fullAudioInput"
          type="file"
          accept="audio/*"
          class="hidden"
          @change="handleAudioUpload('full', $event)"
        />
        <button
          type="button"
          @click="triggerFullAudio"
          class="w-full px-4 py-3 border-2 border-dashed border-purple-400 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-purple-700 font-semibold flex items-center justify-center gap-2"
        >
          📤 Click to upload or drag audio file
        </button>
        <p v-if="form.audios.full" class="text-green-600 mt-1 text-sm">
          ✅ Full audio ready: {{ form.audios.full.name || 'Uploaded file' }}
        </p>
      </div>

      <!-- Letter Audios -->
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(letter, index) in 3"
          :key="index"
          class="flex flex-col items-center p-3 border rounded-xl"
        >
          <span
            class="text-lg font-semibold mb-2"
            :class="getLetterColor(index)"
          >
            {{ getLetterLabel(index) }}
          </span>
          <input
            :ref="el => (letterAudioInputs[index] = el)"
            type="file"
            accept="audio/*"
            class="hidden"
            @change="handleAudioUpload(`letter${index + 1}`, $event)"
          />
          <button
            type="button"
            @click="triggerLetterAudio(index)"
            class="w-full px-3 py-2 border-2 border-dashed rounded-lg hover:bg-opacity-10 transition-all font-semibold text-sm"
            :class="getLetterButtonStyle(index)"
          >
            📤 Upload
          </button>
          <p v-if="form.audios.letters[index]" class="text-green-600 mt-1 text-xs text-center">
            ✅ Uploaded: {{ form.audios.letters[index].name || 'File ready' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-center pt-4">
      <button
        @click="saveWord"
        class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition"
      >
        💾 {{ isEditing ? "Update Word" : "Save Word" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { uploadCvcAudio, addCvcWord, updateCvcWord } from '../../services/firebaseCVC'
import { useToast } from 'vue-toastification';

const props = defineProps({
  wordData: { type: Object, default: null },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['saved', 'cancel'])

// Form Data
const form = ref({
  word: props.wordData?.word || '',
  category: props.wordData?.category || '',
  audios: { full: null, letters: [null, null, null] }
})

const isEditing = computed(() => !!props.wordData)
const fullAudioInput = ref(null)
const letterAudioInputs = ref([null, null, null])
const toast = useToast()

// Force uppercase + limit to 3 letters
watch(
  () => form.value.word,
  newWord => {
    if (newWord) form.value.word = newWord.toUpperCase().slice(0, 3)
  }
)

// Handle Upload Input
const handleAudioUpload = (type, e) => {
  const file = e.target.files[0]
  if (!file) return

  if (type === 'full') {
    form.value.audios.full = file
  } else if (type.startsWith('letter')) {
    const index = parseInt(type.replace('letter', ''), 10) - 1
    if (index >= 0 && index < 3) {
      form.value.audios.letters[index] = file
    }
  }
  e.target.value = ''
}

// Trigger Upload Inputs
const triggerFullAudio = () => fullAudioInput.value?.click()
const triggerLetterAudio = index => letterAudioInputs.value[index]?.click()

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
    if (!form.value.word.trim() || form.value.word.length !== 3 || !isCVCWord(form.value.word)) {
      toast.error('Please enter a valid 3-letter CVC word (Consonant-Vowel-Consonant).')
      return
    }
    if (!form.value.category.trim()) {
      toast.error('Category is required.')
      return
    }
    if (!form.value.audios.full || form.value.audios.letters.some(a => !a)) {
      toast.error('Please upload all audio files.')
      return
    }

    // Upload files to Firebase Storage
    const fullUrl = await uploadCvcAudio(form.value.audios.full, `cvc/${form.value.word}/full.mp3`)
    const letterUrls = await Promise.all(
      form.value.audios.letters.map((f, i) =>
        uploadCvcAudio(f, `cvc/${form.value.word}/letter_${i + 1}.mp3`)
      )
    )

    const payload = {
      word: form.value.word,
      category: form.value.category,
      audios: { full: fullUrl, letters: letterUrls },
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
      category: '',
      audios: { full: null, letters: [null, null, null] }
    }
  } catch (err) {
    console.error('❌ Error saving CVC word:', err)
    toast.error('Upload failed. Check console for details.')
  }
}
</script>

<style scoped>
/* optional subtle animations or hover effects */
</style>

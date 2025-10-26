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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { addCvcWord, updateCvcWord } from '../../services/firebaseCVC'
import { useToast } from 'vue-toastification';

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
    if (!form.value.word.trim() || form.value.word.length !== 3 || !isCVCWord(form.value.word)) {
      toast.error('Please enter a valid 3-letter CVC word (Consonant-Vowel-Consonant).')
      return
    }
    if (!form.value.category.trim()) {
      toast.error('Category is required.')
      return
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
    toast.error('Upload failed. Check console for details.')
  }
}
</script>

<style scoped>
/* optional subtle animations or hover effects */
</style>

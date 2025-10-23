<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header with animated title -->
      <div class="mb-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          {{ isEditing ? '✏️ Edit CVC Word' : '➕ Add New CVC Word' }}
        </h2>
        <p class="text-gray-700 text-lg">{{ isEditing ? 'Update the word details below' : 'Create a new sight word for kids to learn' }}</p>
      </div>

      <!-- Form Card -->
      <form @submit.prevent="saveWord" class="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        <!-- Word Input -->
        <div class="space-y-2">
          <label class="block text-lg font-bold text-purple-700">
            📝 Word
          </label>
          <input 
            v-model="form.word" 
            type="text" 
            placeholder="Enter the CVC word (e.g., cat, dog, sit)"
            class="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all text-lg" 
            required 
          />
          <p class="text-sm text-gray-600">Enter a 3-letter consonant-vowel-consonant word</p>
        </div>

        <!-- Category Input -->
        <div class="space-y-2">
          <label class="block text-lg font-bold text-purple-700">
            🏷️ Category
          </label>
          <input 
            v-model="form.category" 
            type="text" 
            placeholder="e.g., Animals, Actions, Objects"
            class="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all text-lg" 
          />
          <p class="text-sm text-gray-600">Organize words by category for better learning</p>
        </div>

        <!-- Full Word Audio -->
        <div class="space-y-2">
          <label class="block text-lg font-bold text-purple-700">
            🔊 Full Word Audio
          </label>
          <div class="relative">
            <input 
              ref="fullAudio" 
              type="file" 
              accept="audio/*"
              class="hidden" 
              @change="handleAudioUpload('full', $event)"
            />
            <button
              type="button"
              @click="$refs.fullAudio.click()"
              class="w-full px-4 py-3 border-2 border-dashed border-purple-400 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-purple-700 font-semibold flex items-center justify-center gap-2"
            >
              📤 Click to upload or drag audio file
            </button>
          </div>
          <p class="text-sm text-gray-600">Upload the audio pronunciation of the complete word</p>
        </div>

        <!-- Letter Audios Section -->
        <div class="space-y-4">
          <label class="block text-lg font-bold text-purple-700">
            🔤 Letter Audios
          </label>
          <p class="text-sm text-gray-600 mb-4">Upload individual letter pronunciations to help kids learn phonics</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(letter, index) in 3" :key="index" class="space-y-2">
              <label class="block text-base font-bold" :class="getLetterColor(index)">
                {{ index + 1 }}️⃣ {{ getLetterLabel(index) }}
              </label>
              <div class="relative">
                <input 
                  :ref="`letterAudio${index}`" 
                  type="file" 
                  accept="audio/*"
                  class="hidden" 
                  @change="handleAudioUpload(`letter${index}`, $event)"
                />
                <button
                  type="button"
                  @click="$refs[`letterAudio${index}`].click()"
                  class="w-full px-3 py-2 border-2 border-dashed rounded-lg hover:bg-opacity-10 transition-all font-semibold text-sm"
                  :class="getLetterButtonStyle(index)"
                >
                  📤 Upload
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t-2 border-gray-200">
          <button 
            type="button" 
            @click="$emit('cancel')" 
            class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95"
          >
            ❌ Cancel
          </button>
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            ✅ Save Word
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { uploadCvcAudio, addCvcWord, updateCvcWord } from '../../services/firebaseCVC';

export default {
  name: 'CVCForm',
  props: {
    wordData: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      word: props.wordData?.word || '',
      category: props.wordData?.category || '',
      audios: {
        full: null,
        letters: [null, null, null]
      }
    });

    const fullAudio = ref(null);
    const letterAudio1 = ref(null);
    const letterAudio2 = ref(null);
    const letterAudio3 = ref(null);

    const isEditing = computed(() => !!props.wordData);

    const handleAudioUpload = (type, event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'full') {
            form.value.audios.full = e.target.result;
          } else {
            const index = parseInt(type.replace('letter', ''), 10);
            form.value.audios.letters[index] = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const getLetterColor = (index) => {
      return [
        'text-pink-600',
        'text-blue-600',
        'text-green-600'
      ][index];
    };

    const getLetterButtonStyle = (index) => {
      return [
        'border-pink-300 hover:border-pink-600 hover:bg-pink-50 text-pink-700',
        'border-blue-300 hover:border-blue-600 hover:bg-blue-50 text-blue-700',
        'border-green-300 hover:border-green-600 hover:bg-green-50 text-green-700'
      ][index];
    };

    const getLetterLabel = (index) => {
      return ['First Letter', 'Second Letter', 'Third Letter'][index];
    };

    const saveWord = async () => {
      try {
        // Validation
        if (!form.value.word.trim()) {
          alert('Word field is required.');
          return;
        }

        if (!form.value.category.trim()) {
          alert('Category field is required.');
          return;
        }

        if (!fullAudio.value?.files[0]) {
          alert('Full word audio is required.');
          return;
        }

        if (!letterAudio1.value?.files[0] || !letterAudio2.value?.files[0] || !letterAudio3.value?.files[0]) {
          alert('All letter audios are required.');
          return;
        }

        const audios = {
          full: null,
          letters: []
        };

        if (fullAudio.value?.files[0]) {
          audios.full = await uploadCvcAudio(fullAudio.value.files[0], `cvc/${form.value.word}/full.mp3`);
        }

        if (letterAudio1.value?.files[0]) {
          audios.letters.push(await uploadCvcAudio(letterAudio1.value.files[0], `cvc/${form.value.word}/letter_1.mp3`));
        }
        if (letterAudio2.value?.files[0]) {
          audios.letters.push(await uploadCvcAudio(letterAudio2.value.files[0], `cvc/${form.value.word}/letter_2.mp3`));
        }
        if (letterAudio3.value?.files[0]) {
          audios.letters.push(await uploadCvcAudio(letterAudio3.value.files[0], `cvc/${form.value.word}/letter_3.mp3`));
        }

        if (isEditing.value) {
          await updateCvcWord(props.wordData.id, { ...form.value, audios });
        } else {
          await addCvcWord({ ...form.value, audios });
        }

        emit('saved');
      } catch (error) {
        console.error('Error saving CVC word:', error);
      }
    };

    return {
      form,
      fullAudio,
      letterAudio1,
      letterAudio2,
      letterAudio3,
      isEditing,
      handleAudioUpload,
      getLetterColor,
      getLetterButtonStyle,
      getLetterLabel,
      saveWord
    };
  }
};
</script>

<style scoped>
.cvc-form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>


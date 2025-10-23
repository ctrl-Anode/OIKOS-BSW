<template>
  <div class="learn-cvc-view">
    <h1 class="text-2xl font-bold mb-6">Learn CVC Words</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="word in words"
        :key="word.id"
        class="cvc-word-card border rounded-lg p-4 shadow-md fade-in"
      >
        <h2 class="text-xl font-bold mb-2 bounce-in">{{ word.word }}</h2>

        <div class="flex gap-2 mb-4">
          <button
            v-for="(letter, index) in word.word.split('')"
            :key="index"
            class="letter-btn hover-scale"
            @click="playLetter(word.audios.letters[index], letter)"
          >
            {{ letter }}
          </button>
        </div>

        <div class="flex justify-between items-center">
          <button
            class="play-btn hover-bg"
            @click="playFullWord(word.audios.full, word.word)"
          >
            Play Word
          </button>
          <button
            class="add-btn hover-bg"
            @click="addToBucket(word)"
          >
            Add to Bucket
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center">
      <button class="random-word-btn" @click="fetchRandomWord">
        🎲 Draw CVC Word
      </button>
    </div>

    <div class="word-bucket-sidebar">
      <h2 class="text-xl font-bold mb-4">Word Bucket</h2>

      <div v-if="wordBucket.length === 0" class="text-center text-gray-500">
        Your bucket is empty.
      </div>

      <ul v-else class="space-y-4">
        <li v-for="word in wordBucket" :key="word.id" class="bucket-item">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">{{ word.word }}</h3>
              <button
                class="play-btn"
                @click="playFullWord(word.audios.full, word.word)"
              >
                Play Word
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
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllCvcWords, addWordToBucket, removeWordFromBucket } from '../../services/firebaseCVC';
import { audioEngine } from '../../services/audioEngine';
import { auth } from '../../firebase'; // Import auth from firebase service

export default {
  name: 'LearnCVCView',
  setup() {
    const words = ref([]);
    const wordBucket = ref([]);

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
      const userId = auth.currentUser?.uid; // Ensure userId is fetched correctly
      if (!userId) {
        console.error('User is not authenticated. Cannot add to bucket.');
        return;
      }

      try {
        await addWordToBucket(userId, word);
        wordBucket.value.push(word);
      } catch (error) {
        console.error('Error adding word to bucket:', error);
      }
    };

    const removeFromBucket = async (wordId) => {
      await removeWordFromBucket(wordId);
      wordBucket.value = wordBucket.value.filter((word) => word.id !== wordId);
    };

    const preloadRandomWordAudios = async (randomWords) => {
      await audioEngine.preloadRandomWordAudios(randomWords);
    };

    const fetchRandomWord = async () => {
      try {
        const allWords = await getAllCvcWords();
        if (allWords.length > 0) {
          const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
          await preloadRandomWordAudios([randomWord]);
          alert(`Random Word: ${randomWord.word}`);
        } else {
          alert('No words available to draw.');
        }
      } catch (error) {
        console.error('Error fetching random word:', error);
      }
    };

    onMounted(fetchWords);

    return {
      words,
      wordBucket,
      playFullWord,
      playLetter,
      addToBucket,
      removeFromBucket,
      fetchRandomWord
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
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
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
.add-btn {
  background-color: #60a5fa;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.add-btn:hover {
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
</style>
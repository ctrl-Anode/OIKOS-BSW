<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <!-- Topbar -->
    <div v-if="user" class="flex items-center justify-between px-8 py-4 bg-white bg-opacity-80 shadow-md">
      <div class="text-2xl font-bold text-purple-700">Sight Words Hub</div>
      <div class="flex items-center gap-4">
        <img
          v-if="userAvatar"
          :src="getAvatarUrl(userAvatar)"
          alt="Avatar"
          class="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <span class="font-bold text-lg text-gray-800">{{ user.displayName || 'User' }}</span>
        <button @click="logout" class="btn ml-6">Logout</button>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center py-20">
      <div class="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        <h2 class="text-4xl font-black text-purple-700 mb-10">Sight Words Learning Hub</h2>
        <div v-for="word in sightWords" :key="word.text" class="mb-10">
          <div
            class="text-3xl font-bold mb-2 cursor-pointer select-none inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 shadow"
            @click="speakWord(word.text)"
            @touchstart="startTouch($event, word.text)"
            @touchend="endTouch($event, word.text)"
            @mousedown="startMouse($event, word.text)"
            @mouseup="endMouse($event, word.text)"
          >
            <span
              v-for="(letter, idx) in word.text.split('')"
              :key="idx"
              class="inline-block mx-1 cursor-pointer"
              @click.stop="speakLetter(letter)"
            >{{ letter }}</span>
          </div>
          <Phonetics :phonetics="word.phonetics" />
        </div>
        <p class="text-xl mb-8">Tap a word to hear it. Tap a letter for its sound. Swipe a word to hear it again. Tap a phonetic for its sound.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import Phonetics from '../../components/Phonetics.vue'
import sightWords from '../../components/SightWords.js'

const user = ref(null)
const userAvatar = ref('')
const router = useRouter()

// --- Speech Synthesis ---
function speakWord(word) {
  speak(word)
}
function speakLetter(letter) {
  speak(letter)
}
function speakPhonetic(ph) {
  speak(ph)
}
function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utter = new window.SpeechSynthesisUtterance(text)
    utter.rate = 0.7
    window.speechSynthesis.speak(utter)
  }
}

// --- Swipe Detection ---
let touchStartX = 0
let mouseDownX = 0
function startTouch(e) {
  touchStartX = e.changedTouches[0].screenX
}
function endTouch(e, word) {
  const touchEndX = e.changedTouches[0].screenX
  if (Math.abs(touchEndX - touchStartX) > 50) {
    speakWord(word)
  }
}
function startMouse(e) {
  mouseDownX = e.screenX
}
function endMouse(e, word) {
  if (Math.abs(e.screenX - mouseDownX) > 50) {
    speakWord(word)
  }
}

function getAvatarUrl(filename) {
  return new URL(`../../assets/avatars/${filename}`, import.meta.url).href
}

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (!u) {
      router.push('/login')
    } else {
      // Load user's avatar from Firestore
      const userRef = doc(db, 'users', u.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists() && userSnap.data().avatar) {
        userAvatar.value = userSnap.data().avatar
      }
    }
  })
})

function logout() {
  signOut(auth).then(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
.btn {
  background: linear-gradient(to right, #a7f3d0, #60a5fa);
  color: #fff;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: transform 0.2s;
}
.btn:hover {
  transform: scale(1.05);
}
.phonetic-btn {
  background: #e0e7ff;
  color: #4f46e5;
  font-weight: bold;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.phonetic-btn:hover {
  background: #c7d2fe;
}
</style>
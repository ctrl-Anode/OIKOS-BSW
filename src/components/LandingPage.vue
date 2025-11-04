<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <!-- Header -->
    <header class="bg-purple-700 text-white py-3 px-4 sm:py-4 sm:px-6 shadow-md">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-bold text-center sm:text-left">TinyTalkers</h1>
        <nav>
          <ul class="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 text-sm sm:text-base">
            <li><a href="#features" class="hover:underline">Features</a></li>
            <li><a href="#how-it-works" class="hover:underline">How It Works</a></li>
            <li><a href="#why-kids-love-it" class="hover:underline">Why Kids Love It</a></li>
            <li><a href="#for-grownups" class="hover:underline">For Grown‑ups</a></li>
          </ul>
        </nav>
        <button @click="installPWA" v-if="deferredPrompt" class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">Download App</button>
      </div>
    </header>

    <!-- Hero Section -->
    <header class="px-4 sm:px-6 py-10 text-center">
      <div class="animate-bounce-slow mb-4 sm:mb-6">
        <div class="inline-block text-6xl sm:text-8xl">📚</div>
      </div>
      <h1 class="text-4xl sm:text-6xl font-black text-white mb-3 sm:mb-4 drop-shadow-lg animate-fade-in">
        Learn CVC Words the Fun Way!
      </h1>
      <p class="text-lg sm:text-2xl font-bold text-purple-800 mb-6 sm:mb-8 animate-slide-up">
        Tap letter sounds, draw new words, and build your own Word Bucket.
      </p>
      <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
        <button
          @click="goToHub"
          class="bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg sm:text-2xl font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-green-400/50 animate-pulse-slow"
        >
          {{ isLoggedIn ? 'Continue Learning' : 'Try it now' }} 🚀
        </button>
        <button
          v-if="!isLoggedIn"
          @click="goToRegister"
          class="bg-purple-700 text-white text-lg sm:text-2xl font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-2xl hover:scale-105 transform transition-all duration-300"
        >
          Create free account
        </button>
      </div>
    </header>

    <main class="px-4 sm:px-6 py-10 sm:py-12 max-w-6xl mx-auto">
      <!-- Features -->
      <h2 id="features" class="text-3xl sm:text-5xl font-black text-center text-purple-800 mb-8 sm:mb-12">
        What you can do ✨
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16"> 
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white rounded-3xl p-6 sm:p-8 transition-all duration-300 border-4 border-purple-300"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-wiggle" :class="feature.animationClass">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-purple-700 mb-2 sm:mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-base sm:text-lg text-gray-700 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <!-- How It Works -->
      <section id="how-it-works" class="bg-white rounded-3xl p-6 sm:p-12 shadow-2xl mb-16 border-4 border-yellow-300">
        <h2 class="text-3xl sm:text-4xl font-black text-center text-orange-600 mb-6 sm:mb-8">
          How It Works! 🎯
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="text-5xl sm:text-6xl mb-3 sm:mb-4 inline-block animate-bounce" :style="{ animationDelay: `${index * 0.2}s` }">
              {{ step.icon }}
            </div>
            <div class="text-4xl sm:text-5xl font-black text-purple-600 mb-1">{{ index + 1 }}</div>
            <p class="text-lg sm:text-xl font-bold text-gray-800">{{ step.text }}</p>
          </div>
        </div>
      </section>

      <!-- Why Kids Love It -->
      <section id="why-kids-love-it" class="mb-16">
        <h2 class="text-3xl sm:text-5xl font-black text-center text-pink-700 mb-8 sm:mb-12">
          Why Kids Love It! 💖
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div 
            v-for="(benefit, index) in benefits" 
            :key="index"
            class="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-3 sm:gap-4 duration-300"
          >
            <div class="text-3xl sm:text-4xl animate-spin-slow">{{ benefit.icon }}</div>
            <p class="text-lg sm:text-xl font-bold text-purple-900">{{ benefit.text }}</p>
          </div>
        </div>
      </section>

      <!-- For Grown-ups / Teachers -->
      <section id="for-grownups" class="bg-gradient-to-r from-blue-300 to-green-300 rounded-3xl p-6 sm:p-12 shadow-2xl mb-16">
        <h2 class="text-3xl sm:text-4xl font-black text-center text-blue-900 mb-6 sm:mb-8">
          Built for Everyone 🌈
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div v-for="(info, index) in grownups" :key="index" class="flex items-start gap-3 sm:gap-4">
            <div class="text-2xl sm:text-3xl">{{ info.icon }}</div>
            <div>
              <h3 class="text-lg sm:text-xl font-black text-blue-900 mb-1">{{ info.title }}</h3>
              <p class="text-base sm:text-lg text-blue-800">{{ info.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="text-center bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <h2 class="text-3xl sm:text-5xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg">
          Ready to Become a Reading Star? ⭐
        </h2>
        <p class="text-lg sm:text-2xl text-white mb-6 sm:mb-8 font-bold">
          Start exploring CVC words with phonics and your own Word Bucket.
        </p>
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            @click="goToHub"
            class="bg-white text-orange-600 text-xl sm:text-3xl font-black px-10 sm:px-16 py-3 sm:py-5 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-white/50"
          >
            {{ isLoggedIn ? 'Go to Hub' : "Try it now" }} 🎊
          </button>
          <button
            v-if="!isLoggedIn"
            @click="goToLogin"
            class="bg-white/20 border-2 border-white text-white text-xl sm:text-3xl font-black px-10 sm:px-16 py-3 sm:py-5 rounded-full shadow-2xl hover:scale-105 transform transition-all duration-300"
          >
            Sign in
          </button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-purple-800 text-white py-6 sm:py-8 text-center mt-12 sm:mt-16">
      <p class="text-lg sm:text-xl font-bold mb-1 sm:mb-2">© 2025 TinyTalkers</p>
      <p class="text-sm sm:text-lg">Built with 💜 for young learners everywhere!</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const isLoggedIn = ref(false)
let unsubscribeAuth = null

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})

const features = ref([
  { icon: '🪄', title: 'Draw CVC Word', description: 'Pick a new word from your selected categories with one tap.', animationClass: 'animate-wiggle' },
  { icon: '👆🏼', title: 'Tap Letter Sounds', description: 'Touch each letter to hear its phonetic sound.', animationClass: 'animate-pulse' },
  { icon: '🦻', title: 'Hear the Whole Word', description: 'Play the full word with clear, friendly speech.', animationClass: 'animate-bounce' },
  { icon: '🪣', title: 'My Word Bucket', description: 'Save drawn words automatically when signed in.', animationClass: 'animate-wiggle' },
  { icon: '🧰', title: 'Word Pool & Filters', description: 'Browse the pool and filter by categories (or choose All).', animationClass: 'animate-pulse' },
  { icon: '📱', title: 'Touch Friendly', description: 'Swipe the teaching card to replay the word on mobile.', animationClass: 'animate-bounce' }
])

const steps = ref([
  { icon: '☑️', text: 'Choose categories' },
  { icon: '🪄', text: 'Draw a CVC word' },
  { icon: '👉🏼', text: 'Tap letters for sounds' },
  { icon: '🔊', text: 'Play the whole word' },
  { icon: '🪣', text: 'Save to your bucket' },
  { icon: '📱', text: 'Enjoy and Learn' }
])

const benefits = ref([
  { icon: '⚡', text: 'Fast and snappy UI' },
  { icon: '🎨', text: 'Bright, kid‑friendly design' },
  { icon: '🔒', text: 'Private buckets by account' },
  { icon: '🌟', text: 'Simple, focused learning flow' },
  { icon: '📱', text: 'Works great on phones & tablets' },
  { icon: '🔄', text: 'Updates to the word pool over time' }
])

const grownups = ref([
  { icon: '🗃️', title: 'Organized by Category', description: 'Create focused lessons by filtering to specific CVC categories.' },
  { icon: '🧩', title: 'Bucket + Pool Model', description: 'Learners draw words and build personal lists they can revisit.' },
  { icon: '🛡️', title: 'Account‑based Saving', description: 'Words added to a bucket are tied to the signed‑in account.' },
  
])

function goToHub() {
  router.push('/app/hub')
}
function goToLogin() {
  router.push('/login')
}
function goToRegister() {
  router.push('/register')
}

const deferredPrompt = ref(null)

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt.value = e
})

function installPWA() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt')
      } else {
        console.log('User dismissed the A2HS prompt')
      }
      deferredPrompt.value = null
    })
  }
}
</script>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
.animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
.animate-fade-in { animation: fade-in 1s ease-out; }
.animate-slide-up { animation: slide-up 0.8s ease-out; }
.animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
</style>

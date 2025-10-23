<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <!-- Header -->
    <header class="bg-purple-700 text-white py-4 px-6 shadow-md">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Sight Word Buddy</h1>
        <nav>
          <ul class="flex gap-4 text-sm md:text-base">
            <li><a href="#features" class="hover:underline">Features</a></li>
            <li><a href="#how-it-works" class="hover:underline">How It Works</a></li>
            <li><a href="#why-kids-love-it" class="hover:underline">Why Kids Love It</a></li>
            <li><a href="#accessibility" class="hover:underline">Accessibility</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <header class="px-6 py-12 text-center">
      <div class="animate-bounce-slow mb-6">
        <div class="inline-block text-8xl">📚</div>
      </div>
      <h1 class="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg animate-fade-in">
        Sight Word Buddy!
      </h1>
      <p class="text-2xl md:text-3xl font-bold text-purple-800 mb-8 animate-slide-up">
        Learn words the fun way! 🎉
      </p>
      <button 
        @click="navigateToApp"
        class="bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-bold px-12 py-4 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-green-400/50 animate-pulse-slow"
      >
        Start Learning! 🚀
      </button>
    </header>

    <main class="px-6 py-12 max-w-6xl mx-auto">
      <h2 id="features" class="text-4xl md:text-5xl font-black text-center text-purple-800 mb-12">
        Amazing Features! ✨
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> 
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4 border-purple-300"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="text-6xl mb-4 animate-wiggle" :class="feature.animationClass">
            {{ feature.icon }}
          </div>
          <h3 class="text-2xl font-black text-purple-700 mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-lg text-gray-700 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <section id="how-it-works" class="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-16 border-4 border-yellow-300">
        <h2 class="text-4xl font-black text-center text-orange-600 mb-8">
          How It Works! 🎯
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="text-6xl mb-4 inline-block animate-bounce" :style="{ animationDelay: `${index * 0.2}s` }">
              {{ step.icon }}
            </div>
            <div class="text-5xl font-black text-purple-600 mb-2">{{ index + 1 }}</div>
            <p class="text-xl font-bold text-gray-800">{{ step.text }}</p>
          </div>
        </div>
      </section>

      <section id="why-kids-love-it" class="mb-16">
        <h2 class="text-4xl md:text-5xl font-black text-center text-pink-700 mb-12">
          Why Kids Love It! 💖
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(benefit, index) in benefits" 
            :key="index"
            class="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 shadow-lg flex items-center gap-4 hover:scale-105 transition-transform duration-300"
          >
            <div class="text-4xl animate-spin-slow">{{ benefit.icon }}</div>
            <p class="text-xl font-bold text-purple-900">{{ benefit.text }}</p>
          </div>
        </div>
      </section>

      <section id="accessibility" class="bg-gradient-to-r from-blue-300 to-green-300 rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
        <h2 class="text-4xl font-black text-center text-blue-900 mb-8">
          Built for Everyone! 🌈
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(access, index) in accessibility" :key="index" class="flex items-start gap-4">
            <div class="text-3xl">{{ access.icon }}</div>
            <div>
              <h3 class="text-xl font-black text-blue-900 mb-1">{{ access.title }}</h3>
              <p class="text-lg text-blue-800">{{ access.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="text-center bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl p-12 shadow-2xl">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
          Ready to Become a Reading Star? ⭐
        </h2>
        <p class="text-2xl text-white mb-8 font-bold">
          Join thousands of kids learning sight words every day!
        </p>
        <button 
          @click="navigateToApp"
          class="bg-white text-orange-600 text-3xl font-black px-16 py-5 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-white/50"
        >
          Let's Go! 🎊
        </button>
      </section>
    </main>

    <footer class="bg-purple-800 text-white py-8 text-center mt-16">
      <p class="text-xl font-bold mb-2">© 2025 Sight Word Buddy</p>
      <p class="text-lg">Built with 💜 for young learners everywhere!</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  {
    icon: '🔤',
    title: 'Phonics Fun',
    description: 'Click on letters to hear their sounds and learn phonics interactively!',
    animationClass: 'animate-wiggle'
  },
  {
    icon: '🔊',
    title: 'Word Sounds',
    description: 'Tap on words to hear them spoken aloud with clear pronunciation.',
    animationClass: 'animate-pulse'
  },
  {
    icon: '👆',
    title: 'Swipe to Learn',
    description: 'Swipe words for pronunciation guides with slowed or segmented audio.',
    animationClass: 'animate-bounce'
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'See how many words you\'ve mastered and keep improving every day!',
    animationClass: 'animate-wiggle'
  },
  {
    icon: '🎮',
    title: 'Easy Controls',
    description: 'Play, pause, and replay audio anytime. Simple controls for little hands!',
    animationClass: 'animate-pulse'
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Use on phones, tablets, or computers. Touch or click - both work great!',
    animationClass: 'animate-bounce'
  }
])

const steps = ref([
  { icon: '👀', text: 'See a word' },
  { icon: '👆', text: 'Click or tap it' },
  { icon: '🎵', text: 'Hear it speak!' }
])

const benefits = ref([
  { icon: '⚡', text: 'Super fast - no waiting!' },
  { icon: '🎨', text: 'Colorful and fun design' },
  { icon: '🔒', text: 'Safe and secure for kids' },
  { icon: '🌟', text: 'Visual cues and animations' },
  { icon: '⌨️', text: 'Keyboard friendly too!' },
  { icon: '🔄', text: 'Always improving!' }
])

const accessibility = ref([
  {
    icon: '♿',
    title: 'Screen Reader Support',
    description: 'Works perfectly with assistive technologies'
  },
  {
    icon: '🎯',
    title: 'WCAG Compliant',
    description: 'Meets accessibility standards for all learners'
  },
  {
    icon: '🎨',
    title: 'High Contrast',
    description: 'Easy to see colors and clear text for everyone'
  },
  {
    icon: '🗣️',
    title: 'Text-to-Speech',
    description: 'Backup audio system works on all devices'
  }
])

function navigateToApp() {
  router.push('/register')
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
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-wiggle {
  animation: wiggle 2s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
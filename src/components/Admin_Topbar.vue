<template>
  <header class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <!-- Left: Branding -->
      <div class="flex items-center gap-3">
        <div class="text-3xl sm:text-4xl">📚</div>
        <div class="leading-tight">
          <h1 class="text-lg sm:text-2xl font-bold tracking-wide">Admin Panel</h1>
          <p class="text-indigo-100 text-xs sm:text-sm">Sight Word Buddy Management</p>
        </div>
      </div>

      <!-- Right: Desktop View -->
      <div class="hidden sm:flex items-center gap-4">
        <div class="text-right">
          <p class="text-xs text-indigo-100">Welcome back</p>
          <p class="font-semibold text-sm sm:text-base">{{ adminName || 'Administrator' }}</p>
        </div>

        <div
          class="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center border border-white/20 shadow-md"
        >
          <img
            v-if="adminAvatar"
            :src="getAvatarUrl(adminAvatar)"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-lg font-bold">{{ (adminName || 'A')[0] }}</span>
        </div>

        <button
          @click="$emit('logout-request')"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all text-sm shadow-md"
        >
          Log Out
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="sm:hidden">
        <button
          @click="toggleMenu"
          class="p-2 rounded-md bg-white/20 hover:bg-white/30 transition-all"
        >
          <svg
            v-if="!menuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16m0 6H4" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition name="slide-fade">
      <div
        v-if="menuOpen"
        class="sm:hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 px-6 py-4 space-y-3 text-sm border-t border-white/20"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white/30"
          >
            <img
              v-if="adminAvatar"
              :src="getAvatarUrl(adminAvatar)"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span v-else class="font-bold text-white">{{ (adminName || 'A')[0] }}</span>
          </div>
          <div>
            <p class="text-xs text-indigo-100">Welcome back</p>
            <p class="font-semibold text-white">{{ adminName || 'Administrator' }}</p>
          </div>
        </div>

        <button
          @click="$emit('logout-request')"
          class="w-full mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-md"
        >
          Log Out
        </button>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  adminName: String,
  adminAvatar: String,
  getAvatarUrl: Function
});

defineEmits(['logout-request']);

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
</script>

<style scoped>
/* Smooth mobile dropdown animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

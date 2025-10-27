<template>
  <header
    v-if="user"
    class="flex flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white bg-opacity-80 shadow-md backdrop-blur-md fixed top-0 left-0 w-full z-20"
  >
    <!-- Title -->
    <div
      class="text-xl sm:text-2xl font-bold text-purple-700"
    >
      TinyTalkers
    </div>

    <!-- Desktop User Info -->
    <div class="hidden sm:flex items-center gap-4">
      <span
        class="font-semibold text-lg text-gray-800"
      >
        {{ user.displayName || "User" }}
      </span>

      <img
        v-if="userAvatar"
        :src="getAvatarUrl(userAvatar)"
        alt="Avatar"
        class="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
      />

      <button @click="logout" class="btn">Logout</button>
    </div>

    <!-- Mobile User Menu -->
    <div class="sm:hidden relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <img
          v-if="userAvatar"
          :src="getAvatarUrl(userAvatar)"
          alt="Avatar"
          class="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
        />
        <svg
          class="w-5 h-5 text-gray-600 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <transition name="dropdown">
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-30"
        >
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm text-gray-500">Signed in as</p>
            <p class="font-semibold text-gray-800 truncate">
              {{ user.displayName || "User" }}
            </p>
            <p class="text-xs text-gray-500 truncate mt-1">
              {{ user.email }}
            </p>
          </div>
          <button
            @click="logout"
            class="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 text-red-600 font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </transition>
    </div>

    <!-- Backdrop for mobile dropdown -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="sm:hidden fixed inset-0 bg-black/20 z-10"
    ></div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";

const user = ref(null);
const userAvatar = ref("");
const isDropdownOpen = ref(false);
const router = useRouter();

function getAvatarUrl(filename) {
  return new URL(`../assets/avatars/${filename}`, import.meta.url).href;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u;
    if (!u) {
      router.push("/login");
    } else {
      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().avatar) {
        userAvatar.value = userSnap.data().avatar;
      }
    }
  });
});

function logout() {
  closeDropdown();
  signOut(auth).then(() => {
    router.push("/login");
  });
}
</script>

<style scoped>
.btn {
  background: linear-gradient(to right, #a7f3d0, #60a5fa);
  color: #fff;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: transform 0.2s, background 0.3s;
  white-space: nowrap;
}
.btn:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #34d399, #3b82f6);
}

/* Prevent overflow when on mobile */
header {
  max-width: 100vw;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

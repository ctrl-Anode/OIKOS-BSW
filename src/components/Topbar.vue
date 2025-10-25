<template>
  <header
    v-if="user"
    class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8 py-3 sm:py-4 bg-white bg-opacity-80 shadow-md backdrop-blur-md fixed top-0 left-0 w-full z-20"
  >
    <!-- Title -->
    <div
      class="text-xl sm:text-2xl font-bold text-purple-700 text-center sm:text-left"
    >
      Sight Words Hub
    </div>

    <!-- User Info -->
    <div class="flex items-center flex-wrap justify-center gap-3 sm:gap-4">
      <span
        class="font-semibold text-base sm:text-lg text-gray-800 truncate max-w-[120px] sm:max-w-none"
      >
        {{ user.displayName || "User" }}
      </span>

      <img
        v-if="userAvatar"
        :src="getAvatarUrl(userAvatar)"
        alt="Avatar"
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 object-cover"
      />

      <button @click="logout" class="btn">Logout</button>
    </div>
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
const router = useRouter();

function getAvatarUrl(filename) {
  return new URL(`../assets/avatars/${filename}`, import.meta.url).href;
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
</style>

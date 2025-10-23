<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <!-- Topbar -->
    <div v-if="user" class="flex items-center justify-between px-8 py-4 bg-white bg-opacity-80 shadow-md">
      <div class="text-2xl font-bold text-purple-700">Sight Words Hub</div>
      <div class="flex items-center gap-4">
        
        <span class="font-bold text-lg text-gray-800">{{ user.displayName || 'User' }}</span>
        <img
          v-if="userAvatar"
          :src="getAvatarUrl(userAvatar)"
          alt="Avatar"
          class="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <button @click="logout" class="btn ml-6">Logout</button>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center py-20">
      <div class="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-5xl text-center">
        <h2 class="text-4xl font-black text-purple-700 mb-10">Sight Words Learning Hub</h2>
        <LearnCVCView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import LearnCVCView from './LearnCVCView.vue';

const user = ref(null);
const userAvatar = ref('');
const router = useRouter();

function getAvatarUrl(filename) {
  return new URL(`../../assets/avatars/${filename}`, import.meta.url).href;
}

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u;
    if (!u) {
      router.push('/login');
    } else {
      // Load user's avatar from Firestore
      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().avatar) {
        userAvatar.value = userSnap.data().avatar;
      }
    }
  });
});

function logout() {
  signOut(auth).then(() => {
    router.push('/login');
  });
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
</style>
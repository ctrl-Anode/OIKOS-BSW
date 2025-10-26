<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200 overflow-hidden"
  >
    <Topbar class="flex-shrink-0 fixed top-0 left-0 w-full z-20" />

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center py-20">
      <div class="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        <h2 class="text-4xl font-black text-purple-700 mb-10">Sight Words Learning Hub</h2>
        <!-- Add your learning hub content here -->
        <p class="text-xl mb-8">Let's start learning sight words!</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'

const user = ref(null)
const userAvatar = ref('')
const router = useRouter()

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
/* Optional: Smooth scrolling for better UX */
main {
  scroll-behavior: smooth;
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

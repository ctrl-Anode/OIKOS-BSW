<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-200 via-pink-300 to-purple-400">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
      <h2 class="text-3xl font-black text-purple-700 mb-6">Admin Dashboard</h2>
      <p v-if="user" class="text-lg mb-6">Welcome, <span class="font-bold">{{ user.displayName || 'Admin' }}</span>!</p>
      <button @click="logout" class="btn w-full mb-4">Logout</button>
      <div class="mt-6">
        <h3 class="text-xl font-bold mb-2 text-purple-600">User Management</h3>
        <div v-if="loading" class="text-gray-500 mb-4">Loading users...</div>
        <ul v-else>
          <li v-for="u in users" :key="u.id" class="mb-2">
            <span class="font-semibold">{{ u.name }}</span> - {{ u.role }} - Age: {{ u.age }}
          </li>
        </ul>
        <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const user = ref(null)
const users = ref([])
const loading = ref(true)
const error = ref('')
const router = useRouter()

onMounted(async () => {
  onAuthStateChanged(auth, async (u) => {
    if (!u) {
      router.push('/login')
      return
    }
    // Check if user is admin
    const userDoc = await getDoc(doc(db, 'users', u.uid))
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      router.push('/app')
      return
    }
    user.value = u
    // Fetch all users for admin
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      users.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = 'Failed to load users.'
    }
    loading.value = false
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
  padding: 12px;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: transform 0.2s;
  margin-top: 16px;
}
.btn:hover {
  transform: scale(1.05);
}
</style>
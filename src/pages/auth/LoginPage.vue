<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-black text-purple-700 mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <input v-model="identifier" type="text" placeholder="Email or Name" class="input mb-4" required />
        <input v-model="password" type="password" placeholder="Password" class="input mb-6" required />
        <button type="submit" class="btn w-full" :disabled="loading">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <p class="mt-4 text-center text-gray-700">
        Don't have an account?
        <router-link to="/register" class="text-purple-700 font-bold">Register</router-link>
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const identifier = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

function isEmail(str) {
  return /\S+@\S+\.\S+/.test(str)
}

async function login() {
  error.value = ''
  loading.value = true
  let emailToUse = identifier.value

  try {
    // If not an email, look up by name in Firestore
    if (!isEmail(identifier.value)) {
      const q = query(collection(db, 'users'), where('name', '==', identifier.value))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        error.value = 'No user found with that name.'
        loading.value = false
        return
      }
      if (querySnapshot.size > 1) {
        error.value = 'Multiple users found with that name. Please use your email.'
        loading.value = false
        return
      }
      // Use the matching user's email
      emailToUse = querySnapshot.docs[0].data().email
    }

    await signInWithEmailAndPassword(auth, emailToUse, password.value)
    // Get user role to redirect
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', emailToUse)))
    const userData = userDoc.docs[0]?.data()
    if (userData?.role === 'admin') {
      router.push('/admin')
    } else if (userData?.firstLogin !== false) {
      router.push('/app') // WelcomePage
    } else {
      router.push('/app/hub') // LearningHubPage
    }
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #a78bfa;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.btn {
  background: linear-gradient(to right, #a7f3d0, #60a5fa);
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: transform 0.2s;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn:hover:enabled {
  transform: scale(1.05);
}
</style>
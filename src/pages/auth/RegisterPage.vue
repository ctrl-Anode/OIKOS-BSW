<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-black text-purple-700 mb-6 text-center">Register</h2>
      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Name" class="input mb-4" required />
        <input v-model="birthdate" type="date" placeholder="Birthdate" class="input mb-4" required />
        <select v-model="role" class="input mb-4" required>
          <option value="" disabled>Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input v-model="email" type="email" placeholder="Email" class="input mb-4" required />
        <input v-model="password" type="password" placeholder="Password" class="input mb-6" required />
        <button type="submit" class="btn w-full" :disabled="loading">
          <span v-if="loading">Registering...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>
      <p class="mt-4 text-center text-gray-700">
        Already have an account?
        <router-link to="/login" class="text-purple-700 font-bold">Login</router-link>
      </p>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const name = ref('')
const birthdate = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

function calculateAge(birthdateStr) {
  const today = new Date()
  const birthDate = new Date(birthdateStr)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

async function register() {
  error.value = ''
  loading.value = true
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, { displayName: name.value })
    const age = calculateAge(birthdate.value)
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: name.value,
      birthday: birthdate.value,
      age: age,
      role: role.value,
      email: email.value,
      createdAt: new Date(),
      firstLogin: true, // <-- add this
      avatar: '',       // optional: default avatar
    })
    const userData = {
      role: role.value,
      firstLogin: true,
    }
    // For user role after login/register
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
.btn:hover {
  transform: scale(1.05);
}
</style>
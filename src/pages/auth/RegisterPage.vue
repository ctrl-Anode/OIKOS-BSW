<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 via-purple-300 to-pink-200 p-4">
    <!-- Animated background shapes -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-30 animate-bounce" style="animation-delay: 0s"></div>
    <div class="absolute bottom-20 right-10 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-bounce" style="animation-delay: 0.5s"></div>
    <div class="absolute top-1/2 right-20 w-12 h-12 bg-pink-400 rounded-full opacity-30 animate-bounce" style="animation-delay: 1s"></div>

    <!-- Main card -->
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
      <!-- Header with animated icon -->
      <div class="text-center mb-8">
        <div class="inline-block mb-4">
          <div class="text-5xl animate-pulse">✨</div>
        </div>
        <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          Join the Fun!
        </h2>
        <p class="text-gray-600 font-semibold">Learn sight words with us</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="register" class="space-y-4">
        <!-- Name input -->
        <div class="relative">
          <div class="absolute left-3 top-3 text-2xl">👤</div>
          <input
            v-model="name"
            type="text"
            placeholder="Your Name"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-lg font-semibold placeholder-gray-400"
            required
          />
        </div>

        <!-- Birthdate input -->
        <div class="relative">
          <div class="absolute left-3 top-3 text-2xl">🎂</div>
          <input
            v-model="birthdate"
            type="date"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-lg font-semibold"
            required
          />
        </div>

        <!-- Email input -->
        <div class="relative">
          <div class="absolute left-3 top-3 text-2xl">📧</div>
          <input
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-lg font-semibold placeholder-gray-400"
            required
          />
        </div>

        <!-- Password input -->
        <div class="relative">
          <div class="absolute left-3 top-3 text-2xl">🔐</div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-lg font-semibold placeholder-gray-400"
            required
            @focus="showPasswordTooltip = true"
            @blur="showPasswordTooltip = false"
          />
          <button
            type="button"
            class="absolute right-3 top-3 text-2xl hover:scale-110 transition-transform"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>

        <!-- Password requirements tooltip -->
        <div v-if="showPasswordTooltip" class="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-sm font-semibold text-blue-800">
          <div class="flex items-start gap-2">
            <span class="text-lg">ℹ️</span>
            <div>{{ t('tooltips.passwordRequirements') }}</div>
          </div>
        </div>

        <!-- Confirm password input -->
        <div class="relative">
          <div class="absolute left-3 top-3 text-2xl">✅</div>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-lg font-semibold placeholder-gray-400"
            required
          />
          <button
            type="button"
            class="absolute right-3 top-3 text-2xl hover:scale-110 transition-transform"
            @click="toggleConfirmPasswordVisibility"
          >
            {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>

        <!-- Terms checkbox -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="agreedToTerms"
              required
              class="w-6 h-6 mt-1 rounded-lg accent-purple-600 cursor-pointer"
            />
            <span class="text-sm font-semibold text-gray-700">
              I agree to the
              <a href="/terms" class="text-purple-700 font-bold hover:underline">Terms of Service</a>
              and
              <a href="/privacy" class="text-purple-700 font-bold hover:underline">Privacy Policy</a>
            </span>
          </label>
        </div>

        <!-- Sign up button -->
        <button
          type="submit"
          :disabled="loading || !agreedToTerms"
          class="w-full py-4 rounded-xl font-black text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="animate-spin">⏳</span>
            Registering...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            🚀 Sign Up
          </span>
        </button>
      </form>

      <!-- Google sign up button -->
      <button
        @click.prevent="registerWithGoogle"
        class="w-full py-4 rounded-xl font-black text-lg text-gray-800 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 mt-4 flex items-center justify-center gap-2 shadow-md"
      >
        <span class="text-2xl">🔵</span>
        Sign Up with Google
      </button>

      <!-- Login link -->
      <p class="mt-6 text-center text-gray-700 font-semibold">
        Already have an account?
        <router-link to="/login" class="text-purple-700 font-black hover:underline">
          Login here
        </router-link>
      </p>

      <!-- Error message -->
      <div v-if="error" class="mt-4 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-red-800 font-semibold flex items-start gap-2">
        <span class="text-2xl">❌</span>
        <div>{{ error }}</div>
      </div>

      <!-- Success message -->
      <div v-if="success" class="mt-4 bg-green-100 border-2 border-green-400 rounded-xl p-4 text-green-800 font-semibold flex items-start gap-2">
        <span class="text-2xl">✅</span>
        <div>{{ success }}</div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 rounded-3xl">
      <div class="text-6xl animate-bounce">🎉</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { setDoc, doc, getDoc, addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const name = ref('')
const birthdate = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const avatar = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const error = ref('')
const success = ref('')
const loading = ref(false)
const router = useRouter()
const showPasswordTooltip = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value
}

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

async function logUserAction(action, details) {
  try {
    await addDoc(collection(db, 'userLogs'), {
      action,
      details,
      timestamp: new Date(),
    })
  } catch (e) {
    console.error('Failed to log user action:', e)
  }
}

async function register() {
  error.value = ''
  success.value = ''
  loading.value = true
  if (password.value.length < 8) {
    error.value = t('errors.passwordTooShort')
    loading.value = false
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = t('errors.passwordsDoNotMatch')
    loading.value = false
    return
  }
  if (!agreedToTerms.value) {
    error.value = t('errors.mustAgreeToTerms')
    loading.value = false
    return
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, { displayName: name.value })
    const age = calculateAge(birthdate.value)
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: name.value,
      birthday: birthdate.value,
      age: age,
      role: 'user', // Automatically set role to 'user'
      email: email.value,
      createdAt: new Date(),
      firstLogin: true,
      avatar: avatar.value || '', // optional: default avatar
      agreedToTerms: true, // Store agreement status
    })
    await logUserAction('register', { email: email.value, role: 'user' })
    success.value = t('success.registrationSuccessful')
    const userData = {
      role: 'user', // Automatically set role to 'user'
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
    await logUserAction('register_failed', { email: email.value, error: e.message })
  }
  loading.value = false
}

async function registerWithGoogle() {
  error.value = ''
  success.value = ''
  loading.value = true
  const provider = new GoogleAuthProvider()
  try {
    if (!agreedToTerms.value) {
      error.value = t('errors.mustAgreeToTerms')
      loading.value = false
      return
    }

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Check if the email is already used
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      error.value = t('errors.emailAlreadyRegistered')
      router.push('/login') // Redirect to login page
      return
    }

    // If email is not used, proceed with registration
    name.value = user.displayName || ''
    email.value = user.email || ''
    avatar.value = user.photoURL || ''
    await setDoc(userDocRef, {
      name: name.value,
      birthday: '', // Google does not provide birthdate
      age: null, // Age cannot be calculated without birthdate
      role: 'user',
      email: email.value,
      createdAt: new Date(),
      firstLogin: true,
      avatar: avatar.value,
      agreedToTerms: true, // Store agreement status
    })
    await logUserAction('register_with_google', { email: email.value, role: 'user' })
    success.value = t('success.registrationSuccessful')
    router.push('/app')
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') {
      error.value = t('errors.emailAlreadyRegistered')
      router.push('/login') // Redirect to login page
    } else {
      error.value = e.message
    }
    await logUserAction('register_with_google_failed', { email: email.value, error: e.message })
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
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.tooltip {
  display: inline-block;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  position: absolute;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #fff;
  background-color: #e74c3c;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.success-message {
  color: #fff;
  background-color: #2ecc71;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
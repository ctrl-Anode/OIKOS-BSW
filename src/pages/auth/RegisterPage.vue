<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-400 via-pink-200 to-yellow-100 p-4 relative overflow-hidden">
    <!-- Animated floating shapes -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-30 animate-bounce" style="animation-delay: 0s"></div>
    <div class="absolute bottom-20 right-10 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-bounce" style="animation-delay: 0.5s"></div>
    <div class="absolute top-1/2 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-bounce" style="animation-delay: 1s"></div>

    <!-- Registration Card -->
    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-md relative z-10 border border-purple-200">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl animate-pulse mb-2">🌈</div>
        <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Join the Fun!
        </h2>
        <p class="text-gray-600 font-semibold">Learn sight words with us 🎉</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="register" class="space-y-4">
        <!-- Name -->
        <div class="relative">
          <span class="absolute left-3 top-3 text-2xl">👤</span>
          <input
            v-model="name"
            type="text"
            placeholder="Your Name"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold placeholder-gray-400 transition-all"
            required
          />
        </div>

        <!-- Birthdate -->
        <div class="relative">
          <span class="absolute left-3 top-3 text-2xl">🎂</span>
          <input
            v-model="birthdate"
            type="date"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold transition-all"
            required
          />
        </div>

        <!-- Email -->
        <div class="relative">
          <span class="absolute left-3 top-3 text-2xl">📧</span>
          <input
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold placeholder-gray-400 transition-all"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <span class="absolute left-3 top-3 text-2xl">🔐</span>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold placeholder-gray-400 transition-all"
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

        <!-- Password Tooltip -->
        <div v-if="showPasswordTooltip" class="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-sm font-semibold text-blue-800">
          <div class="flex items-start gap-2">
            <span class="text-lg">ℹ️</span>
            <span>{{ t('tooltips.passwordRequirements') }}</span>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <span class="absolute left-3 top-3 text-2xl">✅</span>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg font-semibold placeholder-gray-400 transition-all"
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

        <!-- Terms of Service -->
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

        <!-- Sign Up Button -->
        <button
          type="submit"
          :disabled="loading || !agreedToTerms"
          class="w-full py-4 rounded-xl font-black text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="animate-spin">⏳</span> Registering...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            🚀 Sign Up
          </span>
        </button>
      </form>

      <!-- Google Button -->
      <button
        @click.prevent="registerWithGoogle"
        class="w-full py-4 rounded-xl font-black text-lg text-gray-800 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 mt-4 flex items-center justify-center gap-2 shadow-md"
      >
        <span class="text-2xl">🔵</span>
        Sign Up with Google
      </button>

      <!-- Login Link -->
      <p class="mt-6 text-center text-gray-700 font-semibold">
        Already have an account?
        <router-link to="/login" class="text-purple-700 font-black hover:underline">
          Login here
        </router-link>
      </p>

      <!-- Error & Success Messages -->
      <div v-if="error" class="mt-4 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-red-800 font-semibold flex items-start gap-2">
        <span class="text-2xl">❌</span>
        <div>{{ error }}</div>
      </div>
      <div v-if="success" class="mt-4 bg-green-100 border-2 border-green-400 rounded-xl p-4 text-green-800 font-semibold flex items-start gap-2">
        <span class="text-2xl">✅</span>
        <div>{{ success }}</div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
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
    await addDoc(collection(db, 'userLogs'), { action, details, timestamp: new Date() })
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
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, { displayName: name.value })
    const age = calculateAge(birthdate.value)
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: name.value,
      birthday: birthdate.value,
      age: age,
      role: 'user',
      email: email.value,
      createdAt: new Date(),
      firstLogin: true,
      avatar: avatar.value || '',
      agreedToTerms: true,
    })
    await logUserAction('register', { email: email.value, role: 'user' })
    success.value = t('success.registrationSuccessful')
    router.push('/app')
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
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      error.value = t('errors.emailAlreadyRegistered')
      router.push('/login')
      return
    }
    name.value = user.displayName || ''
    email.value = user.email || ''
    avatar.value = user.photoURL || ''
    await setDoc(userDocRef, {
      name: name.value,
      birthday: '',
      age: null,
      role: 'user',
      email: email.value,
      createdAt: new Date(),
      firstLogin: true,
      avatar: avatar.value,
      agreedToTerms: true,
    })
    await logUserAction('register_with_google', { email: email.value, role: 'user' })
    success.value = t('success.registrationSuccessful')
    router.push('/app')
  } catch (e) {
    error.value = e.message
    await logUserAction('register_with_google_failed', { email: email.value, error: e.message })
  }
  loading.value = false
}
</script>

<style scoped>
@media (max-width: 640px) {
  .text-4xl {
    font-size: 1.8rem;
  }
  .p-10 {
    padding: 1.5rem !important;
  }
  .space-y-4 {
    gap: 0.75rem;
  }
}
</style>

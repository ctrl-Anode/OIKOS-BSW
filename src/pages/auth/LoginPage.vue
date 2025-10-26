<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-500 via-pink-300 to-yellow-200 relative overflow-hidden px-4">
    <!-- Animated background bubbles -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-25 animate-bounce" style="animation-delay: 0s"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-green-300 rounded-full opacity-25 animate-bounce" style="animation-delay: 0.5s"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-25 animate-bounce" style="animation-delay: 1s"></div>

    <!-- Login Card -->
    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative z-10 border border-purple-100">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="text-5xl mb-3">🎓</div>
        <h2 class="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
          Welcome Back!
        </h2>
        <p class="text-gray-600 font-medium text-sm sm:text-base">Let’s learn some words today!</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="space-y-5">
        <!-- Identifier -->
        <div class="relative">
          <div class="absolute left-4 top-3 text-2xl">👤</div>
          <input
            v-model="identifier"
            type="text"
            placeholder="Email or Name"
            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-base sm:text-lg font-medium placeholder-gray-400 transition-all duration-200"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <div class="absolute left-4 top-3 text-2xl">🔐</div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-base sm:text-lg font-medium placeholder-gray-400 transition-all duration-200"
            required
            @focus="showPasswordTooltip = true"
            @blur="showPasswordTooltip = false"
          />
          <button
            type="button"
            class="absolute right-4 top-2.5 text-2xl hover:scale-110 transition-transform duration-200"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>

          <transition name="fade">
            <div
              v-if="showPasswordTooltip"
              class="absolute top-full mt-2 left-0 right-0 bg-purple-50 border border-purple-300 rounded-lg p-3 text-sm font-medium text-purple-800 shadow-md z-20"
            >
              {{ t('tooltips.passwordRequirements') }}
            </div>
          </transition>
        </div>

        <!-- Options -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 pt-1">
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-5 h-5 rounded-md border-2 border-purple-300 accent-purple-500 cursor-pointer"
            />
            <span class="ml-2 text-gray-700 font-medium group-hover:text-purple-600 transition-colors text-sm sm:text-base">
              {{ t('labels.rememberMe') }}
            </span>
          </label>

          <button
            type="button"
            @click="resetPassword"
            class="text-purple-600 font-medium hover:text-purple-800 transition-colors text-sm sm:text-base"
          >
            {{ t('labels.forgotPassword') }}
          </button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>

      <!-- Google Login -->
      <button
        @click.prevent="loginWithGoogle"
        :disabled="loading"
        class="w-full mt-4 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold text-lg rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span class="text-2xl">🔍</span>
        <span>Login with Google</span>
      </button>

      <!-- Register -->
      <p class="mt-6 text-center text-gray-700 font-medium text-sm sm:text-base">
        Don’t have an account?
        <router-link to="/register" class="text-purple-600 font-bold hover:text-purple-800 transition-colors">
          Register here
        </router-link>
      </p>

      <!-- 🏠 Home Button -->
      <div class="mt-4 flex justify-center">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          🏠 Home
        </router-link>
      </div>

      <!-- Error -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 font-medium flex items-center gap-2"
        >
          <span class="text-2xl">❌</span>
          {{ error }}
        </div>
      </transition>

      <!-- Success -->
      <transition name="slide-down">
        <div
          v-if="success"
          class="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-xl text-green-800 font-medium flex items-center gap-2"
        >
          <span class="text-2xl">✅</span>
          {{ success }}
        </div>
      </transition>
    </div>

    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div class="text-6xl animate-bounce">🎓</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../../firebase'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const success = ref('')
const loading = ref(false)
const rememberMe = ref(false)
const router = useRouter()
const showPasswordTooltip = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function isEmail(str) {
  return /\S+@\S+\.\S+/.test(str)
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

async function login() {
  error.value = ''
  loading.value = true
  let emailToUse = identifier.value

  try {
    const persistence = rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence)

    if (!isEmail(identifier.value)) {
      const q = query(collection(db, 'users'), where('name', '==', identifier.value))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        error.value = 'No user found with that name.'
        loading.value = false
        await logUserAction('login_failed', { identifier: identifier.value })
        return
      }
      emailToUse = querySnapshot.docs[0].data().email
    }

    await signInWithEmailAndPassword(auth, emailToUse, password.value)
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', emailToUse)))
    const userData = userDoc.docs[0]?.data()
    await logUserAction('login_success', { email: emailToUse })

    if (userData?.role === 'admin') router.push('/admin')
    else if (userData?.firstLogin !== false) router.push('/app')
    else router.push('/app/hub')

  } catch (e) {
    error.value = e.message
    await logUserAction('login_failed', { identifier: identifier.value, error: e.message })
  }
  loading.value = false
}

async function loginWithGoogle() {
  error.value = ''
  loading.value = true
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)))

    if (userDoc.empty) {
      error.value = 'No account found with this Google account.'
      router.push('/register')
      return
    }

    const userData = userDoc.docs[0]?.data()
    await logUserAction('login_with_google_success', { email: user.email })

    if (userData?.role === 'admin') router.push('/admin')
    else if (userData?.firstLogin !== false) router.push('/app')
    else router.push('/app/hub')

  } catch (e) {
    error.value = e.message
    await logUserAction('login_with_google_failed', { error: e.message })
  }
  loading.value = false
}

async function resetPassword() {
  error.value = ''
  success.value = ''

  if (!identifier.value) {
    error.value = t('errors.emailRequired')
    return
  }

  loading.value = true
  let emailToUse = identifier.value

  try {
    if (!isEmail(identifier.value)) {
      const q = query(collection(db, 'users'), where('name', '==', identifier.value))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        error.value = 'No user found with that name.'
        loading.value = false
        return
      }
      emailToUse = querySnapshot.docs[0].data().email
    }

    await sendPasswordResetEmail(auth, emailToUse)
    success.value = t('success.passwordResetEmailSent')
    await logUserAction('password_reset_requested', { email: emailToUse })
  } catch (e) {
    error.value = e.message
  }

  loading.value = false
}
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>

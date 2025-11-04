<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 relative overflow-hidden px-4 py-8">
    <!-- Animated background bubbles -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-float" style="animation-delay: 0s"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-float" style="animation-delay: 0.5s"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-float" style="animation-delay: 1s"></div>
    <div class="absolute bottom-32 right-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-float" style="animation-delay: 1.5s"></div>

    <!-- Login Card -->
    <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-md relative z-10 border-2 border-white/50">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="text-6xl sm:text-7xl mb-4 animate-bounce-slow">🎓</div>
        <h2 class="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h2>
        <p class="text-gray-600 font-semibold text-sm sm:text-base">Let's continue learning together!</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="space-y-4 sm:space-y-5">
        <!-- Identifier -->
        <div class="relative group">
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Email or Username</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl opacity-60 group-focus-within:opacity-100 transition-opacity">👤</div>
            <input
              v-model="identifier"
              type="text"
              placeholder="Enter email or name"
              class="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-base sm:text-lg font-medium placeholder-gray-400 transition-all duration-200 bg-white"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="relative group">
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl opacity-60 group-focus-within:opacity-100 transition-opacity">🔐</div>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter your password"
              class="w-full pl-12 pr-14 py-3.5 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-base sm:text-lg font-medium placeholder-gray-400 transition-all duration-200 bg-white"
              required
              @focus="showPasswordTooltip = true"
              @blur="showPasswordTooltip = false"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none"
              @click="togglePasswordVisibility"
              tabindex="-1"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>

          <transition name="fade">
            <div
              v-if="showPasswordTooltip"
              class="absolute top-full mt-2 left-0 right-0 bg-purple-50 border-2 border-purple-300 rounded-xl p-3 text-xs sm:text-sm font-medium text-purple-800 shadow-lg z-20"
            >
              {{ t('tooltips.passwordRequirements') }}
            </div>
          </transition>
        </div>

        <!-- Options -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 pt-1">
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-5 h-5 rounded-md border-2 border-purple-300 accent-purple-500 cursor-pointer transition-all"
            />
            <span class="ml-2.5 text-gray-700 font-semibold group-hover:text-purple-600 transition-colors text-sm sm:text-base select-none">
              {{ t('labels.rememberMe') }}
            </span>
          </label>

          <button
            type="button"
            @click="resetPassword"
            class="text-purple-600 font-bold hover:text-purple-800 hover:underline transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-300 rounded px-1"
          >
            {{ t('labels.forgotPassword') }}
          </button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2 mt-6"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t-2 border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500 font-semibold">OR</span>
        </div>
      </div>

      <!-- Google Login -->
      <button
        @click.prevent="loginWithGoogle"
        :disabled="loading"
        class="w-full py-3.5 bg-white border-2 border-gray-300 text-gray-800 font-bold text-base sm:text-lg rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 active:scale-95"
      >
        <span class="text-2xl">🔍</span>
        <span>Continue with Google</span>
      </button>

      <!-- Register & Home Links -->
      <div class="mt-8 space-y-4">
        <p class="text-center text-gray-700 font-medium text-sm sm:text-base">
          Don't have an account?
          <router-link to="/register" class="text-purple-600 font-bold hover:text-purple-800 hover:underline transition-all ml-1">
            Register here
          </router-link>
        </p>

        <div class="flex justify-center">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span class="text-xl">🏠</span>
            <span>Back to Home</span>
          </router-link>
        </div>
      </div>

      <!-- Error Message -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-semibold flex items-start gap-3 shadow-sm"
        >
          <span class="text-2xl flex-shrink-0">❌</span>
          <span class="text-sm sm:text-base">{{ error }}</span>
        </div>
      </transition>

      <!-- Success Message -->
      <transition name="slide-down">
        <div
          v-if="success"
          class="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl text-green-700 font-semibold flex items-start gap-3 shadow-sm"
        >
          <span class="text-2xl flex-shrink-0">✅</span>
          <span class="text-sm sm:text-base">{{ success }}</span>
        </div>
      </transition>
    </div>

    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/90 rounded-2xl p-8 shadow-2xl">
          <div class="text-6xl sm:text-7xl animate-bounce">🎓</div>
        </div>
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

  // Check for hardcoded admin login
  if (identifier.value === 'admin' && password.value === 'admin') {
    router.push('/admin')
    loading.value = false
    return
  }

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
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-15px) translateX(5px);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

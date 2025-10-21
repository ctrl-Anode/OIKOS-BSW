<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 via-purple-300 to-pink-200 relative overflow-hidden">
    <!-- Animated background shapes -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce" style="animation-delay: 0s"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce" style="animation-delay: 0.5s"></div>
    <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce" style="animation-delay: 1s"></div>

    <!-- Main login card -->
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
      <!-- Decorative header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🎓</div>
        <h2 class="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h2>
        <p class="text-gray-600 font-medium">Let's learn some words today!</p>
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <!-- Email/Name input -->
        <div class="relative">
          <div class="absolute left-4 top-4 text-2xl">👤</div>
          <input
            v-model="identifier"
            type="text"
            placeholder="Email or Name"
            class="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg font-medium transition-all duration-200 placeholder-gray-400"
            required
          />
        </div>

        <!-- Password input -->
        <div class="relative">
          <div class="absolute left-4 top-4 text-2xl">🔐</div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="w-full pl-14 pr-14 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg font-medium transition-all duration-200 placeholder-gray-400"
            required
            @focus="showPasswordTooltip = true"
            @blur="showPasswordTooltip = false"
          />
          <!-- Password visibility toggle -->
          <button
            type="button"
            class="absolute right-4 top-3 text-2xl hover:scale-110 transition-transform duration-200"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
          <!-- Password tooltip -->
          <transition name="fade">
            <div
              v-if="showPasswordTooltip"
              class="absolute top-full mt-2 left-0 right-0 bg-purple-100 border-2 border-purple-300 rounded-lg p-3 text-sm font-medium text-purple-800 z-20"
            >
              {{ t('tooltips.passwordRequirements') }}
            </div>
          </transition>
        </div>

        <!-- Form options -->
        <div class="flex items-center justify-between pt-2">
          <!-- Remember Me -->
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-5 h-5 rounded-lg border-2 border-purple-300 accent-purple-500 cursor-pointer"
            />
            <span class="ml-2 text-gray-700 font-medium group-hover:text-purple-600 transition-colors">
              {{ t('labels.rememberMe') }}
            </span>
          </label>

          <!-- Forgot Password Link -->
          <button
            type="button"
            @click="resetPassword"
            class="text-purple-600 font-medium hover:text-purple-800 transition-colors text-sm"
          >
            {{ t('labels.forgotPassword') }}
          </button>
        </div>

        <!-- Login button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>

      <!-- Google login button -->
      <button
        @click.prevent="loginWithGoogle"
        :disabled="loading"
        class="w-full py-3 px-4 bg-white border-2 border-gray-300 text-gray-800 font-bold text-lg rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-4"
      >
        <span class="text-2xl">🔍</span>
        <span>Login with Google</span>
      </button>

      <!-- Register link -->
      <p class="mt-6 text-center text-gray-700 font-medium">
        Don't have an account?
        <router-link to="/register" class="text-purple-600 font-bold hover:text-purple-800 transition-colors">
          Register here
        </router-link>
      </p>

      <!-- Error message -->
      <transition name="slide-down">
        <div
          v-if="error"
          class="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 font-medium flex items-center gap-2"
        >
          <span class="text-2xl">❌</span>
          {{ error }}
        </div>
      </transition>

      <!-- Success message -->
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

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="text-6xl animate-bounce">🎓</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, browserSessionPersistence } from 'firebase/auth'
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
    // Set session persistence based on "Remember Me"
    const persistence = rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence)

    // If not an email, look up by name in Firestore
    if (!isEmail(identifier.value)) {
      const q = query(collection(db, 'users'), where('name', '==', identifier.value))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        error.value = 'No user found with that name.'
        loading.value = false
        await logUserAction('login_failed', { identifier: identifier.value, reason: 'No user found with that name' })
        return
      }
      if (querySnapshot.size > 1) {
        error.value = 'Multiple users found with that name. Please use your email.'
        loading.value = false
        await logUserAction('login_failed', { identifier: identifier.value, reason: 'Multiple users found with that name' })
        return
      }
      // Use the matching user's email
      emailToUse = querySnapshot.docs[0].data().email
    }

    await signInWithEmailAndPassword(auth, emailToUse, password.value)
    // Get user role to redirect
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', emailToUse)))
    const userData = userDoc.docs[0]?.data()
    await logUserAction('login_success', { email: emailToUse })
    if (userData?.role === 'admin') {
      router.push('/admin')
    } else if (userData?.firstLogin !== false) {
      router.push('/app') // WelcomePage
    } else {
      router.push('/app/hub') // LearningHubPage
    }
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

    // Check if the user exists in Firestore
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)))
    if (userDoc.empty) {
      error.value = 'No account found with this Google account. Please register first.'
      await logUserAction('login_with_google_failed', { email: user.email, reason: 'No account found' })
      router.push('/register') // Redirect to register page
      return
    }

    const userData = userDoc.docs[0]?.data()
    await logUserAction('login_with_google_success', { email: user.email })
    if (userData?.role === 'admin') {
      router.push('/admin')
    } else if (userData?.firstLogin !== false) {
      router.push('/app') // WelcomePage
    } else {
      router.push('/app/hub') // LearningHubPage
    }
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
    // If the user entered a name instead of email
    if (!isEmail(identifier.value)) {
      const q = query(collection(db, 'users'), where('name', '==', identifier.value))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        error.value = 'No user found with that name.'
        loading.value = false
        await logUserAction('password_reset_failed', { identifier: identifier.value, reason: 'No user found with that name' })
        return
      }
      if (querySnapshot.size > 1) {
        error.value = 'Multiple users found with that name. Please use your email.'
        loading.value = false
        await logUserAction('password_reset_failed', { identifier: identifier.value, reason: 'Multiple users with same name' })
        return
      }
      emailToUse = querySnapshot.docs[0].data().email
    }

    // Check if the user exists and retrieve their authProvider
    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', emailToUse)))
    if (userDoc.empty) {
      error.value = t('errors.userNotFound')
      loading.value = false
      await logUserAction('password_reset_failed', { email: emailToUse, reason: 'User not found' })
      return
    }

    const userData = userDoc.docs[0]?.data()

    if (userData?.authProvider === 'google') {
      error.value = t('errors.googleSignInNoReset')
      loading.value = false
      await logUserAction('password_reset_failed', { email: emailToUse, reason: 'Google Sign-In user not eligible' })
      return
    }

    // Send the password reset email via Firebase Auth
    await sendPasswordResetEmail(auth, emailToUse)
    success.value = t('success.passwordResetEmailSent')
    await logUserAction('password_reset_requested', { email: emailToUse })
  } catch (e) {
    error.value = e.message
    await logUserAction('password_reset_failed', { email: emailToUse, error: e.message })
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
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.remember-me {
  display: flex;
  align-items: center;
}
.remember-me input {
  margin-right: 5px;
}
.forgot-password {
  margin-top: 10px;
  text-align: right;
}
.forgot-password a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}
.forgot-password a:hover {
  text-decoration: underline;
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
  top: 100%;
  left: 0;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.success-message {
  color: #fff;
  background-color: #2ecc71;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

/* New styles for the updated design */
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #4f46e5, #9333ea, #ec4899);
}

.rounded-3xl {
  border-radius: 1.5rem;
}

.shadow-2xl {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.text-5xl {
  font-size: 3rem;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.transition-transform {
  transition-property: transform;
}

.duration-200 {
  transition-duration: 200ms;
}

.accent-purple-500 {
  accent-color: #6b46c1;
}

.group-hover\:text-purple-600:hover {
  color: #6b46c1;
}

.bg-gradient-to-r {
  background: linear-gradient(to right, #6b46c1, #b83280);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.text-transparent {
  color: transparent;
}

.bg-clip-text {
  background-clip: text;
}

.placeholder-gray-400::placeholder {
  color: #cbd5e0;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-800 {
  color: #1f2937;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

.border-purple-200 {
  border-color: #e9d8fd;
}

.focus\:border-purple-500:focus {
  border-color: #6b46c1;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.pb-2 {
  padding-bottom: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.opacity-20 {
  opacity: 0.2;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
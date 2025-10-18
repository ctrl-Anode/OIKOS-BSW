<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200">
    <div class="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
      <h2 class="text-4xl font-black text-purple-700 mb-10">Welcome!</h2>
      <p class="text-2xl mb-10">
        Hello,
        <span class="font-extrabold">
          {{ user && user.displayName ? user.displayName : 'User' }}
        </span>!
      </p>
      <div class="mb-10">
        <h3 class="text-2xl font-bold mb-4 text-purple-600">Choose your avatar</h3>
        <div class="flex flex-wrap justify-center gap-6 mb-4">
          <img
            v-for="avatar in avatars"
            :key="avatar"
            :src="getAvatarUrl(avatar)"
            :alt="avatar"
            class="w-24 h-24 rounded-full border-4 cursor-pointer transition-transform duration-200"
            :class="{'border-blue-500 scale-110': selectedAvatar === avatar, 'border-gray-300': selectedAvatar !== avatar}"
            @click="selectAvatar(avatar)"
          />
        </div>
        <div v-if="selectedAvatar" class="mb-4 text-lg">
          <span class="text-gray-700">Selected:</span>
          <img :src="getAvatarUrl(selectedAvatar)" alt="Selected Avatar" class="inline w-14 h-14 rounded-full border-2 border-blue-500 ml-2 align-middle" />
        </div>
        <button
          :disabled="!selectedAvatar || saving"
          @click="continueToHub"
          class="btn mt-4 text-xl py-4"
        >
          <span v-if="saving">Saving...</span>
          <span v-else>Continue to Hub</span>
        </button>
      </div>
      <button @click="logout" class="btn w-full text-xl py-4 mt-4">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

const user = ref(null)
const router = useRouter()
const avatars = [
  'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg', 'avatar5.jpg',
  'avatar6.jpg', 'avatar7.jpg', 'avatar8.jpg', 'avatar9.jpg', 'avatar10.jpg'
]
const selectedAvatar = ref('')
const saving = ref(false)

function getAvatarUrl(filename) {
  return new URL(`../../assets/avatars/${filename}`, import.meta.url).href
}
function selectAvatar(avatar) {
  selectedAvatar.value = avatar
}
async function continueToHub() {
  if (!selectedAvatar.value || !user.value) return
  saving.value = true
  const userRef = doc(db, 'users', user.value.uid)
  await updateDoc(userRef, { avatar: selectedAvatar.value, firstLogin: false })
  saving.value = false
  router.push('/app/hub')
}
onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (!u) router.push('/login')
    // Optionally, load existing avatar selection here
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
  padding: 16px;
  border-radius: 12px;
  font-size: 1.5rem;
  transition: transform 0.2s;
  margin-top: 24px;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn:hover:enabled {
  transform: scale(1.05);
}
</style>
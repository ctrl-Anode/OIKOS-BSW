<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Professional header with navigation and branding -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="text-3xl">📚</div>
            <div>
              <h1 class="text-3xl font-bold">Admin Panel</h1>
              <p class="text-blue-100 text-sm">Sight Word Buddy Management</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-blue-100">Welcome back</p>
              <p class="font-semibold">{{ adminName || 'Administrator' }}</p>
            </div>
            <img
              v-if="adminAvatar"
              :src="getAvatarUrl(adminAvatar)"
              alt="Avatar"
              class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            />
            <button
              @click="confirmLogout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Improved CVC Manager section with better layout and spacing -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Section Header -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-8 py-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span>
            CVC Word Management
          </h2>
          <p class="text-gray-600 text-sm mt-1">Manage and organize CVC words and categories</p>
        </div>

        <!-- Controls Section -->
        <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Add New Word Button -->
            <div>
              <button
                @click="toggleForm"
                :class=" [
                  'w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                  showForm
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                ]"
              >
                <span>{{ showForm ? '✕' : '➕' }}</span>
                {{ showForm ? 'Close Form' : 'Add New CVC Word' }}
              </button>
            </div>

            <!-- Add Category Section -->
            <div class="flex gap-2">
              <input
                v-model="newCategory"
                type="text"
                placeholder="Enter new category name..."
                class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <button
                @click="addCategory"
                :disabled="!newCategory.trim()"
                :class=" [
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2',
                  newCategory.trim()
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span>🏷️</span>
                Add Category
              </button>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div v-if="showForm" class="px-8 py-6 bg-blue-50 border-b border-blue-200">
          <CVCForm :categories="categories" @saved="fetchWords" @cancel="toggleForm" />
        </div>

        <!-- Words List Section -->
        <div class="px-8 py-6">
          <CVCList :words="words" @updated="fetchWords" />
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p class="text-gray-600 text-sm font-semibold">Total Words</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ words.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p class="text-gray-600 text-sm font-semibold">Total Categories</p>
          <p class="text-3xl font-bold text-purple-600 mt-2">{{ categories.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p class="text-gray-600 text-sm font-semibold">Last Updated</p>
          <p class="text-lg font-semibold text-green-600 mt-2">Today</p>
        </div>
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h3 class="text-lg font-bold text-gray-800">Confirm Logout</h3>
          <p class="text-gray-600 mt-2">Are you sure you want to log out?</p>
          <div class="flex justify-end gap-4 mt-4">
            <button
              @click="showLogoutConfirm = false"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              @click="logout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import CVCForm from './CVCForm.vue';
import CVCList from './CVCList.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'AdminPanel',
  components: { CVCForm, CVCList },
  setup() {
    const toast = useToast();
    const adminName = ref('');
    const adminAvatar = ref('');
    const user = ref(null);
    const words = ref([]);
    const categories = ref([]);
    const newCategory = ref('');
    const loading = ref(true);
    const showForm = ref(false);
    const showLogoutConfirm = ref(false);

    const getAvatarUrl = (filename) => {
      return new URL(`../../assets/avatars/${filename}`, import.meta.url).href;
    };

    const fetchAdminDetails = async (uid) => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          adminName.value = data.name || 'Administrator';
          adminAvatar.value = data.avatar || '';
        } else {
          console.warn('No user data found for UID:', uid);
        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, 'cvcWords'));
      words.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'cvc_category'));
      categories.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const addCategory = async () => {
      if (!newCategory.value.trim()) {
        toast.error('Category name cannot be empty.');
        return;
      }
      try {
        await addDoc(collection(db, 'cvc_category'), { name: newCategory.value.trim() });
        newCategory.value = '';
        await fetchCategories();
        toast.success('Category added successfully!');
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category. Please try again.');
      }
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    const confirmLogout = () => {
      showLogoutConfirm.value = true;
    };

    const logout = async () => {
      try {
        await signOut(auth);
        toast.success('You have been logged out.');
        window.location.href = '/login'; // Redirect to the login page
      } catch (error) {
        console.error('Error during logout:', error);
        toast.error('Failed to log out. Please try again.');
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, async (u) => {
        if (u) {
          user.value = u;
          await fetchAdminDetails(u.uid);
        } else {
          console.warn('User is not authenticated.');
        }
      });
      fetchWords();
      fetchCategories();
    });

    return {
      adminName,
      adminAvatar,
      getAvatarUrl,
      user,
      words,
      categories,
      newCategory,
      loading,
      showForm,
      showLogoutConfirm,
      fetchWords,
      fetchCategories,
      addCategory,
      toggleForm,
      confirmLogout,
      logout
    };
  }
};
</script>

<style scoped>
/* Removed old inline styles, using Tailwind CSS instead */
/* All styling is now handled through Tailwind utility classes for better maintainability */
</style>
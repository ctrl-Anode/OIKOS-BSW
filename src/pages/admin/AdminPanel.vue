<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-100 flex flex-col">
    <!-- ✅ Reusable Admin Topbar Component -->
    <Admin_Topbar
      :adminName="adminName"
      :adminAvatar="adminAvatar"
      :getAvatarUrl="getAvatarUrl"
      @logout-request="confirmLogout"
    />

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- CVC Word Management Section -->
      <div class="bg-white/90 backdrop-blur rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <!-- Section Header -->
        <div class="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-b border-gray-200 px-6 sm:px-8 py-5 sm:py-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span>
            CVC Word Management
          </h2>
          <p class="text-gray-600 text-sm mt-1">Manage and organize CVC words and categories effectively</p>
        </div>

        <!-- Controls Section -->
        <div class="px-6 sm:px-8 py-5 border-b border-gray-200 bg-gray-50">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Add New Word Button -->
            <div>
              <button
                @click="toggleForm"
                :class="[ 
                  'w-full px-5 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base',
                  showForm
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                ]"
              >
                <span>{{ showForm ? '✕' : '➕' }}</span>
                {{ showForm ? 'Close Form' : 'Add New CVC Word' }}
              </button>
            </div>

            <!-- Add Category Section -->
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="newCategory"
                type="text"
                placeholder="Enter new category name..."
                class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm sm:text-base"
              />
              <button
                @click="addCategory"
                :disabled="!newCategory.trim()"
                :class="[ 
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base',
                  newCategory.trim()
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span>🏷️</span>
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <transition name="slide-fade">
          <div
            v-if="showForm"
            class="px-6 sm:px-8 py-6 bg-indigo-50 border-b border-indigo-200 rounded-b-xl"
          >
            <CVCForm :categories="categories" @saved="fetchWords" @cancel="toggleForm" />
          </div>
        </transition>

        <!-- Words List Section -->
        <div class="px-6 sm:px-8 py-6">
          <CVCList :words="words" @updated="fetchWords" />
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow p-5 sm:p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all">
          <p class="text-gray-600 text-sm font-semibold">Total Words</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">{{ words.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-5 sm:p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all">
          <p class="text-gray-600 text-sm font-semibold">Total Categories</p>
          <p class="text-3xl font-bold text-purple-600 mt-2">{{ categories.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-5 sm:p-6 border-l-4 border-green-500 hover:shadow-lg transition-all">
          <p class="text-gray-600 text-sm font-semibold">Last Updated</p>
          <p class="text-lg font-semibold text-green-600 mt-2">Today</p>
        </div>
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
          <h3 class="text-lg font-bold text-gray-800">Confirm Logout</h3>
          <p class="text-gray-600 mt-2 text-sm">Are you sure you want to log out?</p>
          <div class="flex flex-col sm:flex-row justify-end gap-3 mt-5">
            <button
              @click="showLogoutConfirm = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              @click="logout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all w-full sm:w-auto"
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
import Admin_Topbar from '../../components/Admin_Topbar.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'AdminPanel',
  components: { CVCForm, CVCList, Admin_Topbar },
  setup() {
    const toast = useToast();
    const adminName = ref('');
    const adminAvatar = ref('');
    const user = ref(null);
    const words = ref([]);
    const categories = ref([]);
    const newCategory = ref('');
    const showForm = ref(false);
    const showLogoutConfirm = ref(false);

    const getAvatarUrl = (filename) =>
      new URL(`../../assets/avatars/${filename}`, import.meta.url).href;

    const fetchAdminDetails = async (uid) => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          adminName.value = data.name || 'Administrator';
          adminAvatar.value = data.avatar || '';
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

    const toggleForm = () => (showForm.value = !showForm.value);
    const confirmLogout = () => (showLogoutConfirm.value = true);

    const logout = async () => {
      try {
        await signOut(auth);
        toast.success('You have been logged out.');
        window.location.href = '/login';
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
          console.warn('User not authenticated.');
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
      showForm,
      showLogoutConfirm,
      fetchWords,
      fetchCategories,
      addCategory,
      toggleForm,
      confirmLogout,
      logout,
    };
  },
};
</script>

<style scoped>
/* Smooth slide and fade animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
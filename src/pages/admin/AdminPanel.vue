<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- Professional header with navigation and branding -->
    <header class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="text-2xl sm:text-3xl">📚</div>
            <div>
              <h1 class="text-xl sm:text-3xl font-bold">Admin Panel</h1>
              <p class="text-blue-100 text-xs sm:text-sm hidden sm:block">TinyTalkers Management</p>
            </div>
          </div>

          <!-- Desktop Admin Info -->
          <div class="hidden md:flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-blue-100">Welcome back</p>
              <p class="font-semibold">{{ adminName || 'Administrator' }}</p>
            </div>
            <img
              v-if="adminAvatar"
              :src="getAvatarUrl(adminAvatar)"
              alt="Avatar"
              class="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full object-cover border-2 border-white/30"
            />
            <button
              @click="confirmLogout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Log Out
            </button>
          </div>

          <!-- Mobile Admin Menu -->
          <div class="md:hidden relative">
            <button
              @click="toggleAdminDropdown"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <img
                v-if="adminAvatar"
                :src="getAvatarUrl(adminAvatar)"
                alt="Avatar"
                class="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
              <svg
                class="w-5 h-5 text-white transition-transform duration-200"
                :class="{ 'rotate-180': isAdminDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Mobile Dropdown Menu -->
            <transition name="dropdown">
              <div
                v-if="isAdminDropdownOpen"
                class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <p class="text-sm text-gray-600 font-medium">Administrator</p>
                  <p class="font-bold text-gray-800 truncate">
                    {{ adminName || 'Admin' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate mt-1">
                    {{ user?.email }}
                  </p>
                </div>
                <button
                  @click="confirmLogout"
                  class="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 text-red-600 font-semibold"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </transition>

            <!-- Mobile Dropdown Backdrop -->
            <div
              v-if="isAdminDropdownOpen"
              @click="closeAdminDropdown"
              class="md:hidden fixed inset-0 bg-black/20 z-40"
            ></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Improved CVC Manager section with better layout and spacing -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Section Header -->
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span>
            <span>CVC Word Management</span>
          </h2>
          <p class="text-gray-600 text-xs sm:text-sm mt-1">Manage and organize CVC words and categories</p>
        </div>

        <!-- Controls Section -->
        <div class="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <!-- Add New Word Button -->
            <div>
              <button
                @click="toggleForm"
                :class="[
                  'w-full px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95',
                  showForm
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                ]"
              >
                <span class="text-lg">{{ showForm ? '✕' : '➕' }}</span>
                <span class="text-sm sm:text-base">{{ showForm ? 'Close Form' : 'Add New CVC Word' }}</span>
              </button>
            </div>

            <!-- Add Category Section -->
            <div class="flex gap-2">
              <input
                v-model="newCategory"
                type="text"
                placeholder="Enter new category..."
                class="flex-1 px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
              />
              <button
                @click="addCategory"
                :disabled="!newCategory.trim()"
                :class="[
                  'px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-md active:scale-95 whitespace-nowrap',
                  newCategory.trim()
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span class="text-lg">🏷️</span>
                <span class="hidden sm:inline text-sm sm:text-base">Add Category</span>
              </button>
              <button
                @click="toggleCategoryModal"
                class="px-4 sm:px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                🛠️
              </button>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <transition name="slide-down">
          <div v-if="showForm" class="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200">
            <CVCForm :categories="categories" @saved="fetchWords" @cancel="toggleForm" />
          </div>
        </transition>

        <!-- Words List Section -->
        <div class="px-4 sm:px-8 py-4 sm:py-6">
          <CVCList :words="words" @updated="fetchWords" />
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm font-semibold">Total Words</p>
              <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{{ words.length }}</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-20">📖</div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm font-semibold">Total Categories</p>
              <p class="text-2xl sm:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{{ categories.length }}</p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-20">🏷️</div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-6 border-l-4 border-green-500 sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm font-semibold">Status</p>
              <p class="text-lg sm:text-xl font-semibold text-green-600 mt-1 sm:mt-2 flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </p>
            </div>
            <div class="text-3xl sm:text-4xl opacity-20">✅</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <transition name="modal-fade">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="showLogoutConfirm = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all">
          <div class="text-center mb-4">
            <div class="text-5xl mb-3">⚠️</div>
            <h3 class="text-xl font-bold text-gray-800">Confirm Logout</h3>
          </div>
          <p class="text-gray-600 text-center mb-6">Are you sure you want to log out of the admin panel?</p>
          <div class="flex gap-3">
            <button
              @click="showLogoutConfirm = false"
              class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              @click="logout"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Category Management Modal -->
    <transition name="modal-fade">
      <div
        v-if="showCategoryModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="toggleCategoryModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🏷️</span>
              <div>
                <h3 class="text-xl sm:text-2xl font-bold">Manage Categories</h3>
                <p class="text-blue-100 text-xs sm:text-sm mt-0.5">Edit or delete existing categories</p>
              </div>
            </div>
            <button
              @click="toggleCategoryModal"
              class="p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <!-- Empty State -->
            <div v-if="categories.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4 opacity-50">📂</div>
              <p class="text-gray-500 text-lg font-semibold">No categories yet</p>
              <p class="text-gray-400 text-sm mt-2">Add your first category to get started</p>
            </div>

            <!-- Categories List -->
            <div v-else class="space-y-3">
              <div 
                v-for="(category, index) in categories" 
                :key="category.id" 
                class="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <!-- Category Number Badge -->
                  <div class="flex items-center gap-3 flex-1 w-full sm:w-auto">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {{ index + 1 }}
                    </div>
                    
                    <!-- Category Input -->
                    <input
                      v-model="category.name"
                      type="text"
                      placeholder="Category name..."
                      :disabled="editingCategoryId !== category.id"
                      :class="[
                        'flex-1 px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base font-medium',
                        editingCategoryId === category.id ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-100 text-gray-700'
                      ]"
                      @keyup.enter="editingCategoryId === category.id ? saveCategory(category) : null"
                    />
                  </div>

                  <!-- Action Button -->
                  <div class="w-full sm:w-auto">
                    <button
                      v-if="editingCategoryId === category.id"
                      @click="saveCategory(category)"
                      class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save</span>
                    </button>
                    <button
                      v-else
                      @click="startEditing(category.id)"
                      class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <!-- Delete Button (appears when editing) -->
                <transition name="slide-down">
                  <div v-if="editingCategoryId === category.id" class="mt-3 pt-3 border-t border-gray-200">
                    <button
                      @click="confirmDeleteCategory(category.id)"
                      class="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Category</span>
                    </button>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Delete Confirmation Overlay -->
          <transition name="slide-up">
            <div v-if="categoryToDelete" class="border-t-2 border-red-200 bg-red-50 p-4 sm:p-6 rounded-b-2xl">
              <div class="flex items-start gap-3 mb-4">
                <div class="text-3xl">⚠️</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-red-800 mb-1">Confirm Deletion</h4>
                  <p class="text-red-700 text-sm">Are you sure you want to delete this category? This action cannot be undone.</p>
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  @click="cancelDeleteCategory"
                  class="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-all active:scale-95 border-2 border-gray-300"
                >
                  Cancel
                </button>
                <button
                  @click="deleteCategory"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </transition>

          <!-- Modal Footer -->
          <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <span class="font-semibold text-blue-600">{{ categories.length }}</span> 
                {{ categories.length === 1 ? 'category' : 'categories' }} total
              </span>
              <button
                @click="toggleCategoryModal"
                class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all active:scale-95"
              >
                Close
              </button>
            </div>
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
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
    const isAdminDropdownOpen = ref(false);
    const showCategoryModal = ref(false);
    const categoryToDelete = ref(null);
    const editingCategoryId = ref(null);

    const getAvatarUrl = (filename) => {
      return new URL(`../../assets/avatars/${filename}`, import.meta.url).href;
    };

    const toggleAdminDropdown = () => {
      isAdminDropdownOpen.value = !isAdminDropdownOpen.value;
    };

    const closeAdminDropdown = () => {
      isAdminDropdownOpen.value = false;
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
      
      // Check minimum length
      if (newCategory.value.trim().length < 2) {
        toast.error('Category name must be at least 2 characters long.');
        return;
      }
      
      // Check for duplicates
      const categoryName = newCategory.value.trim();
      const duplicate = categories.value.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
      if (duplicate) {
        toast.error(`Category "${categoryName}" already exists.`);
        return;
      }
      
      try {
        await addDoc(collection(db, 'cvc_category'), { 
          name: categoryName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
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
      closeAdminDropdown();
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

    const toggleCategoryModal = () => {
      showCategoryModal.value = !showCategoryModal.value;
      if (!showCategoryModal.value) {
        editingCategoryId.value = null;
        categoryToDelete.value = null;
      }
    };

    const startEditing = (categoryId) => {
      editingCategoryId.value = categoryId;
    };

    const saveCategory = async (category) => {
      if (!category.name.trim()) {
        toast.error('Category name cannot be empty.');
        return;
      }

      if (category.name.trim().length < 2) {
        toast.error('Category name must be at least 2 characters long.');
        return;
      }

      try {
        const categoryRef = doc(db, 'cvc_category', category.id);
        await updateDoc(categoryRef, { 
          name: category.name.trim(),
          updatedAt: new Date().toISOString()
        });
        editingCategoryId.value = null;
        toast.success('Category updated successfully!');
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category. Please try again.');
      }
    };

    const updateCategory = async (category) => {
      await saveCategory(category);
    };

    const confirmDeleteCategory = (categoryId) => {
      categoryToDelete.value = categoryId;
    };

    const cancelDeleteCategory = () => {
      categoryToDelete.value = null;
    };

    const deleteCategory = async () => {
      if (!categoryToDelete.value) return;
      try {
        const categoryRef = doc(db, 'cvc_category', categoryToDelete.value);
        await deleteDoc(categoryRef);
        categoryToDelete.value = null;
        editingCategoryId.value = null;
        await fetchCategories();
        toast.success('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again.');
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
      logout,
      isAdminDropdownOpen,
      toggleAdminDropdown,
      closeAdminDropdown,
      showCategoryModal,
      toggleCategoryModal,
      updateCategory,
      confirmDeleteCategory,
      cancelDeleteCategory,
      deleteCategory,
      categoryToDelete,
      editingCategoryId,
      startEditing,
      saveCategory
    };
  }
};
</script>

<style scoped>
/* Ensure dropdown visibility and transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Modal fade transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.9);
}

/* Slide down transition for form */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Slide up transition for delete confirmation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
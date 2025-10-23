<template>
  <div class="admin-panel">
    <h1 class="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div v-if="currentTab === 'dashboard'">
      <div class="min-h-screen flex flex-col items-center justify-center">
        <h2 class="text-2xl font-bold mb-4">Welcome, {{ user?.displayName || 'Admin' }}</h2>
        <button @click="logout" class="btn">Logout</button>
        <div v-if="loading" class="mt-4">Loading users...</div>
        <ul v-else>
          <li v-for="u in users" :key="u.id">
            {{ u.name }} - {{ u.role }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="currentTab === 'cvcManager'">
      <div class="admin-cvc-manager">
        <h2 class="text-2xl font-bold mb-4">CVC Word Management</h2>
        <button @click="toggleForm" class="btn">
          {{ showForm ? 'Close Form' : 'Add New CVC Word' }}
        </button>
        <CVCForm v-if="showForm" @saved="fetchWords" @cancel="toggleForm" />
        <CVCList :words="words" @updated="fetchWords" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import CVCForm from './CVCForm.vue';
import CVCList from './CVCList.vue';

export default {
  name: 'AdminPanel',
  components: { CVCForm, CVCList },
  setup() {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'cvcManager', label: 'CVC Manager' }
    ];
    const currentTab = ref('dashboard');

    const user = ref(null);
    const users = ref([]);
    const words = ref([]);
    const loading = ref(true);
    const showForm = ref(false);

    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, 'cvcWords'));
      words.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    const deleteWord = async (wordId) => {
      words.value = words.value.filter((word) => word.id !== wordId);
    };

    const logout = () => {
      signOut(auth).then(() => {
        console.log('Logged out');
      });
    };

    onMounted(async () => {
      onAuthStateChanged(auth, async (u) => {
        if (!u) return;
        user.value = u;
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const querySnapshot = await getDocs(collection(db, 'users'));
          users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
        loading.value = false;
      });
      await fetchWords();
    });

    return {
      tabs,
      currentTab,
      user,
      users,
      words,
      loading,
      showForm,
      fetchWords,
      toggleForm,
      deleteWord,
      logout
    };
  }
};
</script>

<style scoped>
.admin-panel {
  padding: 20px;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.tabs button {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  border-radius: 5px;
}
.tabs button.active {
  background-color: #007bff;
  color: white;
}
.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn:hover {
  background-color: #0056b3;
}
</style>
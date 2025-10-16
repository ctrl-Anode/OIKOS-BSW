import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const app = createApp(App);
app.use(router);

// Firebase authentication state listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('User signed in:', user);
    sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      role: user.role || 'user', // Example: Add role if available
    }));
  } else {
    console.log('No user signed in');
    sessionStorage.removeItem('user');
  }
});

app.mount('#app');

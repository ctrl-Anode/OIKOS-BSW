import { createApp } from 'vue';
import './style.css'
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './style.css';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const messages = {
  en: {
    errors: {
      passwordTooShort: 'Password must be at least 8 characters.',
      passwordsDoNotMatch: 'Passwords do not match.',
      mustAgreeToTerms: 'You must agree to the terms and conditions.',
      emailAlreadyRegistered: 'This email is already registered.',
      emailRequired: 'Email is required.',
      emailNotEligibleForPasswordReset: 'This email is not eligible for password reset.',
    },
    success: {
      registrationSuccessful: 'Registration successful!',
      passwordResetEmailSent: 'Password reset email sent successfully!',
      loginSuccessful: 'Login successful!',
    },
    labels: {
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
    },
    tooltips: {
      passwordRequirements: 'Password must be at least 8 characters long.',
    },
  },

  es: {
    errors: {
      passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
      passwordsDoNotMatch: 'Las contraseñas no coinciden.',
      mustAgreeToTerms: 'Debe aceptar los términos y condiciones.',
      emailAlreadyRegistered: 'Este correo ya está registrado.',
      emailRequired: 'El correo electrónico es obligatorio.',
      emailNotEligibleForPasswordReset: 'Este correo no es elegible para restablecer la contraseña.',
    },
    success: {
      registrationSuccessful: '¡Registro exitoso!',
      passwordResetEmailSent: '¡Correo de restablecimiento de contraseña enviado con éxito!',
      loginSuccessful: '¡Inicio de sesión exitoso!',
    },
    labels: {
      password: 'Contraseña',
      rememberMe: 'Recuérdame',
      forgotPassword: '¿Olvidaste tu contraseña?',
    },
    tooltips: {
      passwordRequirements: 'La contraseña debe tener al menos 8 caracteres.',
    },
  },
};

const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language
  messages, // Localization messages
});

const app = createApp(App);
app.use(router);
app.use(i18n); // Initialize vue-i18n

// Firebase authentication state listener
onAuthStateChanged(auth, user => {
  if (user) {
    if (!sessionStorage.getItem('user')) {
      console.log('User signed in:', user);
      sessionStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: user.role || 'user', // Example: Add role if available
      }));
    }
  } else {
    if (sessionStorage.getItem('user')) {
      console.log('No user signed in');
      sessionStorage.removeItem('user');
    }
  }
});

// Configure Toastification
const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

app.use(Toast, toastOptions);

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Ensure prompt() is called when the user interacts with the "Download App" button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the default banner
  window.deferredPrompt = e; // Save the event for later use
});

function installPWA() {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      window.deferredPrompt = null;
    });
  }
}

app.mount('#app');

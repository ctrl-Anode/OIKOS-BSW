import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import WelcomePage from '../pages/user/WelcomePage.vue'
import LearningHubPage from '../pages/user/LearningHubPage.vue'
import AdminPanel from '../pages/admin/AdminPanel.vue'
import { auth } from '../firebase';

// Route guard to check admin access
async function requireAdmin(to, from, next) {
  const user = auth.currentUser;

  if (!user) {
    return next('/login'); // Redirect unauthenticated users to login
  }

  try {
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin) {
      return next(); // User is an admin
    } else {
      return next('/login'); // Redirect non-admins to login
    }
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return next('/login'); // Redirect on error
  }
}

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/app', component: WelcomePage },
  { path: '/app/hub', component: LearningHubPage },
  // Consolidated: redirect old CVC route to the Hub
  { path: '/app/learn-cvc', redirect: '/app/hub' },
  { path: '/admin', component: AdminPanel },
  { path: '/admin/cvc-manager', redirect: '/admin' },
  { path: '/admin/manage-panel', redirect: '/admin' },
  { path: '/admin/cvc-form', redirect: '/admin' },
  { path: '/admin/cvc-list', redirect: '/admin' },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
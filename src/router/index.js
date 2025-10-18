import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import WelcomePage from '../pages/user/WelcomePage.vue'
import LearningHubPage from '../pages/user/LearningHubPage.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/app', component: WelcomePage },
  { path: '/app/hub', component: LearningHubPage },
  { path: '/admin', component: AdminDashboard },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
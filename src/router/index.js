import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';

// Updated routes with role-based access
const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('../components/LandingPage.vue'),
  },
  {
    path: '/app',
    name: 'App',
    component: () => import('../components/HelloWorld.vue'),
  },
//   {
//     path: '/about',
//     name: 'About',
//     component: () => import('../components/About.vue'),
//     meta: { roles: ['admin', 'user'] }, // Only accessible by 'admin' and 'user' roles
//   },
//   {
//     path: '/admin',
//     name: 'Admin',
//     component: () => import('../components/Admin.vue'), // Create this component later
//     meta: { roles: ['admin'] }, // Only accessible by 'admin' role
//   },
//   {
//     path: '/not-authorized',
//     name: 'NotAuthorized',
//     component: () => import('../components/NotAuthorized.vue'), // Create this component later
//   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware to check user roles
router.beforeEach((to, from, next) => {
  const user = auth.currentUser; // Fetch the current user from Firebase

  if (to.meta.roles) {
    const userRole = user?.role || localStorage.getItem('userRole'); // Use Firebase user role or fallback to localStorage

    if (!userRole || !to.meta.roles.includes(userRole)) {
      // Redirect to a 'Not Authorized' or 'Login' page if the user role is not allowed
      return next({ path: '/not-authorized' });
    }
  }

  next();
});

export default router;
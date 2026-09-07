import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { finishNavigation, startNavigation } from '../services/loading'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },

  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue'),
  },

  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
  },

  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue'),
  },

  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },

  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('../views/WishlistView.vue'),
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },

  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: {
    requiresAuth: true,
  },
  },
  {
    path: '/order-success',
    name: 'order-success',
    component: () => import('../views/OrderSuccess.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/Orders.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPassword.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: {
    requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to) => {

  startNavigation()

  const authStore = useAuthStore()

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {

    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }

  }

})

router.afterEach(() => {
  finishNavigation()
})

router.onError(() => {
  finishNavigation()
})
export default router

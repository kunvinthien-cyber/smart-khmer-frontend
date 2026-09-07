// import { computed, ref } from 'vue'
// import { defineStore } from 'pinia'

// const STORAGE_KEY = 'smart-khmer-user'

// export const useAuthStore = defineStore('auth', () => {

//   const savedUser = JSON.parse(
//     localStorage.getItem(STORAGE_KEY) || 'null'
//   )

//   const user = ref(savedUser)


//   // ========================================
//   // Login
//   // ========================================

//   const login = async (email) => {

//     // Demo user only.
//     // Real authentication will be handled by Laravel later.

//     const demoUser = {
//       id: 1,
//       name: 'Smart Customer',
//       email,
//       avatar: null,
//     }

//     user.value = demoUser

//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify(demoUser)
//     )

//     return demoUser
//   }


//   // ========================================
//   // Register
//   // ========================================

//   const register = async ({
//     name,
//     email,
//   }) => {

//     const newUser = {
//       id: Date.now(),
//       name,
//       email,
//       avatar: null,
//     }

//     user.value = newUser

//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify(newUser)
//     )

//     return newUser
//   }


//   // ========================================
//   // Logout
//   // ========================================

//   const logout = () => {

//     user.value = null

//     localStorage.removeItem(
//       STORAGE_KEY
//     )

//   }

//   const updateProfile = (updates) => {
//     if (!user.value) return

//     user.value = {
//       ...user.value,
//       ...updates,
//     }

//     localStorage.setItem(
//       STORAGE_KEY,
//       JSON.stringify(user.value)
//     )
//   }


//   // ========================================
//   // Authentication Status
//   // ========================================

//   const isAuthenticated = computed(() => {
//     return !!user.value
//   })


//   return {
//     user,
//     isAuthenticated,

//     login,
//     register,
//     updateProfile,
//     logout,
//   }
// })
import { defineStore } from 'pinia';
import api from '@/services/api';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('user');

    return null;
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser(),
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/login', { email, password });
        const { user, token } = response.data.data;

        this.user = user;
        this.token = token;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(formData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/register', formData);
        const { user, token } = response.data.data;

        this.user = user;
        this.token = token;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/logout');
        }
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;
      try {
        const response = await api.get('/user');
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch {
        this.logout();
      }
    }
  }
});

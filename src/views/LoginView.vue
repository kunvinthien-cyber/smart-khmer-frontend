<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()

const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const login = async () => {

  if (!form.email || !form.password) {

    toastStore.showToast(
      'Please enter your email and password',
      'error'
    )

    return
  }


  loading.value = true

  await new Promise(resolve => {
    setTimeout(resolve, 800)
  })


  try {
    await authStore.login(form.email, form.password)
    toastStore.showToast('Welcome back!')
    router.push('/')
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || (error.request
        ? 'Cannot connect to the server. Please try again later.'
        : 'Unable to sign in. Please check your details.'),
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>


<template>

  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">

    <div class="w-full max-w-md">

      <!-- Logo -->

      <RouterLink
        to="/"
        class="flex items-center justify-center gap-2"
      >

        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl text-white"
        >
          <i class="fa-solid fa-bag-shopping"></i>
        </div>

        <span class="text-2xl font-bold text-gray-900">
          Smart Khmer
        </span>

      </RouterLink>


      <!-- Card -->

      <div class="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

        <div class="text-center">

          <h1 class="text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            Sign in to continue shopping
          </p>

        </div>


        <form
          class="mt-8 space-y-5"
          @submit.prevent="login"
        >

          <!-- Email -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div class="relative">

              <i
                class="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>

              <input
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

            </div>

          </div>


          <!-- Password -->

          <div>

            <div class="mb-2 flex justify-between">

              <label class="text-sm font-medium text-gray-700">
                Password
              </label>

              <RouterLink
                to="/forgot-password"
                class="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Forgot Password?
              </RouterLink>

            </div>

            <div class="relative">

              <i
                class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>

              <input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                class="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

            </div>

          </div>


          <!-- Login -->

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <i
              v-if="loading"
              class="fa-solid fa-spinner fa-spin"
            ></i>

            <i
              v-else
              class="fa-solid fa-right-to-bracket"
            ></i>

            {{ loading ? 'Signing in...' : 'Sign In' }}

          </button>

        </form>


        <!-- Register -->

        <p class="mt-6 text-center text-sm text-gray-500">

          Don't have an account?

          <RouterLink
            to="/register"
            class="font-semibold text-green-600 hover:text-green-700"
          >
            Create Account
          </RouterLink>

        </p>

      </div>

    </div>

  </div>

</template>

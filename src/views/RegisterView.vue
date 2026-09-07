<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

defineOptions({
  name: 'RegisterPage',
})

const router = useRouter()

const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})


const register = async () => {

  if (
    !form.name ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {

    toastStore.showToast(
      'Please complete all fields',
      'error'
    )

    return
  }


  if (form.password !== form.confirmPassword) {

    toastStore.showToast(
      'Passwords do not match',
      'error'
    )

    return
  }


  if (form.password.length < 6) {

    toastStore.showToast(
      'Password must be at least 6 characters',
      'error'
    )

    return
  }


  loading.value = true

  await new Promise(resolve => {
    setTimeout(resolve, 800)
  })


  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
    })
    toastStore.showToast('Account created successfully!')
    router.push('/')
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || 'Unable to create your account.',
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
            Create Account
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            Join Smart Khmer Marketplace
          </p>

        </div>


        <form
          class="mt-8 space-y-5"
          @submit.prevent="register"
        >

          <!-- Name -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Email -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Password -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              v-model="form.password"
              type="password"
              placeholder="Minimum 6 characters"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Confirm -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Button -->

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >

            <i
              v-if="loading"
              class="fa-solid fa-spinner fa-spin"
            ></i>

            <i
              v-else
              class="fa-solid fa-user-plus"
            ></i>

            {{ loading ? 'Creating...' : 'Create Account' }}

          </button>

        </form>


        <p class="mt-6 text-center text-sm text-gray-500">

          Already have an account?

          <RouterLink
            to="/login"
            class="font-semibold text-green-600 hover:text-green-700"
          >
            Sign In
          </RouterLink>

        </p>

      </div>

    </div>

  </div>

</template>

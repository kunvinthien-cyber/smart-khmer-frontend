<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import { t } from '../i18n'

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
      t('completeFields'),
      'error'
    )

    return
  }


  if (form.password !== form.confirmPassword) {

    toastStore.showToast(
      t('passwordsMismatch'),
      'error'
    )

    return
  }


  if (form.password.length < 8) {

    toastStore.showToast(
      t('passwordLength'),
      'error'
    )

    return
  }


  loading.value = true

  await new Promise(resolve => {
    setTimeout(resolve, 800)
  })


  try {
    const response = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
    })
    toastStore.showToast(
      response?.message || t('registrationSubmitted'),
    )
    router.push('/login')
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || (error.request
        ? t('loginErrorServer')
        : t('unableCreate')),
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
            {{ t('registerTitle') }}
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            {{ t('registerSubtitle') }}
          </p>

        </div>


        <form
          class="mt-8 space-y-5"
          @submit.prevent="register"
        >

          <!-- Name -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ t('fullName') }}
            </label>

            <input
              v-model="form.name"
              type="text"
              :placeholder="t('yourName')"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Email -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ t('loginEmail') }}
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
              {{ t('loginPassword') }}
            </label>

            <input
              v-model="form.password"
              type="password"
              :placeholder="t('passwordMinimum')"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Confirm -->

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ t('confirmPassword') }}
            </label>

            <input
              v-model="form.confirmPassword"
              type="password"
              :placeholder="t('confirmPasswordPlaceholder')"
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

            {{ loading ? t('creating') : t('createAccount') }}

          </button>

        </form>


        <p class="mt-6 text-center text-sm text-gray-500">

          {{ t('haveAccount') }}

          <RouterLink
            to="/login"
            class="font-semibold text-green-600 hover:text-green-700"
          >
            {{ t('signIn') }}
          </RouterLink>

        </p>

      </div>

    </div>

  </div>

</template>

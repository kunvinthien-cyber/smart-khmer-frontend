<script setup>
import { ref } from 'vue'
import { useToastStore } from '../stores/toastStore'
import { t } from '../i18n'
import api from '../services/api'

defineOptions({
  name: 'ForgotPasswordPage',
})

const toastStore = useToastStore()

const email = ref('')
const loading = ref(false)

const submit = async () => {

  if (!email.value) {

    toastStore.showToast(
      t('loginMissing'),
      'error'
    )

    return
  }


  loading.value = true

  try {
    await api.post('/forgot-password', { email: email.value })
    toastStore.showToast(t('resetSent'))
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || t('resetError'),
      'error',
    )
  } finally {
    loading.value = false
  }
}
</script>


<template>

  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">

    <div class="w-full max-w-md">

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


      <div class="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

        <div class="text-center">

          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl text-green-600"
          >
            <i class="fa-solid fa-key"></i>
          </div>

          <h1 class="mt-5 text-2xl font-bold text-gray-900">
            {{ t('forgotPassword') }}
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            {{ t('resetSubtitle') }}
          </p>

        </div>


        <form
          class="mt-8 space-y-5"
          @submit.prevent="submit"
        >

          <div>

            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ t('loginEmail') }}
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


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
              class="fa-solid fa-paper-plane"
            ></i>

            {{ loading ? t('sending') : t('sendReset') }}

          </button>

        </form>


        <RouterLink
          to="/login"
          class="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-green-600"
        >
          <i class="fa-solid fa-arrow-left"></i>
          {{ t('backLogin') }}
        </RouterLink>

      </div>

    </div>

  </div>

</template>


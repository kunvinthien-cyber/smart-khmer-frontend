<script setup>
import { t } from '../i18n'
</script>

<template>
  <section class="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
    <div class="max-w-lg text-center">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
        Error 404
      </p>

      <h1 class="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
        {{ t('pageNotFound') }}
      </h1>

      <p class="mt-4 text-gray-500">
        {{ t('pageNotFoundText') }}
      </p>

      <RouterLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        <i class="fa-solid fa-house"></i>
        {{ t('backHomeLower') }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Toast from './components/common/Toast.vue'
import { finishInitialLoading, isLoading } from './services/loading'

onMounted(() => {
  window.setTimeout(finishInitialLoading, 250)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <Navbar />

    <main>
      <RouterView />
    </main>

    <Footer />
    <Toast />

    <Transition name="fade">
      <div
        v-if="isLoading"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]"
        role="status"
        aria-live="polite"
      >
        <div class="flex min-w-44 flex-col items-center rounded-2xl bg-white px-7 py-6 shadow-2xl">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
          <p class="mt-4 text-sm font-bold text-slate-800">Loading...</p>
          <p class="mt-1 text-xs text-slate-500">Please wait a moment</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

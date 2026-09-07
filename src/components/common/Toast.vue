<script setup>
import { useToastStore } from '../../stores/toastStore'

defineOptions({
  name: 'ToastNotification',
})

const toastStore = useToastStore()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="translate-x-10 opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-200"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-10 opacity-0"
  >

    <div
      v-if="toastStore.visible"
      class="fixed right-4 top-24 z-9999 flex min-w-70 max-w-sm items-center gap-3 rounded-xl border bg-white p-4 shadow-xl"
    >

      <!-- Icon -->

      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        :class="
          toastStore.type === 'success'
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        "
      >
        <i
          :class="
            toastStore.type === 'success'
              ? 'fa-solid fa-check'
              : 'fa-solid fa-circle-exclamation'
          "
        ></i>
      </div>


      <!-- Message -->

      <p class="flex-1 text-sm font-medium text-gray-800">
        {{ toastStore.message }}
      </p>


      <!-- Close -->

      <button
        type="button"
        class="text-gray-400 hover:text-gray-700"
        @click="toastStore.hideToast"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

    </div>

  </Transition>
</template>


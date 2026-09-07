
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('success')

  let timer = null

  const showToast = (
    text,
    toastType = 'success'
  ) => {
    message.value = text
    type.value = toastType
    visible.value = true

    clearTimeout(timer)

    timer = setTimeout(() => {
      visible.value = false
    }, 2500)
  }

  const hideToast = () => {
    visible.value = false
    clearTimeout(timer)
  }

  return {
    visible,
    message,
    type,
    showToast,
    hideToast,
  }
})


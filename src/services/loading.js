import { computed, ref } from 'vue'

const isInitialLoading = ref(true)
const isNavigating = ref(false)
const activeRequests = ref(0)

export const isLoading = computed(() => (
  isInitialLoading.value ||
  isNavigating.value ||
  activeRequests.value > 0
))

export const startNavigation = () => {
  isNavigating.value = true
}

export const finishNavigation = () => {
  isNavigating.value = false
}

export const startRequest = () => {
  activeRequests.value += 1
}

export const finishRequest = () => {
  activeRequests.value = Math.max(0, activeRequests.value - 1)
}

export const finishInitialLoading = () => {
  isInitialLoading.value = false
}

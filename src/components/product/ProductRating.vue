
<script setup>
defineProps({
  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="flex items-center gap-2">

    <div class="flex items-center gap-0.5 text-sm text-yellow-400">
      <i class="fa-solid fa-star"></i>
      <span class="ml-1 font-medium text-gray-700">
        {{ rating }}
      </span>
    </div>

    <span class="text-xs text-gray-400">
      ({{ reviews }})
    </span>

  </div>
</template>

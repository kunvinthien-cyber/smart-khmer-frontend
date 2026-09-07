
<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>

  <div
    v-if="products.length"
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
  >

    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />

  </div>

  <div
    v-else
    class="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
  >

    <i
      class="fa-solid fa-box-open text-4xl text-gray-300"
    ></i>

    <h3 class="mt-4 font-semibold text-gray-700">
      No products found
    </h3>

    <p class="mt-1 text-sm text-gray-400">
      Try searching for another product.
    </p>

  </div>

</template>

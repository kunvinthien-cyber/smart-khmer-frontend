
<script setup>
import { useWishlistStore } from '../stores/wishlistStore'
import { t } from '../i18n'

const wishlistStore = useWishlistStore()
</script>


<template>

  <div class="bg-gray-50 min-h-screen">

    <!-- Header -->

    <section class="border-b bg-white">

      <div class="mx-auto max-w-7xl px-4 py-10">

        <div class="flex items-center gap-2 text-sm text-gray-500">

          <RouterLink
            to="/"
            class="hover:text-green-600"
          >
            {{ t('home') }}
          </RouterLink>

          <i class="fa-solid fa-chevron-right text-xs"></i>

          <span class="text-gray-900">
            {{ t('wishlist') }}
          </span>

        </div>

        <div class="mt-4 flex items-center gap-3">

          <h1 class="text-3xl font-bold text-gray-900">
            {{ t('myWishlist') }}
          </h1>

          <span
            class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
          >
            {{ wishlistStore.totalItems }}
          </span>

        </div>

      </div>

    </section>


    <!-- Empty -->

    <section
      v-if="wishlistStore.items.length === 0"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-4xl text-red-400"
      >
        <i class="fa-regular fa-heart"></i>
      </div>

      <h2 class="mt-6 text-2xl font-bold text-gray-900">
        {{ t('emptyWishlist') }}
      </h2>

      <p class="mt-2 text-gray-500">
        {{ t('emptyWishlistText') }}
      </p>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-bag-shopping"></i>
        {{ t('exploreProducts') }}
      </RouterLink>

    </section>


    <!-- Wishlist -->

    <section
      v-else
      class="mx-auto max-w-7xl px-4 py-10"
    >

      <div class="flex justify-end">

        <button
          type="button"
          class="text-sm font-medium text-red-500 hover:text-red-600"
          @click="wishlistStore.clearWishlist"
        >
          <i class="fa-solid fa-trash-can mr-1"></i>
          {{ t('clearWishlist') }}
        </button>

      </div>


      <div
        class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >

        <article
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >

          <!-- Remove -->

          <button
            type="button"
            class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50"
            :aria-label="t('removeWishlist')"
            @click="wishlistStore.removeFromWishlist(item.id)"
          >
            <i class="fa-solid fa-heart"></i>
          </button>


          <!-- Image -->

          <RouterLink
            :to="`/products/${item.id}`"
            class="block bg-gray-100"
          >

            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="h-56 w-full object-contain p-4 transition duration-500 group-hover:scale-105"
              loading="lazy"
            />

          </RouterLink>


          <!-- Info -->

          <div class="p-4">

            <RouterLink
              :to="`/products/${item.id}`"
              class="line-clamp-2 font-semibold text-gray-900 hover:text-green-600"
            >
              {{ item.title }}
            </RouterLink>


            <div class="mt-3 flex items-center gap-2">

              <span class="text-lg font-bold text-gray-900">
                ${{ item.price.toFixed(2) }}
              </span>

              <span class="text-sm text-yellow-500">
                <i class="fa-solid fa-star"></i>
                {{ item.rating }}
              </span>

            </div>


            <RouterLink
              :to="`/products/${item.id}`"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
            >
              <i class="fa-solid fa-cart-plus"></i>
              {{ t('viewProduct') }}
            </RouterLink>

          </div>

        </article>

      </div>

    </section>

  </div>

</template>


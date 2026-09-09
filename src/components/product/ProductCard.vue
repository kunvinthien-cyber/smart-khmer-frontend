<script setup>
import ProductRating from './ProductRating.vue'
import { useWishlistStore } from '../../stores/wishlistStore'
import { useCartStore } from '../../stores/cartStore'
import { t } from '../../i18n'
const props = defineProps({ product: { type: Object, required: true } })
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const originalPrice = () => (props.product.price / (1 - props.product.discountPercentage / 100)).toFixed(2)
</script>
<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <button type="button" class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-110" :class="wishlistStore.isInWishlist(product.id) ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'" :aria-label="wishlistStore.isInWishlist(product.id) ? t('removeWishlist') : t('addWishlist')" @click="wishlistStore.toggleWishlist(product)"><i :class="wishlistStore.isInWishlist(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i></button>
    <RouterLink :to="`/products/${product.id}`" class="relative block overflow-hidden bg-slate-100"><img :src="product.thumbnail" :alt="product.title" class="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56" loading="lazy" /><span v-if="product.discountPercentage" class="absolute bottom-3 left-3 rounded-lg bg-rose-500 px-2 py-1 text-xs font-bold text-white">-{{ Math.round(product.discountPercentage) }}%</span></RouterLink>
    <div class="flex flex-1 flex-col p-4"><p class="text-xs font-bold uppercase tracking-wide text-emerald-600">{{ product.category }}</p><RouterLink :to="`/products/${product.id}`" class="mt-2 line-clamp-2 min-h-12 font-semibold leading-6 text-slate-900 transition hover:text-emerald-600">{{ product.title }}</RouterLink><div class="mt-3"><ProductRating :rating="product.rating" :reviews="product.reviews?.length || 0" /></div><div class="mt-4 flex items-baseline gap-2"><span class="text-xl font-bold text-slate-900">${{ Number(product.price).toFixed(2) }}</span><span v-if="product.discountPercentage" class="text-xs text-slate-400 line-through">${{ originalPrice() }}</span></div><button class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[.98]" @click="cartStore.addToCart(product)"><i class="fa-solid fa-cart-plus"></i>{{ t('addToCart') }}</button></div>
  </article>
</template>

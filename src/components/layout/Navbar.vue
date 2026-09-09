<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { useWishlistStore } from '../../stores/wishlistStore'
import { setLocale, currentLocale, t } from '../../i18n'

defineOptions({ name: 'AppNavbar' })
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const mobileMenuOpen = ref(false)
const showAccountMenu = ref(false)
const searchQuery = ref('')
const handleSearch = () => {
  router.push({ path: '/products', query: searchQuery.value.trim() ? { search: searchQuery.value.trim() } : {} })
  mobileMenuOpen.value = false
}
const logout = () => {
  authStore.logout()
  showAccountMenu.value = false
  router.push('/')
}
const toggleLanguage = () => {
  setLocale(currentLocale.value === 'en' ? 'kh' : 'en')
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
    <div class="bg-emerald-700 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm"><i class="fa-solid fa-truck-fast mr-2"></i>{{ t('navDelivery') }}</div>
    <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
      <RouterLink to="/" class="shrink-0" aria-label="Smart Khmer home"><img src="/IMG/image.png" alt="Smart Khmer" class="h-11 w-11 rounded-xl object-contain" /></RouterLink>
      <nav class="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex"><RouterLink to="/" class="nav-link">{{ t('navHome') }}</RouterLink><RouterLink to="/products" class="nav-link">{{ t('navShop') }}</RouterLink><RouterLink to="/categories" class="nav-link">{{ t('navCategories') }}</RouterLink></nav>
      <form class="relative mx-auto hidden max-w-xl flex-1 md:block" @submit.prevent="handleSearch"><i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i><input v-model="searchQuery" type="search" :placeholder="t('navSearch')" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /><button type="submit" class="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg bg-emerald-600 text-sm text-white transition hover:bg-emerald-700" aria-label="Search"><i class="fa-solid fa-arrow-right"></i></button></form>
      <div class="ml-auto flex items-center gap-1.5 sm:gap-3">
        <button type="button" @click="toggleLanguage" class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700">
          {{ currentLocale === 'en' ? 'KH' : 'EN' }}
        </button>
        <RouterLink to="/wishlist" class="icon-link hidden sm:flex" aria-label="Wishlist"><i class="fa-regular fa-heart"></i><span v-if="wishlistStore.totalItems" class="count-badge">{{ wishlistStore.totalItems > 99 ? '99+' : wishlistStore.totalItems }}</span></RouterLink><RouterLink to="/cart" class="icon-link" aria-label="Shopping cart"><i class="fa-solid fa-bag-shopping"></i><span v-if="cartStore.totalItems" class="count-badge">{{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}</span></RouterLink>
        <div class="relative hidden md:block"><RouterLink v-if="!authStore.isAuthenticated" to="/login" class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"><i class="fa-regular fa-user"></i><span>{{ t('navLogin') }}</span></RouterLink><button v-else class="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="showAccountMenu = !showAccountMenu"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-user text-xs"></i></span><span class="max-w-28 truncate">{{ authStore.user?.name || t('navAccount') }}</span><i class="fa-solid fa-chevron-down text-[10px]"></i></button><div v-if="showAccountMenu && authStore.isAuthenticated" class="absolute right-0 top-12 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><RouterLink to="/profile" class="account-link" @click="showAccountMenu = false"><i class="fa-regular fa-user"></i>{{ t('navProfile') }}</RouterLink><RouterLink to="/orders" class="account-link" @click="showAccountMenu = false"><i class="fa-solid fa-box"></i>{{ t('navOrders') }}</RouterLink><button class="account-link w-full text-red-600 hover:bg-red-50" @click="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i>{{ t('navLogout') }}</button></div></div>
        <button class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 md:hidden" :aria-expanded="mobileMenuOpen" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen"><i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i></button></div>
    </div>
    <div v-if="mobileMenuOpen" class="border-t border-slate-100 bg-white px-4 py-4 md:hidden"><div class="mb-3 flex justify-end"><button type="button" @click="toggleLanguage" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">{{ currentLocale === 'en' ? 'KH' : 'EN' }}</button></div><form class="relative mb-4" @submit.prevent="handleSearch"><input v-model="searchQuery" type="search" :placeholder="t('navSearch')" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500" /><button type="submit" class="absolute right-2 top-2 h-8 w-8 rounded-lg bg-emerald-600 text-white"><i class="fa-solid fa-magnifying-glass"></i></button></form><nav class="grid grid-cols-2 gap-2 text-sm font-semibold"><RouterLink to="/" class="mobile-link" @click="mobileMenuOpen = false">{{ t('navHome') }}</RouterLink><RouterLink to="/products" class="mobile-link" @click="mobileMenuOpen = false">{{ t('navShop') }}</RouterLink><RouterLink to="/categories" class="mobile-link" @click="mobileMenuOpen = false">{{ t('navCategories') }}</RouterLink><RouterLink to="/wishlist" class="mobile-link" @click="mobileMenuOpen = false">{{ t('navWishlist') }}</RouterLink><RouterLink :to="authStore.isAuthenticated ? '/profile' : '/login'" class="mobile-link" @click="mobileMenuOpen = false">{{ authStore.isAuthenticated ? t('navProfile') : t('navLogin') }}</RouterLink></nav></div>
  </header>
</template>

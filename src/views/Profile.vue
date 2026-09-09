<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { useWishlistStore } from '../stores/wishlistStore'
import Orders from './Orders.vue'
import WishlistView from './WishlistView.vue'
import { t } from '../i18n'
import { useToastStore } from '../stores/toastStore'

defineOptions({ name: 'ProfilePage' })

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const wishlistStore = useWishlistStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)
const activeSection = ref('overview')
const editing = ref(false)
const savedMessage = ref('')
const profileForm = ref({ name: '', email: '', phone: '' })
const initials = computed(() => {
  const name = user.value?.name || t('customer')
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
})
const recentOrders = computed(() => orderStore.orders.slice(0, 2))
const rewardPoints = computed(() => orderStore.totalOrders * 50)

const formatDate = (date) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date(date))

const statusClass = (status) => ({
  delivered: 'bg-emerald-50 text-emerald-700',
  processing: 'bg-sky-50 text-sky-700',
  pending: 'bg-amber-50 text-amber-700',
}[status] || 'bg-slate-100 text-slate-600')

const openEditor = () => {
  profileForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    address: user.value?.address || '',
  }
  editing.value = true
}

const saveProfile = async () => {
  try {
    await authStore.updateProfile({ ...profileForm.value })
    editing.value = false
    savedMessage.value = t('profileUpdated')
    window.setTimeout(() => { savedMessage.value = '' }, 3000)
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || t('unableProfileUpdate'),
      'error',
    )
  }
}

const selectSection = (section) => {
  activeSection.value = section
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-7xl px-4 py-7 sm:py-10">
      <div class="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside class="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div class="border-b border-slate-100 px-3 py-4">
            <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">{{ t('navAccount') }}</p>
            <p class="mt-1 truncate font-semibold text-slate-900">{{ user?.name || t('customer') }}</p>
          </div>

          <nav class="space-y-1 p-2" aria-label="Account navigation">
            <button type="button" @click="selectSection('overview')" :class="activeSection === 'overview' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition">
              <i class="fa-regular fa-user"></i> {{ t('profileOverview') }}
            </button>
            <button type="button" @click="selectSection('orders')" :class="activeSection === 'orders' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition">
              <i class="fa-solid fa-receipt"></i> {{ t('myOrders') }}
            </button>
            <button type="button" @click="selectSection('wishlist')" :class="activeSection === 'wishlist' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition">
              <i class="fa-regular fa-heart"></i> {{ t('wishlist') }}
            </button>
            <button type="button" @click="selectSection('addresses')" :class="activeSection === 'addresses' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition">
              <i class="fa-solid fa-location-dot"></i> {{ t('addresses') }}
            </button>
            <button type="button" @click="selectSection('settings')" :class="activeSection === 'settings' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition">
              <i class="fa-solid fa-gear"></i> {{ t('settings') }}
            </button>
          </nav>

          <div class="border-t border-slate-100 p-2">
            <button type="button" @click="logout" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> {{ t('logout') }}
            </button>
          </div>
        </aside>

        <main id="overview" class="min-w-0">
          <p v-if="savedMessage" class="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{{ savedMessage }}</p>

          <section v-if="activeSection === 'overview'" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-700 text-xl font-bold text-white ring-2 ring-emerald-100">
                {{ initials }}
              </div>
              <div class="min-w-0">
                <h1 class="truncate text-xl font-bold text-slate-900">{{ user?.name || t('customer') }}</h1>
                <p class="truncate text-sm text-slate-500">{{ user?.email }}</p>
                <p class="mt-1 text-xs text-slate-400">Account #{{ user?.id }}</p>
              </div>
            </div>
            <button type="button" @click="openEditor" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:mt-0 sm:w-auto">
              <i class="fa-solid fa-pen"></i> {{ t('editProfile') }}
            </button>
          </section>

          <section v-if="activeSection === 'overview'" class="mt-5 grid gap-4 sm:grid-cols-3">
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('totalOrders') }}</p>
              <p class="mt-1 text-3xl font-bold text-emerald-700">{{ orderStore.totalOrders }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('wishlistItems') }}</p>
              <p class="mt-1 text-3xl font-bold text-emerald-700">{{ wishlistStore.totalItems }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('rewardPoints') }}</p>
              <p class="mt-1 text-3xl font-bold text-emerald-700">{{ rewardPoints }}</p>
            </div>
          </section>

          <section v-if="activeSection === 'overview'" class="mt-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900">{{ t('recentOrders') }}</h2>
              <RouterLink to="/orders" class="text-sm font-semibold text-emerald-700 hover:text-emerald-800">{{ t('sectionViewAll') }}</RouterLink>
            </div>

            <div v-if="recentOrders.length" class="mt-3 space-y-3">
              <article v-for="order in recentOrders" :key="order.id" class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-400"><i class="fa-solid fa-bag-shopping"></i></div>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-bold text-slate-900">{{ order.items?.[0]?.title || 'Order items' }}</h3>
                  <p class="text-xs text-slate-500">Order #{{ order.orderNumber }} · {{ formatDate(order.createdAt) }}</p>
                  <span :class="statusClass(order.status)" class="mt-1 inline-flex rounded px-2 py-0.5 text-[11px] font-semibold capitalize">{{ order.status }}</span>
                </div>
                <p class="shrink-0 text-sm font-bold text-emerald-700">${{ Number(order.total || 0).toFixed(2) }}</p>
              </article>
            </div>

            <div v-else class="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <i class="fa-solid fa-bag-shopping text-3xl text-slate-300"></i>
              <p class="mt-3 font-semibold text-slate-700">{{ t('noOrdersYet') }}</p>
              <RouterLink to="/products" class="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800">{{ t('startShopping') }}</RouterLink>
            </div>
          </section>

          <Orders v-if="activeSection === 'orders'" />

          <WishlistView v-if="activeSection === 'wishlist'" />

          <section v-if="activeSection === 'addresses'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h1 class="text-xl font-bold text-slate-900">{{ t('savedAddresses') }}</h1>
                <p class="mt-1 text-sm text-slate-500">{{ t('addressHelp') }}</p>
              </div>
              <button type="button" @click="openEditor" class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">{{ user?.address ? 'Edit address' : 'Add address' }}</button>
            </div>
            <div v-if="user?.address" class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div class="flex items-start gap-3"><i class="fa-solid fa-house mt-1 text-emerald-700"></i><div><p class="font-semibold text-slate-800">{{ t('defaultAddress') }}</p><p class="mt-1 text-sm text-slate-600">{{ user.address }}</p><p v-if="user.phone" class="mt-1 text-sm text-slate-500">{{ user.phone }}</p></div></div>
            </div>
            <div v-else class="mt-6 rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center">
              <i class="fa-solid fa-location-dot text-3xl text-slate-300"></i>
              <p class="mt-3 font-semibold text-slate-700">{{ t('noAddresses') }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ t('addAddressHelp') }}</p>
            </div>
          </section>

          <section v-if="activeSection === 'settings'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 class="text-xl font-bold text-slate-900">{{ t('accountSettings') }}</h1>
            <p class="mt-1 text-sm text-slate-500">{{ t('accountSecurity') }}</p>
            <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <div><p class="font-semibold text-slate-800">{{ t('profileDetails') }}</p><p class="text-sm text-slate-500">{{ t('profileDetailsHelp') }}</p></div>
              <button type="button" @click="openEditor" class="text-sm font-semibold text-emerald-700 hover:text-emerald-800">{{ t('edit') }}</button>
            </div>
          </section>
        </main>
      </div>
    </section>

    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" @click.self="editing = false">
      <form class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" @submit.prevent="saveProfile">
        <div class="flex items-center justify-between"><h2 class="text-xl font-bold text-slate-900">{{ t('editProfile') }}</h2><button type="button" @click="editing = false" class="text-slate-400 hover:text-slate-700"><i class="fa-solid fa-xmark text-xl"></i></button></div>
        <label class="mt-5 block text-sm font-semibold text-slate-700">{{ t('fullName') }}<input v-model.trim="profileForm.name" required class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
        <label class="mt-4 block text-sm font-semibold text-slate-700">{{ t('loginEmail') }}<input v-model.trim="profileForm.email" type="email" required class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
        <label class="mt-4 block text-sm font-semibold text-slate-700">{{ t('phone') }}<input v-model.trim="profileForm.phone" type="tel" :placeholder="t('phonePlaceholder')" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
        <label class="mt-4 block text-sm font-semibold text-slate-700">{{ t('deliveryAddress') }}<textarea v-model.trim="profileForm.address" rows="3" :placeholder="t('addressPlaceholder')" class="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"></textarea></label>
        <div class="mt-6 flex justify-end gap-3"><button type="button" @click="editing = false" class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">{{ t('cancel') }}</button><button class="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">{{ t('saveChanges') }}</button></div>
      </form>
    </div>
  </div>
</template>

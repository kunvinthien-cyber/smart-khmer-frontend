<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../i18n'
import { getProducts, getCategories } from '../services/productService'
import ProductGrid from '../components/product/ProductGrid.vue'

const router = useRouter()

const heroBadge = computed(() => t('heroBadge'))
const heroTitle1 = computed(() => t('heroTitle1'))
const heroTitle2 = computed(() => t('heroTitle2'))
const heroText = computed(() => t('heroText'))
const heroPrimary = computed(() => t('heroPrimary'))
const heroSecondary = computed(() => t('heroSecondary'))
const sectionTag = computed(() => t('sectionCategoryTag'))
const sectionTitle = computed(() => t('sectionCategoryTitle'))
const sectionViewAll = computed(() => t('sectionViewAll'))
const sectionExplore = computed(() => t('sectionExplore'))

const products = ref([])
const loading = ref(false)
const error = ref(null)

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await getProducts({ limit: 8 })
    products.value = data.products
  } catch (err) {
    error.value = 'Failed to load products.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref(null)

const fetchCategories = async () => {
  categoriesLoading.value = true
  categoriesError.value = null

  try {
    categories.value = await getCategories()
  } catch (err) {
    categoriesError.value = 'Failed to load categories.'
    console.error(err)
  } finally {
    categoriesLoading.value = false
  }
}

const openCategory = (category) => {
  const slug = category.slug || category

  router.push({
    path: '/products',
    query: { category: slug },
  })
}

const getCategoryIcon = (category) => {
  const icons = {
    smartphones: 'fa-solid fa-mobile-screen-button',
    laptops: 'fa-solid fa-laptop',
    tablets: 'fa-solid fa-tablet-screen-button',
    mens_shirts: 'fa-solid fa-shirt',
    mens_shoes: 'fa-solid fa-shoe-prints',
    mens_watches: 'fa-solid fa-clock',
    womens_dresses: 'fa-solid fa-person-dress',
    womens_shoes: 'fa-solid fa-shoe-prints',
    womens_watches: 'fa-solid fa-clock',
    beauty: 'fa-solid fa-wand-magic-sparkles',
    fragrances: 'fa-solid fa-spray-can-sparkles',
    furniture: 'fa-solid fa-couch',
    groceries: 'fa-solid fa-basket-shopping',
    'home-decoration': 'fa-solid fa-house',
    'kitchen-accessories': 'fa-solid fa-kitchen-set',
    'sports-accessories': 'fa-solid fa-dumbbell',
    sunglasses: 'fa-solid fa-glasses',
    automotive: 'fa-solid fa-car',
    motorcycle: 'fa-solid fa-motorcycle',
  }

  return icons[category] || 'fa-solid fa-layer-group'
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>

  <div class="bg-gray-50">

    <!-- ==================== HERO ==================== -->

    <section class="mx-auto max-w-7xl px-4 pt-6">

      <div
        class="relative overflow-hidden rounded-3xl bg-gray-900"
      >

        <div
          class="grid min-h-107.5 items-center px-6 py-14 sm:px-10 lg:grid-cols-2 lg:px-16"
        >

          <!-- Hero Content -->

          <div class="text-white">

            <span
              class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"
            >
              <i class="fa-solid fa-bolt mr-2"></i>
              {{ heroBadge }}
            </span>


            <h1
              class="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            >
              {{ heroTitle1 }}

              <span class="block">
                {{ heroTitle2 }}
              </span>
            </h1>


            <p
              class="mt-5 max-w-xl text-base leading-7 text-gray-300 sm:text-lg"
            >
              {{ heroText }}
            </p>


            <!-- Buttons -->

            <div class="mt-8 flex flex-wrap gap-3">

              <RouterLink
                to="/products"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-gray-900 transition hover:bg-gray-100"
              >
                {{ heroPrimary }}

                <i class="fa-solid fa-arrow-right"></i>
              </RouterLink>


              <RouterLink
                to="/categories"
                class="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                {{ heroSecondary }}

                <i class="fa-solid fa-layer-group"></i>
              </RouterLink>

            </div>

          </div>


          <!-- Hero Decoration -->

          <div
            class="pointer-events-none hidden items-center justify-center lg:flex"
          >

            <div
              class="flex h-72 w-72 items-center justify-center rounded-full bg-white/5"
            >

              <i
                class="fa-solid fa-bag-shopping text-[150px] text-white/10"
              ></i>

            </div>

          </div>

        </div>

      </div>

    </section>



    <!-- ==================== CATEGORIES ==================== -->

    <section
      class="mx-auto max-w-7xl px-4 py-14"
    >

      <div
        class="mb-7 flex items-end justify-between"
      >

        <div>

          <p
            class="text-sm font-semibold uppercase tracking-wide text-green-600"
          >
            {{ sectionTag }}
          </p>

          <h2
            class="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            {{ sectionTitle }}
          </h2>

        </div>


        <RouterLink
          to="/categories"
          class="hidden items-center gap-1 font-semibold text-green-600 hover:text-green-700 sm:inline-flex"
        >
          {{ sectionViewAll }}

          <i class="fa-solid fa-arrow-right text-sm"></i>
        </RouterLink>

      </div>


      <!-- Category Cards -->

      <div
        v-if="categoriesLoading"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >

        <div
          v-for="item in 6"
          :key="item"
          class="h-32 animate-pulse rounded-2xl bg-gray-200"
        ></div>

      </div>


      <div
        v-else-if="categoriesError"
        class="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
      >

        <i
          class="fa-solid fa-circle-exclamation mr-2"
        ></i>

        {{ categoriesError }}

      </div>


      <div
        v-else
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >

        <button
          v-for="category in categories.slice(0, 6)"
          :key="category.slug || category"
          @click="openCategory(category)"
          class="group rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
        >

          <!-- Icon -->

          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-xl text-green-600 transition group-hover:bg-green-600 group-hover:text-white"
          >

            <i
              :class="getCategoryIcon(category.slug || category)"
            ></i>

          </div>


          <!-- Name -->

          <h3
            class="mt-4 truncate text-sm font-bold capitalize text-gray-900 group-hover:text-green-600"
          >
            {{ category.name || category }}
          </h3>


          <p
            class="mt-1 text-xs text-gray-400"
          >
            {{ sectionExplore }}
          </p>

        </button>

      </div>


      <!-- Mobile View All -->

      <div class="mt-5 text-center sm:hidden">

        <RouterLink
          to="/categories"
          class="inline-flex items-center gap-2 font-semibold text-green-600"
        >
          View All Categories

          <i class="fa-solid fa-arrow-right text-sm"></i>
        </RouterLink>

      </div>

    </section>



    <!-- ==================== POPULAR PRODUCTS ==================== -->

    <section
      class="mx-auto max-w-7xl px-4 pb-16"
    >

      <div
        class="flex items-end justify-between"
      >

        <div>

          <p
            class="text-sm font-semibold uppercase tracking-wide text-green-600"
          >
            Trending Now
          </p>

          <h2
            class="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            Popular Products
          </h2>

          <p
            class="mt-2 text-sm text-gray-500 sm:text-base"
          >
            Discover products our customers love.
          </p>

        </div>


        <RouterLink
          to="/products"
          class="hidden items-center gap-1 font-semibold text-green-600 hover:text-green-700 sm:inline-flex"
        >
          View All

          <i class="fa-solid fa-arrow-right text-sm"></i>
        </RouterLink>

      </div>



      <!-- Loading -->

      <div
        v-if="loading"
        class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >

        <div
          v-for="item in 8"
          :key="item"
          class="h-96 animate-pulse rounded-2xl bg-gray-200"
        ></div>

      </div>



      <!-- Error -->

      <div
        v-else-if="error"
        class="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
      >

        <i
          class="fa-solid fa-circle-exclamation mr-2"
        ></i>

        {{ error }}

      </div>



      <!-- Products -->

      <ProductGrid
        v-else
        :products="products"
        class="mt-8"
      />


      <!-- Mobile View All -->

      <div class="mt-8 text-center sm:hidden">

        <RouterLink
          to="/products"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          View All Products

          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>

      </div>

    </section>



    <!-- ==================== WHY SHOP WITH US ==================== -->

    <section
      class="mx-auto max-w-7xl px-4 pb-16"
    >

      <div
        class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10"
      >

        <div class="text-center">

          <p
            class="text-sm font-semibold uppercase tracking-wide text-green-600"
          >
            Why Choose Us
          </p>

          <h2
            class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            Shopping Made Simple
          </h2>

        </div>


        <div
          class="mt-10 grid gap-8 sm:grid-cols-3"
        >

          <!-- Delivery -->

          <div class="text-center">

            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-xl text-green-600"
            >
              <i class="fa-solid fa-truck-fast"></i>
            </div>

            <h3
              class="mt-4 font-bold text-gray-900"
            >
              Fast Delivery
            </h3>

            <p
              class="mt-2 text-sm leading-6 text-gray-500"
            >
              Get your products delivered quickly and conveniently.
            </p>

          </div>


          <!-- Secure -->

          <div class="text-center">

            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-xl text-green-600"
            >
              <i class="fa-solid fa-shield-halved"></i>
            </div>

            <h3
              class="mt-4 font-bold text-gray-900"
            >
              Secure Shopping
            </h3>

            <p
              class="mt-2 text-sm leading-6 text-gray-500"
            >
              Enjoy a safe and reliable shopping experience.
            </p>

          </div>


          <!-- Support -->

          <div class="text-center">

            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-xl text-green-600"
            >
              <i class="fa-solid fa-headset"></i>
            </div>

            <h3
              class="mt-4 font-bold text-gray-900"
            >
              Customer Support
            </h3>

            <p
              class="mt-2 text-sm leading-6 text-gray-500"
            >
              We're here to help whenever you need us.
            </p>

          </div>

        </div>

      </div>

    </section>

  </div>

</template>

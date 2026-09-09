<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/product/ProductCard.vue'
import { getProducts } from '../services/productService'
import { t } from '../i18n'

const route = useRoute()

const products = ref([])
const loading = ref(true)
const error = ref(null)

const search = ref('')
const selectedCategory = ref('all')
const sortBy = ref('default')
const currentPage = ref(1)

const productsPerPage = 12


// ========================================
// Fetch Products
// ========================================

const fetchProducts = async () => {

  try {

    loading.value = true

    const data = await getProducts()

    products.value = data.products || data

  } catch (err) {

    error.value = t('unableProducts')

    console.error(err)

  } finally {

    loading.value = false

  }

}


// ========================================
// Categories
// ========================================

const categories = computed(() => {

  const values = products.value
    .map(product => product.category)
    .filter(Boolean)

  return [...new Set(values)]

})


// ========================================
// Filter + Search
// ========================================

const filteredProducts = computed(() => {

  let result = [...products.value]


  // Search

  if (search.value.trim()) {

    const keyword = search.value
      .toLowerCase()
      .trim()

    result = result.filter(product => {

      return (
        product.title?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        (typeof product.category === 'string' ? product.category : product.category?.name)?.toLowerCase().includes(keyword)
      )

    })

  }


  // Category

  if (selectedCategory.value !== 'all') {

    result = result.filter(
      product =>
        product.category === selectedCategory.value
    )

  }


  // Sort

  if (sortBy.value === 'price-low') {

    result.sort(
      (a, b) => a.price - b.price
    )

  }

  if (sortBy.value === 'price-high') {

    result.sort(
      (a, b) => b.price - a.price
    )

  }

  if (sortBy.value === 'rating') {

    result.sort(
      (a, b) => b.rating - a.rating
    )

  }

  if (sortBy.value === 'name') {

    result.sort(
      (a, b) =>
        a.title.localeCompare(b.title)
    )

  }


  return result

})


// ========================================
// Pagination
// ========================================

const totalPages = computed(() => {

  return Math.ceil(
    filteredProducts.value.length /
    productsPerPage
  )

})


const paginatedProducts = computed(() => {

  const start =
    (currentPage.value - 1) *
    productsPerPage

  const end =
    start + productsPerPage

  return filteredProducts.value.slice(
    start,
    end
  )

})


const goToPage = (page) => {

  if (
    page >= 1 &&
    page <= totalPages.value
  ) {

    currentPage.value = page

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

  }

}


// Reset page when filter changes

const resetPage = () => {
  currentPage.value = 1
}


// ========================================
// Category from route query
// ========================================

watch(
  () => route.query.category,
  (newCategory) => {
    if (typeof newCategory === 'string' && newCategory.trim()) {
      selectedCategory.value = newCategory
      return
    }

    selectedCategory.value = 'all'
  },
  { immediate: true }
)

watch(
  () => route.query.search,
  (newSearch) => {
    search.value = typeof newSearch === 'string' ? newSearch : ''
    resetPage()
  },
  { immediate: true }
)

// ========================================
// Initial Load
// ========================================

onMounted(fetchProducts)

</script>


<template>

  <div class="min-h-screen bg-gray-50">

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
            {{ t('products') }}
          </span>

        </div>


        <div class="mt-4">

          <h1 class="text-3xl font-bold text-gray-900">
            {{ t('allProducts') }}
          </h1>

          <p class="mt-2 text-gray-500">
            {{ t('discoverProducts') }}
          </p>

        </div>

      </div>

    </section>


    <!-- Content -->

    <main class="mx-auto max-w-7xl px-4 py-8">


      <!-- Search + Filter -->

      <div
        class="rounded-2xl border bg-white p-4 shadow-sm"
      >

        <div
          class="grid gap-4 lg:grid-cols-4"
        >

          <!-- Search -->

          <div class="relative lg:col-span-2">

            <i
              class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>

            <input
              v-model="search"
              @input="resetPage"
              type="search"
              :placeholder="t('searchProducts')"
              class="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Category -->

          <select
            v-model="selectedCategory"
            @change="resetPage"
            class="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >

            <option value="all">
              {{ t('allCategories') }}
            </option>

            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>

          </select>


          <!-- Sort -->

          <select
            v-model="sortBy"
            @change="resetPage"
            class="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >

            <option value="default">
              {{ t('sortDefault') }}
            </option>

            <option value="price-low">
              {{ t('priceLow') }}
            </option>

            <option value="price-high">
              {{ t('priceHigh') }}
            </option>

            <option value="rating">
              {{ t('rating') }}
            </option>

            <option value="name">
              {{ t('nameAZ') }}
            </option>

          </select>

        </div>


        <!-- Result Count -->

        <div class="mt-4 flex items-center justify-between border-t pt-4">

          <p class="text-sm text-gray-500">

            {{ t('showing') }}

            <span class="font-semibold text-gray-900">
              {{ paginatedProducts.length }}
            </span>

            of

            <span class="font-semibold text-gray-900">
              {{ filteredProducts.length }}
            </span>

            {{ t('products') }}

          </p>


          <button
            v-if="search || selectedCategory !== 'all' || sortBy !== 'default'"
            @click="
              search = '';
              selectedCategory = 'all';
              sortBy = 'default';
              resetPage()
            "
            class="text-sm font-semibold text-green-600 hover:text-green-700"
          >
            <i class="fa-solid fa-rotate-left mr-1"></i>
            {{ t('reset') }}
          </button>

        </div>

      </div>


      <!-- Loading -->

      <div
        v-if="loading"
        class="grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 lg:grid-cols-4"
      >

        <div
          v-for="n in 8"
          :key="n"
          class="h-80 animate-pulse rounded-2xl bg-gray-200"
        ></div>

      </div>


      <!-- Error -->

      <div
        v-else-if="error"
        class="py-20 text-center"
      >

        <i class="fa-solid fa-triangle-exclamation text-5xl text-red-300"></i>

        <h2 class="mt-5 text-xl font-bold text-gray-900">
          {{ t('somethingWrong') }}
        </h2>

        <p class="mt-2 text-gray-500">
          {{ error }}
        </p>

        <button
          @click="fetchProducts"
          class="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          {{ t('tryAgain') }}
        </button>

      </div>


      <!-- Products -->

      <div
        v-else-if="paginatedProducts.length"
        class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >

        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />

      </div>


      <!-- No Results -->

      <div
        v-else
        class="py-20 text-center"
      >

        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl text-gray-400"
        >
          <i class="fa-solid fa-box-open"></i>
        </div>

        <h2 class="mt-5 text-xl font-bold text-gray-900">
          {{ t('noProducts') }}
        </h2>

        <p class="mt-2 text-gray-500">
          {{ t('tryAnother') }}
        </p>

        <button
          @click="
            search = '';
            selectedCategory = 'all';
            sortBy = 'default';
            resetPage()
          "
          class="mt-5 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          {{ t('clearFilters') }}
        </button>

      </div>


      <!-- Pagination -->

      <div
        v-if="totalPages > 1"
        class="mt-10 flex items-center justify-center gap-2"
      >

        <!-- Previous -->

        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>


        <!-- Pages -->

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold"
          :class="
            currentPage === page
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          "
        >
          {{ page }}
        </button>


        <!-- Next -->

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>

    </main>

  </div>

</template>

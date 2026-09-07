<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '../services/productService'

const router = useRouter()

const categories = ref([])
const loading = ref(true)
const error = ref(null)

const normalizeCategories = (data) => {
  const list = Array.isArray(data)
    ? data
    : data?.categories || data?.data || []

  return list.map((item) => {
    if (typeof item === 'string') {
      return {
        name: item,
        slug: item,
      }
    }

    return item
  })
}

const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await getCategories()
    categories.value = normalizeCategories(data)
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

const openCategory = (category) => {
  const item = typeof category === 'string'
    ? { name: category, slug: category }
    : category

  router.push({
    path: '/products',
    query: {
      category: item?.slug || item?.name || item,
    },
  })
}

onMounted(fetchCategories)
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
            Home
          </RouterLink>

          <i class="fa-solid fa-chevron-right text-xs"></i>

          <span class="text-gray-900">
            Categories
          </span>

        </div>

        <h1 class="mt-4 text-3xl font-bold text-gray-900">
          Shop by Category
        </h1>

        <p class="mt-2 text-gray-500">
          Find products by category.
        </p>

      </div>

    </section>


    <!-- Content -->

    <main class="mx-auto max-w-7xl px-4 py-10">

      <!-- Loading -->

      <div
        v-if="loading"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >

        <div
          v-for="n in 8"
          :key="n"
          class="h-40 animate-pulse rounded-2xl bg-gray-200"
        ></div>

      </div>


      <!-- Error -->

      <div
        v-else-if="error"
        class="py-20 text-center"
      >

        <i
          class="fa-solid fa-triangle-exclamation text-5xl text-red-300"
        ></i>

        <h2 class="mt-5 text-xl font-bold text-gray-900">
          Unable to load categories
        </h2>

        <button
          @click="fetchCategories"
          class="mt-5 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          <i class="fa-solid fa-rotate-right mr-2"></i>
          Try Again
        </button>

      </div>


      <!-- Categories -->

      <div
        v-else
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >

        <button
          v-for="category in categories"
          :key="category.slug || category.name || category"
          @click="openCategory(category)"
          class="group rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
        >

          <div
            class="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl text-green-600 transition group-hover:bg-green-600 group-hover:text-white"
          >

            <i
              class="fa-solid fa-layer-group"
            ></i>

          </div>


          <h2
            class="mt-5 font-bold capitalize text-gray-900 group-hover:text-green-600"
          >
            {{ category.name || category.slug || category }}
          </h2>


          <div
            class="mt-3 flex items-center justify-between text-sm text-gray-400"
          >

            <span>
              Explore
            </span>

            <i
              class="fa-solid fa-arrow-right transition group-hover:translate-x-1 group-hover:text-green-600"
            ></i>

          </div>

        </button>

      </div>

    </main>

  </div>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getProductById, getProducts } from '../services/productService'

import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'

import ProductCard from '../components/product/ProductCard.vue'
import { t } from '../i18n'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import api from '../services/api'


const route = useRoute()
const router = useRouter()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const toastStore = useToastStore()


const product = ref(null)
const relatedProducts = ref([])

const loading = ref(true)
const error = ref(null)

const quantity = ref(1)
const selectedImage = ref('')
const reviewRating = ref(5)
const reviewComment = ref('')
const reviewSaving = ref(false)


// ========================================
// Fetch Product
// ========================================

const fetchProduct = async () => {

  try {

    loading.value = true
    error.value = null

    const productId = route.params.id

    product.value = await getProductById(productId)

    selectedImage.value =
      product.value?.images?.[0] ||
      product.value?.thumbnail ||
      ''


    // Related products

    const data = await getProducts()

    const allProducts =
      data.products || data

    relatedProducts.value =
      allProducts
        .filter(item =>
          item.category === product.value.category &&
          item.id !== product.value.id
        )
        .slice(0, 4)

  } catch (err) {

    console.error(err)

    error.value =
      t('productNotFound')

  } finally {

    loading.value = false

  }

}


// ========================================
// Quantity
// ========================================

const increaseQuantity = () => {

  if (
    product.value &&
    quantity.value < product.value.stock
  ) {
    quantity.value++
  }

}


const decreaseQuantity = () => {

  if (quantity.value > 1) {
    quantity.value--
  }

}


// ========================================
// Cart
// ========================================

const addToCart = () => {

  if (!product.value) return

  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(product.value)
  }

}


const buyNow = () => {

  addToCart()

  router.push('/checkout')

}


// ========================================
// Wishlist
// ========================================

const toggleWishlist = () => {

  if (!product.value) return

  wishlistStore.toggleWishlist(product.value)

}

const submitReview = async () => {
  if (!product.value || !authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  reviewSaving.value = true

  try {
    const response = await api.post(`/products/${product.value.id}/reviews`, {
      rating: reviewRating.value,
      comment: reviewComment.value.trim() || null,
    })
    const savedReview = response.data.data
    const existingReviewIndex = (product.value.reviews || []).findIndex(
      (review) => review.user?.id === authStore.user?.id,
    )

    if (existingReviewIndex >= 0) {
      product.value.reviews[existingReviewIndex] = savedReview
    } else {
      product.value.reviews = [savedReview, ...(product.value.reviews || [])]
    }
    product.value.rating = product.value.reviews.reduce((sum, review) => sum + review.rating, 0) / product.value.reviews.length
    reviewComment.value = ''
    toastStore.showToast(t('reviewSaved'))
  } catch (error) {
    toastStore.showToast(error.response?.data?.message || t('reviewError'), 'error')
  } finally {
    reviewSaving.value = false
  }
}


const isInWishlist = computed(() => {

  if (!product.value) return false

  return wishlistStore.isInWishlist(product.value.id)

})


onMounted(fetchProduct)

watch(
  () => route.params.id,
  () => {
    quantity.value = 1
    fetchProduct()
  }
)

</script>


<template>

  <div class="min-h-screen bg-gray-50">

    <!-- Loading -->

    <div
      v-if="loading"
      class="mx-auto max-w-7xl px-4 py-12"
    >

      <div class="grid gap-10 lg:grid-cols-2">

        <div class="h-125 animate-pulse rounded-2xl bg-gray-200"></div>

        <div class="space-y-5">

          <div class="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>

          <div class="h-6 w-1/3 animate-pulse rounded bg-gray-200"></div>

          <div class="h-20 animate-pulse rounded bg-gray-200"></div>

          <div class="h-12 animate-pulse rounded bg-gray-200"></div>

          <div class="h-12 animate-pulse rounded bg-gray-200"></div>

        </div>

      </div>

    </div>


    <!-- Error -->

    <div
      v-else-if="error"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <i
        class="fa-solid fa-circle-exclamation text-5xl text-red-300"
      ></i>

      <h1 class="mt-5 text-2xl font-bold text-gray-900">
        {{ t('productNotFound') }}
      </h1>

      <p class="mt-2 text-gray-500">
        {{ error }}
      </p>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-arrow-left"></i>
        {{ t('backProducts') }}
      </RouterLink>

    </div>


    <!-- Product -->

    <main
      v-else-if="product"
      class="mx-auto max-w-7xl px-4 py-8"
    >

      <!-- Breadcrumb -->

      <div class="mb-8 flex items-center gap-2 text-sm text-gray-500">

        <RouterLink
          to="/"
          class="hover:text-green-600"
        >
          {{ t('home') }}
        </RouterLink>

        <i class="fa-solid fa-chevron-right text-xs"></i>

        <RouterLink
          to="/products"
          class="hover:text-green-600"
        >
          {{ t('products') }}
        </RouterLink>

        <i class="fa-solid fa-chevron-right text-xs"></i>

        <span class="truncate text-gray-900">
          {{ product.title }}
        </span>

      </div>


      <!-- Main Product -->

      <div class="grid gap-10 rounded-2xl border bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2">


        <!-- Gallery -->

        <div>

          <div
            class="relative flex h-96 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 md:h-screen"
          >

            <img
              :src="selectedImage"
              :alt="product.title"
              class="h-full w-full object-contain p-8"
            />


            <!-- Discount -->

            <span
              v-if="product.discountPercentage"
              class="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
            >
              -{{ Math.round(product.discountPercentage) }}%
            </span>

          </div>


          <!-- Thumbnails -->

          <div
            v-if="product.images?.length"
            class="mt-4 flex gap-3 overflow-x-auto"
          >

            <button
              v-for="image in product.images.slice(0, 6)"
              :key="image"
              @click="selectedImage = image"
              class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1"
              :class="
                selectedImage === image
                  ? 'border-green-500'
                  : 'border-gray-200'
              "
            >

              <img
                :src="image"
                :alt="product.title"
                class="h-full w-full object-contain"
              />

            </button>

          </div>

        </div>


        <!-- Product Information -->

        <div class="flex flex-col">

          <!-- Brand -->

          <p
            v-if="product.brand"
            class="text-sm font-semibold uppercase tracking-wide text-green-600"
          >
            {{ product.brand }}
          </p>


          <!-- Title -->

          <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {{ product.title }}
          </h1>


          <!-- Rating -->

          <div class="mt-4 flex flex-wrap items-center gap-3">

            <div class="flex items-center gap-1 text-yellow-500">

              <i class="fa-solid fa-star"></i>

              <span class="font-bold">
                {{ product.rating }}
              </span>

            </div>

            <span class="text-gray-300">|</span>

            <span class="text-sm text-gray-500">
              {{ product.reviews?.length || 0 }} {{ t('reviews') }}
            </span>

          </div>


          <!-- Price -->

          <div class="mt-6 flex items-end gap-3">

            <span class="text-3xl font-bold text-green-600">
              ${{ product.price }}
            </span>

            <span
              v-if="product.discountPercentage"
              class="text-sm text-gray-400 line-through"
            >
              $
              {{
                (
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)
              }}
            </span>

          </div>


          <!-- Description -->

          <p class="mt-6 leading-7 text-gray-600">
            {{ product.description }}
          </p>


          <!-- Divider -->

          <div class="my-6 border-t"></div>


          <!-- Stock -->

          <div class="flex items-center gap-2">

            <i
              class="fa-solid fa-circle-check text-green-500"
            ></i>

            <span class="font-medium text-gray-700">
              {{ product.stock }} {{ t('itemsAvailable') }}
            </span>

          </div>


          <!-- Quantity -->

          <div class="mt-6">

            <p class="mb-2 text-sm font-semibold text-gray-700">
              {{ t('quantity') }}
            </p>

            <div
              class="flex w-fit items-center rounded-lg border"
            >

              <button
                @click="decreaseQuantity"
                class="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <i class="fa-solid fa-minus"></i>
              </button>

              <span
                class="flex h-11 w-12 items-center justify-center border-x font-semibold"
              >
                {{ quantity }}
              </span>

              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <i class="fa-solid fa-plus"></i>
              </button>

            </div>

          </div>


          <!-- Actions -->

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              @click="addToCart"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-5 py-3.5 font-bold text-green-600 hover:bg-green-50"
            >

              <i class="fa-solid fa-cart-plus"></i>

              {{ t('addToCartTitle') }}

            </button>


            <button
              @click="buyNow"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white hover:bg-green-700"
            >

              <i class="fa-solid fa-bolt"></i>

              {{ t('buyNow') }}

            </button>

          </div>


          <!-- Wishlist -->

          <button
            @click="toggleWishlist"
            class="mt-3 flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold"
            :class="
              isInWishlist
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
          >

            <i
              :class="
                isInWishlist
                  ? 'fa-solid fa-heart'
                  : 'fa-regular fa-heart'
              "
            ></i>

            {{
              isInWishlist
                ? t('removeWishlist')
                : t('addWishlist')
            }}

          </button>


          <!-- Benefits -->

          <div class="mt-8 grid grid-cols-2 gap-4 border-t pt-6">

            <div class="flex gap-3">

              <i class="fa-solid fa-truck-fast mt-1 text-green-600"></i>

              <div>

                <p class="text-sm font-semibold">
                  {{ t('fastDelivery') }}
                </p>

                <p class="text-xs text-gray-500">
                  {{ t('acrossCambodia') }}
                </p>

              </div>

            </div>


            <div class="flex gap-3">

              <i class="fa-solid fa-shield-halved mt-1 text-green-600"></i>

              <div>

                <p class="text-sm font-semibold">
                  {{ t('secureShopping') }}
                </p>

                <p class="text-xs text-gray-500">
                  {{ t('safeReliable') }}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- Description -->

      <section class="mt-10 rounded-2xl border bg-white p-6 shadow-sm md:p-8">

        <h2 class="text-xl font-bold text-gray-900">
          {{ t('productDescription') }}
        </h2>

        <p class="mt-4 leading-8 text-gray-600">
          {{ product.description }}
        </p>

      </section>

      <section class="mt-10 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
        <h2 class="text-xl font-bold text-gray-900">{{ t('customerReviews') }}</h2>

        <div v-if="authStore.isAuthenticated" class="mt-5 rounded-xl bg-gray-50 p-5">
          <h3 class="font-semibold text-gray-900">{{ t('writeReview') }}</h3>
          <p class="mt-3 text-sm font-medium text-gray-700">{{ t('yourRating') }}</p>
          <div class="mt-2 flex gap-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="text-2xl transition hover:scale-110"
              :class="star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'"
              :aria-label="`${star} stars`"
              @click="reviewRating = star"
            >
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
          <label class="mt-4 block text-sm font-medium text-gray-700">
            {{ t('reviewComment') }}
            <textarea v-model="reviewComment" rows="3" :placeholder="t('reviewPlaceholder')" class="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"></textarea>
          </label>
          <button type="button" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60" :disabled="reviewSaving" @click="submitReview">
            <i v-if="reviewSaving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-paper-plane"></i>
            {{ reviewSaving ? t('reviewSaving') : t('submitReview') }}
          </button>
        </div>
        <RouterLink v-else to="/login" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
          <i class="fa-regular fa-user"></i>
          {{ t('loginToReview') }}
        </RouterLink>

        <div v-if="product.reviews?.length" class="mt-6 space-y-4">
          <article v-for="review in product.reviews" :key="review.id" class="border-t border-gray-100 pt-4">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-gray-900">{{ review.user?.name || t('customer') }}</p>
              <div class="flex gap-0.5 text-sm text-yellow-400"><i v-for="star in 5" :key="star" class="fa-solid fa-star" :class="star > review.rating ? 'text-gray-300' : ''"></i></div>
            </div>
            <p v-if="review.comment" class="mt-2 text-sm leading-6 text-gray-600">{{ review.comment }}</p>
          </article>
        </div>
        <p v-else class="mt-6 text-sm text-gray-500">{{ t('noReviews') }}</p>
      </section>


      <!-- Related -->

      <section
        v-if="relatedProducts.length"
        class="mt-12"
      >

        <div class="mb-6 flex items-end justify-between">

          <div>

            <p class="text-sm font-semibold text-green-600">
              {{ t('youMayLike') }}
            </p>

            <h2 class="mt-1 text-2xl font-bold text-gray-900">
              {{ t('relatedProducts') }}
            </h2>

          </div>

          <RouterLink
            to="/products"
            class="hidden text-sm font-semibold text-green-600 sm:block"
          >
            {{ t('sectionViewAll') }}
            <i class="fa-solid fa-arrow-right ml-1"></i>
          </RouterLink>

        </div>


        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          <ProductCard
            v-for="item in relatedProducts"
            :key="item.id"
            :product="item"
          />

        </div>

      </section>

    </main>

  </div>

</template>

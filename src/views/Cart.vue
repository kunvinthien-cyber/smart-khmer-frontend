<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { t } from '../i18n'

defineOptions({
  name: 'CartPage',
})
const cartStore = useCartStore()

const items = computed(() => cartStore.items)

const subtotal = computed(() => {
  return items.value.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity)
  }, 0)
})

const deliveryFee = computed(() => {
  if (subtotal.value === 0) return 0
  return subtotal.value >= 50 ? 0 : 2.5
})

const total = computed(() => {
  return subtotal.value + deliveryFee.value
})

const updateQuantity = (item, quantity) => {
  if (quantity < 1) return

  cartStore.updateQuantity(item.id, quantity)
}

const removeItem = (id) => {
  cartStore.removeFromCart(id)
}
</script>


<template>

  <div class="min-h-screen bg-gray-50">

    <!-- Header -->

    <section class="border-b bg-white">

      <div class="mx-auto max-w-7xl px-4 py-8">

        <div class="flex items-center gap-2 text-sm text-gray-500">

          <RouterLink
            to="/"
            class="hover:text-green-600"
          >
            {{ t('home') }}
          </RouterLink>

          <i class="fa-solid fa-chevron-right text-xs"></i>

          <span class="text-gray-900">
            {{ t('shoppingCart') }}
          </span>

        </div>

        <h1 class="mt-4 text-3xl font-bold text-gray-900">
          {{ t('shoppingCart') }}
        </h1>

      </div>

    </section>


    <!-- Empty Cart -->

    <div
      v-if="items.length === 0"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"
      >
        <i class="fa-solid fa-cart-shopping"></i>
      </div>

      <h2 class="mt-6 text-2xl font-bold text-gray-900">
        {{ t('emptyCart') }}
      </h2>

      <p class="mt-2 text-gray-500">
        {{ t('emptyCartText') }}
      </p>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-bag-shopping"></i>
        {{ t('continueShopping') }}
      </RouterLink>

    </div>


    <!-- Cart -->

    <main
      v-else
      class="mx-auto max-w-7xl px-4 py-8"
    >

      <div class="grid gap-6 lg:grid-cols-3">


        <!-- Cart Items -->

        <section class="lg:col-span-2">

          <div class="rounded-2xl border bg-white shadow-sm">

            <!-- Cart Header -->

            <div
              class="flex items-center justify-between border-b px-5 py-4"
            >

              <h2 class="font-bold text-gray-900">
                {{ t('cartItems') }}
              </h2>

              <span class="text-sm text-gray-500">
                {{ items.length }} items
              </span>

            </div>


            <!-- Items -->

            <div class="divide-y">

              <div
                v-for="item in items"
                :key="item.id"
                class="p-5"
              >

                <div class="flex gap-4">


                  <!-- Image -->

                  <RouterLink
                    :to="`/products/${item.id}`"
                    class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32"
                  >

                    <img
                      :src="item.thumbnail || item.image"
                      :alt="item.title"
                      class="h-full w-full object-contain p-2"
                    />

                  </RouterLink>


                  <!-- Info -->

                  <div class="min-w-0 flex-1">

                    <div class="flex items-start justify-between gap-3">

                      <div>

                        <RouterLink
                          :to="`/products/${item.id}`"
                          class="font-semibold text-gray-900 hover:text-green-600"
                        >
                          {{ item.title }}
                        </RouterLink>

                        <p class="mt-1 text-sm text-gray-500">
                          {{ item.category }}
                        </p>

                      </div>


                      <!-- Remove -->

                      <button
                        @click="removeItem(item.id)"
                        class="text-gray-400 hover:text-red-500"
                        :title="t('removeItem')"
                      >

                        <i class="fa-solid fa-trash"></i>

                      </button>

                    </div>


                    <!-- Price -->

                    <p class="mt-3 font-bold text-green-600">
                      ${{ Number(item.price).toFixed(2) }}
                    </p>


                    <!-- Quantity -->

                    <div class="mt-4 flex items-center justify-between">

                      <div
                        class="flex items-center rounded-lg border"
                      >

                        <button
                          @click="
                            updateQuantity(
                              item,
                              item.quantity - 1
                            )
                          "
                          :disabled="item.quantity <= 1"
                          class="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          <i class="fa-solid fa-minus"></i>
                        </button>


                        <span
                          class="flex h-9 w-10 items-center justify-center border-x text-sm font-semibold"
                        >
                          {{ item.quantity }}
                        </span>


                        <button
                          @click="
                            updateQuantity(
                              item,
                              item.quantity + 1
                            )
                          "
                          class="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50"
                        >
                          <i class="fa-solid fa-plus"></i>
                        </button>

                      </div>


                      <!-- Item Total -->

                      <p class="font-bold text-gray-900">

                        $
                        {{
                          (
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(2)
                        }}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        <!-- Summary -->

        <aside>

          <div
            class="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm"
          >

            <h2 class="text-xl font-bold text-gray-900">
              {{ t('orderSummary') }}
            </h2>


            <div class="mt-6 space-y-4">

              <div class="flex justify-between text-gray-600">

                <span>
                  {{ t('subtotal') }}
                </span>

                <span class="font-medium text-gray-900">
                  ${{ subtotal.toFixed(2) }}
                </span>

              </div>


              <div class="flex justify-between text-gray-600">

                <span>
                  {{ t('delivery') }}
                </span>

                <span class="font-medium text-gray-900">

                  {{
                    deliveryFee === 0
                      ? t('free').toUpperCase()
                      : `$${deliveryFee.toFixed(2)}`
                  }}

                </span>

              </div>


              <div
                v-if="subtotal > 0 && subtotal < 50"
                class="rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >

                <i class="fa-solid fa-truck-fast mr-1"></i>

                Add
                <strong>
                  ${{ (50 - subtotal).toFixed(2) }}
                </strong>
                {{ t('freeDeliveryMessage') }}

              </div>


              <div class="border-t pt-4">

                <div class="flex justify-between">

                  <span class="text-lg font-bold text-gray-900">
                    {{ t('total') }}
                  </span>

                  <span class="text-xl font-bold text-green-600">
                    ${{ total.toFixed(2) }}
                  </span>

                </div>

              </div>

            </div>


            <!-- Checkout -->

            <RouterLink
              to="/checkout"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white hover:bg-green-700"
            >

              <i class="fa-solid fa-lock"></i>

              {{ t('checkout') }}

            </RouterLink>


            <!-- Continue -->

            <RouterLink
              to="/products"
              class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >

              <i class="fa-solid fa-arrow-left"></i>

              Continue Shopping

            </RouterLink>


            <!-- Secure -->

            <div
              class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400"
            >

              <i class="fa-solid fa-shield-halved"></i>

              Secure checkout

            </div>

          </div>

        </aside>

      </div>

    </main>

  </div>

</template>


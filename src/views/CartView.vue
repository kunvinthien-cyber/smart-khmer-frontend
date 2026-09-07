<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()

const shipping = computed(() => {
  return cartStore.totalPrice >= 50 ? 0 : 3
})

const grandTotal = computed(() => {
  return cartStore.totalPrice + shipping.value
})
</script>


<template>

  <div class="bg-gray-50">

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
            Cart
          </span>

        </div>

        <h1 class="mt-4 text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

      </div>

    </section>


    <!-- Empty Cart -->

    <section
      v-if="cartStore.items.length === 0"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-4xl text-green-600"
      >
        <i class="fa-solid fa-cart-shopping"></i>
      </div>

      <h2 class="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <p class="mt-2 text-gray-500">
        Start shopping and add some products to your cart.
      </p>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-bag-shopping"></i>
        Continue Shopping
      </RouterLink>

    </section>


    <!-- Cart -->

    <section
      v-else
      class="mx-auto max-w-7xl px-4 py-10"
    >

      <div class="grid gap-8 lg:grid-cols-[1fr_360px]">


        <!-- Cart Items -->

        <div class="space-y-4">

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
          >

            <div class="flex gap-4">


              <!-- Image -->

              <RouterLink
                :to="`/products/${item.id}`"
                class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
              >

                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="h-full w-full object-contain"
                />

              </RouterLink>


              <!-- Information -->

              <div class="min-w-0 flex-1">

                <div class="flex justify-between gap-4">

                  <RouterLink
                    :to="`/products/${item.id}`"
                    class="line-clamp-2 font-semibold text-gray-900 hover:text-green-600"
                  >
                    {{ item.title }}
                  </RouterLink>


                  <!-- Remove -->

                  <button
                    type="button"
                    class="shrink-0 text-gray-400 hover:text-red-500"
                    aria-label="Remove item"
                    @click="cartStore.removeFromCart(item.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>

                </div>


                <!-- Price -->

                <p class="mt-2 text-lg font-bold text-green-600">
                  ${{ item.price.toFixed(2) }}
                </p>


                <!-- Quantity -->

                <div class="mt-4 flex items-center justify-between">

                  <div class="flex items-center">

                    <button
                      type="button"
                      class="flex h-9 w-9 items-center justify-center rounded-l-lg border border-gray-300 hover:bg-gray-50"
                      @click="cartStore.decreaseQuantity(item.id)"
                    >
                      <i class="fa-solid fa-minus text-xs"></i>
                    </button>

                    <span
                      class="flex h-9 w-12 items-center justify-center border-y border-gray-300 text-sm font-semibold"
                    >
                      {{ item.quantity }}
                    </span>

                    <button
                      type="button"
                      class="flex h-9 w-9 items-center justify-center rounded-r-lg border border-gray-300 hover:bg-gray-50"
                      :disabled="item.quantity >= item.stock"
                      @click="cartStore.increaseQuantity(item.id)"
                    >
                      <i class="fa-solid fa-plus text-xs"></i>
                    </button>

                  </div>


                  <!-- Item Total -->

                  <p class="font-bold text-gray-900">

                    $
                    {{
                      (item.price * item.quantity).toFixed(2)
                    }}

                  </p>

                </div>

              </div>

            </div>

          </div>


          <!-- Clear Cart -->

          <div class="flex justify-end">

            <button
              type="button"
              class="text-sm font-medium text-red-500 hover:text-red-600"
              @click="cartStore.clearCart"
            >
              <i class="fa-solid fa-trash-can mr-1"></i>
              Clear Cart
            </button>

          </div>

        </div>


        <!-- Summary -->

        <aside>

          <div class="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">

            <h2 class="text-xl font-bold text-gray-900">
              Order Summary
            </h2>


            <div class="mt-6 space-y-4">

              <div class="flex justify-between text-gray-600">

                <span>
                  Subtotal
                </span>

                <span class="font-medium text-gray-900">
                  ${{ cartStore.totalPrice.toFixed(2) }}
                </span>

              </div>


              <div class="flex justify-between text-gray-600">

                <span>
                  Shipping
                </span>

                <span class="font-medium text-gray-900">

                  <span v-if="shipping === 0">
                    Free
                  </span>

                  <span v-else>
                    ${{ shipping.toFixed(2) }}
                  </span>

                </span>

              </div>


              <div class="border-t pt-4">

                <div class="flex justify-between">

                  <span class="font-bold text-gray-900">
                    Total
                  </span>

                  <span class="text-xl font-bold text-green-600">
                    ${{ grandTotal.toFixed(2) }}
                  </span>

                </div>

              </div>

            </div>


            <RouterLink
              to="/checkout"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 font-semibold text-white hover:bg-green-700"
            >
              Proceed to Checkout
              <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>


            <RouterLink
              to="/products"
              class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              <i class="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </RouterLink>

          </div>

        </aside>

      </div>

    </section>

  </div>

</template>


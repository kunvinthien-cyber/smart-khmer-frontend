<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import api from '../services/api'

const route = useRoute()
const orderStore = useOrderStore()
const order = ref(orderStore.getOrderById(route.query.order))

const normalizeOrder = (serverOrder) => ({
  ...serverOrder,
  orderNumber: serverOrder.order_number || serverOrder.orderNumber,
  createdAt: serverOrder.created_at || serverOrder.createdAt,
  paymentStatus: serverOrder.payment_status || serverOrder.paymentStatus,
  paymentMethod: serverOrder.payment_method || serverOrder.paymentMethod,
  shipping: Number(serverOrder.shipping_fee ?? serverOrder.shipping ?? 0),
  subtotal: Number(serverOrder.subtotal || 0),
  total: Number(serverOrder.total || 0),
  items: (serverOrder.items || []).map((item) => ({
    ...item,
    title: item.product_name || item.title,
  })),
})

onMounted(async () => {
  try {
    const response = await api.get(`/orders/${route.query.order}`)
    order.value = normalizeOrder(response.data.data)
  } catch (error) {
    console.error('Unable to load order details:', error)
  }
})
</script>


<template>

  <div class="min-h-screen bg-gray-50">

    <section
      v-if="order"
      class="mx-auto max-w-3xl px-4 py-16"
    >

      <!-- Success -->

      <div class="text-center">

        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600"
        >
          <i class="fa-solid fa-check"></i>
        </div>

        <h1 class="mt-6 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p class="mt-3 text-gray-500">
          Thank you for shopping with Smart Khmer Marketplace.
        </p>

      </div>


      <!-- Order Card -->

      <div
        class="mt-10 rounded-2xl border bg-white p-6 shadow-sm"
      >

        <div
          class="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between"
        >

          <div>

            <p class="text-sm text-gray-500">
              Order Number
            </p>

            <p class="mt-1 text-xl font-bold text-gray-900">
              {{ order.orderNumber }}
            </p>

          </div>


          <span
            class="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-semibold text-yellow-700"
          >
            <i class="fa-solid fa-clock"></i>
            {{ order.status }}
          </span>

        </div>


        <!-- Summary -->

        <div class="mt-6 space-y-4">

          <div class="flex justify-between text-gray-600">

            <span>
              Items
            </span>

            <span class="font-medium text-gray-900">
              {{ order.items?.length || 0 }}
            </span>

          </div>


          <div class="flex justify-between text-gray-600">

            <span>
              Subtotal
            </span>

            <span>
              ${{ order.subtotal.toFixed(2) }}
            </span>

          </div>


          <div class="flex justify-between text-gray-600">

            <span>
              Delivery
            </span>

            <span>
              {{
                order.shipping === 0
                  ? 'FREE'
                  : '$' + order.shipping.toFixed(2)
              }}
            </span>

          </div>


          <div class="border-t pt-4">

            <div class="flex justify-between">

              <span class="font-bold text-gray-900">
                Total
              </span>

              <span class="text-xl font-bold text-green-600">
                ${{ order.total.toFixed(2) }}
              </span>

            </div>

          </div>

        </div>


        <!-- Payment -->

        <div class="mt-6 rounded-xl bg-gray-50 p-4">

          <div class="flex items-center gap-3">

            <i class="fa-solid fa-credit-card text-green-600"></i>

            <div>

              <p class="text-sm text-gray-500">
                Payment Method
              </p>

              <p class="font-semibold capitalize text-gray-900">
                {{ order.paymentMethod }}
              </p>

            </div>

          </div>

        </div>

      </div>


      <!-- Actions -->

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">

        <RouterLink
          to="/orders"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white hover:bg-green-700"
        >
          <i class="fa-solid fa-box"></i>
          View My Orders
        </RouterLink>


        <RouterLink
          to="/products"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 font-semibold text-gray-700 hover:bg-gray-50"
        >
          <i class="fa-solid fa-bag-shopping"></i>
          Continue Shopping
        </RouterLink>

      </div>

    </section>


    <!-- Not Found -->

    <section
      v-else
      class="px-4 py-20 text-center"
    >

      <i class="fa-solid fa-circle-exclamation text-5xl text-gray-300"></i>

      <h2 class="mt-5 text-2xl font-bold text-gray-900">
        Order not found
      </h2>

      <RouterLink
        to="/"
        class="mt-6 inline-flex rounded-lg bg-green-600 px-6 py-3 font-semibold text-white"
      >
        Back to Home
      </RouterLink>

    </section>

  </div>

</template>


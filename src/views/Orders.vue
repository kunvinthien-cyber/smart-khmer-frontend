
<script setup>
import { onMounted, ref } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import { useToastStore } from '../stores/toastStore'
import api from '../services/api'

defineOptions({
  name: 'OrdersPage',
})

const orderStore = useOrderStore()
const toastStore = useToastStore()
const busyOrderId = ref(null)
const cancellableStatuses = ['pending', 'confirmed', 'processing']
const cancellationOrder = ref(null)
const cancellationReason = ref('')

const loadOrders = async () => {
  try {
    const response = await api.get('/orders')
    const responseData = response.data.data
    const serverOrders = Array.isArray(responseData)
      ? responseData
      : responseData?.data || []

    orderStore.replaceOrders(serverOrders.map((order) => ({
      ...order,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      shipping: Number(order.shipping_fee || 0),
      subtotal: Number(order.subtotal || 0),
      total: Number(order.total || 0),
      items: (order.items || []).map((item) => ({
        ...item,
        title: item.product_name,
      })),
    })))
  } catch (error) {
    // Keep locally cached orders visible when the API is unavailable.
    console.error('Unable to load orders:', error)
  }
}

onMounted(loadOrders)

const cancelOrder = async (order) => {
  cancellationOrder.value = order
  cancellationReason.value = ''
}

const closeCancellationPopup = () => {
  if (busyOrderId.value === cancellationOrder.value?.id) {
    return
  }

  cancellationOrder.value = null
  cancellationReason.value = ''
}

const submitCancellation = async () => {
  const order = cancellationOrder.value
  const reason = cancellationReason.value.trim()

  if (!order || !reason) {
    return
  }

  busyOrderId.value = order.id

  try {
    const response = await api.post(`/orders/${order.id}/cancel`, {
      reason,
    })
    orderStore.updateOrder(order.id, { status: response.data.data.status })
    toastStore.showToast('Order cancelled successfully.')
    closeCancellationPopup()
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || 'Unable to cancel this order.',
      'error',
    )
  } finally {
    busyOrderId.value = null
  }
}

const confirmReceived = async (order) => {
  busyOrderId.value = order.id

  try {
    const response = await api.post(`/orders/${order.id}/confirm-received`)
    orderStore.updateOrder(order.id, { status: response.data.data.status })
    toastStore.showToast('Order marked as completed.')
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || 'Unable to confirm this order.',
      'error',
    )
  } finally {
    busyOrderId.value = null
  }
}

const formatDate = (date) => {

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )

}
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
            My Orders
          </span>

        </div>

        <h1 class="mt-4 text-3xl font-bold text-gray-900">
          My Orders
        </h1>

      </div>

    </section>


    <!-- Empty -->

    <section
      v-if="orderStore.orders.length === 0"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"
      >
        <i class="fa-solid fa-box-open"></i>
      </div>

      <h2 class="mt-6 text-2xl font-bold text-gray-900">
        No orders yet
      </h2>

      <p class="mt-2 text-gray-500">
        Your orders will appear here after checkout.
      </p>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-bag-shopping"></i>
        Start Shopping
      </RouterLink>

    </section>


    <!-- Orders -->

    <section
      v-else
      class="mx-auto max-w-5xl px-4 py-10"
    >

      <div class="space-y-4">

        <article
          v-for="order in orderStore.orders"
          :key="order.id"
          class="rounded-2xl border bg-white p-5"
        >

          <div
            class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >

            <!-- Order -->

            <div>

              <p class="text-sm text-gray-500">
                Order Number
              </p>

              <p class="mt-1 font-bold text-gray-900">
                {{ order.orderNumber }}
              </p>

              <p class="mt-1 text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </p>

            </div>


            <!-- Status -->

            <span
              class="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-semibold text-yellow-700"
            >

              <i class="fa-solid fa-clock"></i>

              {{ order.status }}

            </span>


            <!-- Total -->

            <div>

              <p class="text-sm text-gray-500">
                Total
              </p>

              <p class="mt-1 text-lg font-bold text-green-600">
                ${{ order.total.toFixed(2) }}
              </p>

            </div>


            <!-- Button -->

            <RouterLink
              :to="{
                path: '/order-success',
                query: {
                  order: order.id,
                },
              }"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Details
              <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>

            <button
              v-if="cancellableStatuses.includes(order.status)"
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              :disabled="busyOrderId === order.id"
              @click="cancelOrder(order)"
            >
              Cancel order
            </button>

            <button
              v-if="order.status === 'delivered'"
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              :disabled="busyOrderId === order.id"
              @click="confirmReceived(order)"
            >
              Confirm received
            </button>

          </div>

        </article>

      </div>

    </section>

  </div>

  <div
    v-if="cancellationOrder"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cancel-order-title"
    @click.self="closeCancellationPopup"
  >
    <form
      class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      @submit.prevent="submitCancellation"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="cancel-order-title" class="text-xl font-bold text-gray-900">
            Cancel order
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Please tell us why you want to cancel this order.
          </p>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Close cancellation popup"
          @click="closeCancellationPopup"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <label class="mt-5 block text-sm font-semibold text-gray-700" for="cancellation-reason">
        Cancellation reason
      </label>
      <textarea
        id="cancellation-reason"
        v-model="cancellationReason"
        rows="4"
        maxlength="500"
        required
        placeholder="Enter your reason..."
        class="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      ></textarea>

      <div class="mt-5 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          :disabled="busyOrderId === cancellationOrder.id"
          @click="closeCancellationPopup"
        >
          Keep order
        </button>
        <button
          type="submit"
          class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!cancellationReason.trim() || busyOrderId === cancellationOrder.id"
        >
          {{ busyOrderId === cancellationOrder.id ? 'Cancelling...' : 'Confirm cancellation' }}
        </button>
      </div>
    </form>
  </div>

</template>

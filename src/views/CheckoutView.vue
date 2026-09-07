
<script setup>
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import api from '../services/api'

const cartStore = useCartStore()
const toastStore = useToastStore()
const router = useRouter()
const orderStore = useOrderStore()
const submitting = ref(false)
const showPaymentModal = ref(false)
const qrData = ref({})
const pendingPayment = ref(null)
let checkInterval = null

const stopPaymentPolling = () => {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

const completeOrder = (
  orderDetails,
  message = 'Payment received successfully!',
  serverOrder = {},
) => {
  const order = orderStore.createOrder({
    ...orderDetails,
    id: serverOrder.id,
    orderNumber: serverOrder.order_number,
    status: serverOrder.status,
    paymentStatus: serverOrder.payment_status,
  })

  cartStore.clearCart()
  showPaymentModal.value = false
  pendingPayment.value = null
  toastStore.showToast(message)
  router.push({ name: 'order-success', query: { order: order.id } })
}

const skipBakongPayment = () => {
  if (!pendingPayment.value) {
    return
  }

  stopPaymentPolling()
  completeOrder(
    pendingPayment.value.orderDetails,
    'Order placed. Bakong payment is still pending.'
    , pendingPayment.value.serverOrder,
  )
}

const openPayment = async (serverOrder, orderDetails) => {
  try {
    pendingPayment.value = { serverOrder, orderDetails }
    const res = await api.post(`/orders/${serverOrder.id}/bakong-qr`)
    qrData.value = res.data.data
    showPaymentModal.value = true

    // ២. Polling: ពិនិត្យ status រៀងរាល់ 3 វិនាទីម្តង
    checkInterval = setInterval(async () => {
      try {
        const statusRes = await api.get(`/orders/${serverOrder.id}/bakong-status`, {
          params: { md5: qrData.value.md5 },
        })
        if (statusRes.data.data.is_paid) {
          stopPaymentPolling()
          completeOrder(orderDetails, 'Payment received successfully!', {
            ...serverOrder,
            ...statusRes.data.data,
          })
        }
      } catch (error) {
        console.error('Unable to check payment status:', error)
      }
    }, 3000)
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || 'Unable to create the payment QR code.',
      'error'
    )
  }
}

onUnmounted(() => {
  stopPaymentPolling()
})
const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  province: '',
  district: '',
  address: '',
  note: '',
  deliveryMethod: 'standard',
  paymentMethod: 'cash',
})

const provinces = [
  'Phnom Penh',
  'Kandal',
  'Takeo',
  'Kampot',
  'Kep',
  'Sihanoukville',
  'Koh Kong',
  'Battambang',
  'Pursat',
  'Kampong Chhnang',
  'Kampong Speu',
  'Kampong Thom',
  'Kampong Cham',
  'Prey Veng',
  'Svay Rieng',
  'Banteay Meanchey',
  'Siem Reap',
  'Oddar Meanchey',
  'Preah Vihear',
  'Kratie',
  'Stung Treng',
  'Mondulkiri',
  'Ratanakiri',
  'Tbong Khmum',
]

const deliveryPrices = {
  standard: 3,
  express: 6,
}

const shipping = computed(() => {
  if (cartStore.totalPrice <= 0.1 || cartStore.totalPrice >= 50) {
    return 0
  }

  return deliveryPrices[form.deliveryMethod]
})

const grandTotal = computed(() => {
  return cartStore.totalPrice + shipping.value
})

const placeOrder = async () => {

  if (cartStore.items.length === 0) {
    toastStore.showToast(
      'Your cart is empty',
      'error'
    )

    return
  }


  if (
    !form.firstName ||
    !form.lastName ||
    !form.phone ||
    !form.province ||
    !form.district ||
    !form.address
  ) {

    toastStore.showToast(
      'Please complete all required fields',
      'error'
    )

    return
  }


  submitting.value = true

  try {
    await Promise.all(cartStore.items.map(item => api.post('/cart/items', {
      product_id: item.id,
      quantity: item.quantity,
    })))

    const response = await api.post('/orders', {
      shipping_address: [form.firstName, form.lastName, form.province, form.district, form.address]
        .filter(Boolean)
        .join(', '),
      shipping_phone: form.phone,
      payment_method: {
        cash: 'cash_on_delivery',
        bakong: 'bakong_khqr',
        card: 'aba_payway',
      }[form.paymentMethod],
      notes: form.note || null,
    })

    const orderDetails = {
      customer: { ...form },
      items: cartStore.items,
      subtotal: cartStore.totalPrice,
      shipping: shipping.value,
      total: grandTotal.value,
      deliveryMethod: form.deliveryMethod,
      paymentMethod: form.paymentMethod,
    }

    if (form.paymentMethod === 'cash') {
      const order = orderStore.createOrder({
        ...orderDetails,
        id: response.data.data.id,
        orderNumber: response.data.data.order_number,
        status: response.data.data.status,
        paymentStatus: response.data.data.payment_status,
      })
      cartStore.clearCart()
      toastStore.showToast('Order placed successfully!')
      router.push({ name: 'order-success', query: { order: order.id } })
      return
    }

    await openPayment(response.data.data, orderDetails)
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.message || 'Unable to place your order. Please try again.',
      'error'
    )
  } finally {
    submitting.value = false
  }
}
</script>


<template>

  <div class="min-h-screen bg-gray-50">

    <!-- =====================================
         Header
    ====================================== -->

    <section class="border-b bg-white">

      <div class="mx-auto max-w-7xl px-4 py-8">

        <div class="flex items-center gap-2 text-sm text-gray-500">

          <RouterLink
            to="/"
            class="hover:text-green-600"
          >
            Home
          </RouterLink>

          <i class="fa-solid fa-chevron-right text-xs"></i>

          <RouterLink
            to="/cart"
            class="hover:text-green-600"
          >
            Cart
          </RouterLink>

          <i class="fa-solid fa-chevron-right text-xs"></i>

          <span class="text-gray-900">
            Checkout
          </span>

        </div>


        <h1 class="mt-4 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

      </div>

    </section>


    <!-- =====================================
         Empty Cart
    ====================================== -->

    <section
      v-if="cartStore.items.length === 0"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >

      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400"
      >
        <i class="fa-solid fa-cart-shopping"></i>
      </div>

      <h2 class="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <RouterLink
        to="/products"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        <i class="fa-solid fa-bag-shopping"></i>
        Start Shopping
      </RouterLink>

    </section>


    <!-- =====================================
         Checkout
    ====================================== -->

    <section
      v-else
      class="mx-auto max-w-7xl px-4 py-10"
    >

      <div class="grid gap-8 lg:grid-cols-[1fr_380px]">


        <!-- ==================================
             LEFT
        =================================== -->

        <div class="space-y-6">


          <!-- Customer Information -->

          <div class="rounded-2xl border bg-white p-6">

            <div class="flex items-center gap-3">

              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                <i class="fa-solid fa-user"></i>
              </div>

              <div>

                <h2 class="text-xl font-bold text-gray-900">
                  Customer Information
                </h2>

                <p class="text-sm text-gray-500">
                  Enter your contact information
                </p>

              </div>

            </div>


            <div class="mt-6 grid gap-5 sm:grid-cols-2">


              <!-- First Name -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  First Name *
                </label>

                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="First name"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>


              <!-- Last Name -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Last Name *
                </label>

                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Last name"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>


              <!-- Phone -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>

                <div class="flex">

                  <span
                    class="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600"
                  >
                    +855
                  </span>

                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="12 345 678"
                    class="w-full rounded-r-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                </div>

              </div>


              <!-- Email -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@email.com"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

          </div>


          <!-- ==================================
               Address
          =================================== -->

          <div class="rounded-2xl border bg-white p-6">

            <div class="flex items-center gap-3">

              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                <i class="fa-solid fa-location-dot"></i>
              </div>

              <div>

                <h2 class="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>

                <p class="text-sm text-gray-500">
                  Where should we deliver your order?
                </p>

              </div>

            </div>


            <div class="mt-6 grid gap-5 sm:grid-cols-2">


              <!-- Province -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Province / City *
                </label>

                <select
                  v-model="form.province"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >

                  <option value="">
                    Select province
                  </option>

                  <option
                    v-for="province in provinces"
                    :key="province"
                    :value="province"
                  >
                    {{ province }}
                  </option>

                </select>

              </div>


              <!-- District -->

              <div>

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  District / Khan *
                </label>

                <input
                  v-model="form.district"
                  type="text"
                  placeholder="District / Khan"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

              </div>


              <!-- Address -->

              <div class="sm:col-span-2">

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Full Address *
                </label>

                <textarea
                  v-model="form.address"
                  rows="3"
                  placeholder="House number, street, village..."
                  class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                ></textarea>

              </div>


              <!-- Note -->

              <div class="sm:col-span-2">

                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Delivery Note
                </label>

                <textarea
                  v-model="form.note"
                  rows="2"
                  placeholder="Example: Please call before delivery"
                  class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                ></textarea>

              </div>

            </div>

          </div>


          <!-- ==================================
               Delivery Method
          =================================== -->

          <div class="rounded-2xl border bg-white p-6">

            <div class="flex items-center gap-3">

              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                <i class="fa-solid fa-truck"></i>
              </div>

              <div>

                <h2 class="text-xl font-bold text-gray-900">
                  Delivery Method
                </h2>

              </div>

            </div>


            <div class="mt-6 space-y-3">


              <!-- Standard -->

              <label
                class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition"
                :class="
                  form.deliveryMethod === 'standard'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                "
              >

                <div class="flex items-center gap-4">

                  <input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="standard"
                    class="h-4 w-4 accent-green-600"
                  />

                  <div>

                    <p class="font-semibold text-gray-900">
                      Standard Delivery
                    </p>

                    <p class="text-sm text-gray-500">
                      2–4 business days
                    </p>

                  </div>

                </div>

                <span class="font-semibold text-gray-900">
                  {{ cartStore.totalPrice >= 50 ? 'FREE' : '$3.00' }}
                </span>

              </label>


              <!-- Express -->

              <label
                class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition"
                :class="
                  form.deliveryMethod === 'express'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                "
              >

                <div class="flex items-center gap-4">

                  <input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="express"
                    class="h-4 w-4 accent-green-600"
                  />

                  <div>

                    <p class="font-semibold text-gray-900">
                      Express Delivery
                    </p>

                    <p class="text-sm text-gray-500">
                      1–2 business days
                    </p>

                  </div>

                </div>

                <span class="font-semibold text-gray-900">
                  {{ cartStore.totalPrice >= 50 ? 'FREE' : '$6.00' }}
                </span>

              </label>

            </div>

          </div>


          <!-- ==================================
               Payment
          =================================== -->

          <div class="rounded-2xl border bg-white p-6">

            <div class="flex items-center gap-3">

              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"
              >
                <i class="fa-solid fa-credit-card"></i>
              </div>

              <div>

                <h2 class="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>

                <p class="text-sm text-gray-500">
                  Choose how you want to pay
                </p>

              </div>

            </div>


            <div class="mt-6 space-y-3">


              <!-- Cash -->

              <label
                class="flex cursor-pointer items-center gap-4 rounded-xl border p-4"
                :class="
                  form.paymentMethod === 'cash'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                "
              >

                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="cash"
                  class="h-4 w-4 accent-green-600"
                />

                <i class="fa-solid fa-money-bill-wave text-xl text-green-600"></i>

                <div>

                  <p class="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p class="text-sm text-gray-500">
                    Pay when your order arrives
                  </p>

                </div>

              </label>


              <!-- Bakong -->

              <label
                class="flex cursor-pointer items-center gap-4 rounded-xl border p-4"
                :class="
                  form.paymentMethod === 'bakong'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                "
              >

                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="bakong"
                  class="h-4 w-4 accent-green-600"
                />

                <i class="fa-solid fa-qrcode text-xl text-green-600"></i>

                <div>

                  <p class="font-semibold text-gray-900">
                    Bakong / KHQR
                  </p>

                  <p class="text-sm text-gray-500">
                    Pay securely using KHQR
                  </p>

                </div>

              </label>


              <!-- Card -->

              <label
                class="flex cursor-pointer items-center gap-4 rounded-xl border p-4"
                :class="
                  form.paymentMethod === 'card'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                "
              >

                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="card"
                  class="h-4 w-4 accent-green-600"
                />

                <i class="fa-solid fa-credit-card text-xl text-green-600"></i>

                <div>

                  <p class="font-semibold text-gray-900">
                    Credit / Debit Card
                  </p>

                  <p class="text-sm text-gray-500">
                    Visa, Mastercard
                  </p>

                </div>

              </label>

            </div>

          </div>

        </div>


        <!-- ==================================
             RIGHT - ORDER SUMMARY
        =================================== -->

        <aside>

          <div class="sticky top-24 rounded-2xl border bg-white p-6">

            <h2 class="text-xl font-bold text-gray-900">
              Order Summary
            </h2>


            <!-- Products -->

            <div class="mt-6 space-y-4">

              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-3"
              >

                <div
                  class="relative h-16 w-16 shrink-0 rounded-lg bg-gray-100"
                >

                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="h-full w-full object-contain"
                  />

                  <span
                    class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white"
                  >
                    {{ item.quantity }}
                  </span>

                </div>


                <div class="min-w-0 flex-1">

                  <p class="line-clamp-2 text-sm font-medium text-gray-900">
                    {{ item.title }}
                  </p>

                  <p class="mt-1 text-sm text-gray-500">
                    ${{ item.price.toFixed(2) }} × {{ item.quantity }}
                  </p>

                </div>


                <span class="font-semibold text-gray-900">

                  $
                  {{
                    (item.price * item.quantity).toFixed(2)
                  }}

                </span>

              </div>

            </div>


            <div class="my-6 border-t"></div>


            <!-- Price -->

            <div class="space-y-3">

              <div class="flex justify-between text-gray-600">

                <span>
                  Subtotal
                </span>

                <span>
                  ${{ cartStore.totalPrice.toFixed(2) }}
                </span>

              </div>


              <div class="flex justify-between text-gray-600">

                <span>
                  Delivery
                </span>

                <span>

                  <span v-if="shipping === 0">
                    Free
                  </span>

                  <span v-else>
                    ${{ shipping.toFixed(2) }}
                  </span>

                </span>

              </div>

            </div>


            <div class="my-5 border-t"></div>


            <!-- Total -->

            <div class="flex items-center justify-between">

              <span class="text-lg font-bold text-gray-900">
                Total
              </span>

              <span class="text-2xl font-bold text-green-600">
                ${{ grandTotal.toFixed(2) }}
              </span>

            </div>


            <!-- Place Order -->

            <button
              type="button"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
              @click="placeOrder"
            >

              <i
                v-if="submitting"
                class="fa-solid fa-spinner fa-spin"
              ></i>

              <i
                v-else
                class="fa-solid fa-lock"
              ></i>

              <span>
                {{ submitting ? 'Processing...' : 'Place Order' }}
              </span>

            </button>


            <div class="mt-4 flex items-start gap-2 text-xs text-gray-500">

              <i class="fa-solid fa-shield-halved mt-0.5"></i>

              <p>
                Your order information is securely handled.
              </p>

            </div>

          </div>

        </aside>

      </div>

    </section>

    <div
      v-if="showPaymentModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-dialog-title"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div class="flex items-center justify-between">
          <h2 id="payment-dialog-title" class="text-xl font-bold text-gray-900">
            Complete payment
          </h2>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close payment dialog"
            @click="stopPaymentPolling(); showPaymentModal = false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <p class="mt-2 text-sm text-gray-500">
          Scan this QR code with your banking app.
        </p>

        <img
          v-if="qrData.qr_image_url"
          :src="qrData.qr_image_url"
          alt="Payment QR code"
          class="mx-auto mt-5 h-64 w-64 rounded-lg border border-gray-200"
        />

        <p class="mt-4 text-lg font-bold text-green-700">
          {{ qrData.currency }} {{ Number(qrData.amount || 0).toFixed(2) }}
        </p>

        <a
          v-if="qrData.deeplink"
          :href="qrData.deeplink"
          class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700"
        >
          <i class="fa-solid fa-building-columns"></i>
          Open banking app
        </a>

        <p class="mt-4 text-xs text-gray-500">
          Waiting for payment confirmation...
        </p>

        <button
          type="button"
          class="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          @click="skipBakongPayment"
        >
          Skip Bakong payment for now
        </button>
      </div>
    </div>

  </div>

</template>

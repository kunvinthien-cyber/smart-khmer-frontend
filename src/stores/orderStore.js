import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'smart-khmer-orders'

const savedOrders = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || '[]'
)

export const useOrderStore = defineStore('order', () => {

  const orders = ref(savedOrders)


  // ========================================
  // Save
  // ========================================

  const saveOrders = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(orders.value)
    )
  }


  // ========================================
  // Generate Order Number
  // ========================================

  const generateOrderNumber = () => {

    const year = new Date().getFullYear()

    const number = String(
      orders.value.length + 1
    ).padStart(6, '0')

    return `ORD-${year}-${number}`
  }


  // ========================================
  // Create Order
  // ========================================

  const createOrder = ({
    id,
    orderNumber,
    status,
    paymentStatus,
    customer,
    items,
    subtotal,
    shipping,
    total,
    deliveryMethod,
    paymentMethod,
  }) => {

    const order = {

      id: id || Date.now(),

      orderNumber: orderNumber || generateOrderNumber(),

      status: status || 'pending',

      paymentStatus: paymentStatus || 'unpaid',

      createdAt: new Date().toISOString(),

      customer,

      items: JSON.parse(
        JSON.stringify(items)
      ),

      subtotal,

      shipping,

      total,

      deliveryMethod,

      paymentMethod,

    }


    orders.value.unshift(order)

    saveOrders()

    return order
  }

  const updateOrder = (id, updates) => {
    const order = getOrderById(id)

    if (!order) {
      return
    }

    Object.assign(order, updates)
    saveOrders()
  }

  const replaceOrders = (newOrders) => {
    orders.value = newOrders
    saveOrders()
  }


  // ========================================
  // Find Order
  // ========================================

  const getOrderById = (id) => {

    return orders.value.find(
      order => String(order.id) === String(id)
    )

  }


  // ========================================
  // Computed
  // ========================================

  const totalOrders = computed(() => {
    return orders.value.length
  })


  return {

    orders,
    totalOrders,

    createOrder,
    updateOrder,
    replaceOrders,
    getOrderById,

  }

})

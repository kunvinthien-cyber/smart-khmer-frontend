
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {

  // ========================================
  // State
  // ========================================

  const items = ref(
    JSON.parse(
      localStorage.getItem('smart-khmer-cart') || '[]'
    )
  )


  // ========================================
  // Save Cart
  // ========================================

  const saveCart = () => {
    localStorage.setItem(
      'smart-khmer-cart',
      JSON.stringify(items.value)
    )
  }


  // ========================================
  // Add To Cart
  // ========================================

  const addToCart = (product, quantity = 1) => {

    const existingItem = items.value.find(
      item => item.id === product.id
    )


    if (existingItem) {

      existingItem.quantity += quantity

    } else {

      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        quantity,
      })

    }


    saveCart()
  }


  // ========================================
  // Remove
  // ========================================

  const removeFromCart = (productId) => {

    items.value = items.value.filter(
      item => item.id !== productId
    )

    saveCart()
  }


  // ========================================
  // Increase
  // ========================================

  const increaseQuantity = (productId) => {

    const item = items.value.find(
      item => item.id === productId
    )

    if (!item) return

    if (item.quantity < item.stock) {
      item.quantity++
      saveCart()
    }

  }


  // ========================================
  // Decrease
  // ========================================

  const decreaseQuantity = (productId) => {

    const item = items.value.find(
      item => item.id === productId
    )

    if (!item) return

    if (item.quantity > 1) {

      item.quantity--

    } else {

      removeFromCart(productId)
      return

    }

    saveCart()
  }


  // ========================================
  // Clear
  // ========================================

  const clearCart = () => {

    items.value = []

    saveCart()

  }


  // ========================================
  // Computed
  // ========================================

  const totalItems = computed(() => {

    return items.value.reduce(
      (total, item) => total + item.quantity,
      0
    )

  })


  const totalPrice = computed(() => {

    return items.value.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    )

  })


  return {
    items,

    totalItems,
    totalPrice,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }

})


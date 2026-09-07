import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'smart-khmer-wishlist'

export const useWishlistStore = defineStore('wishlist', () => {

  const items = ref(
    JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
  )


  // Save to LocalStorage
  const saveWishlist = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.value)
    )
  }


  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return items.value.some(
      item => item.id === productId
    )
  }


  // Add / Remove
  const toggleWishlist = (product) => {

    const index = items.value.findIndex(
      item => item.id === product.id
    )

    if (index === -1) {

      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        rating: product.rating,
      })

    } else {

      items.value.splice(index, 1)

    }

    saveWishlist()
  }


  // Remove
  const removeFromWishlist = (productId) => {

    items.value = items.value.filter(
      item => item.id !== productId
    )

    saveWishlist()
  }


  // Clear
  const clearWishlist = () => {

    items.value = []

    saveWishlist()

  }


  // Total
  const totalItems = computed(() => {
    return items.value.length
  })


  return {
    items,
    totalItems,

    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  }
})


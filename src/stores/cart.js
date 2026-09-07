import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    subtotal: 0,
    shippingFee: 0,
    total: 0,
    itemsCount: 0,
    loading: false,
  }),

  actions: {
    async fetchCart() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return;

      this.loading = true;
      try {
        const response = await api.get('/cart');
        const cartData = response.data.data;
        this.items = cartData.items || [];
        this.subtotal = cartData.subtotal;
        this.shippingFee = cartData.shipping_fee;
        this.total = cartData.total;
        this.itemsCount = cartData.items_count;
      } catch (err) {
        console.error('Failed to load cart', err);
      } finally {
        this.loading = false;
      }
    },

    async addToCart(productId, quantity = 1) {
      try {
        const response = await api.post('/cart/items', {
          product_id: productId,
          quantity: quantity,
        });
        const cartData = response.data.data;
        this.items = cartData.items;
        this.subtotal = cartData.subtotal;
        this.shippingFee = cartData.shipping_fee;
        this.total = cartData.total;
        this.itemsCount = cartData.items_count;
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to add item to cart';
      }
    },

    async updateQuantity(cartItemId, quantity) {
      try {
        const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
        const cartData = response.data.data;
        this.items = cartData.items;
        this.subtotal = cartData.subtotal;
        this.shippingFee = cartData.shipping_fee;
        this.total = cartData.total;
        this.itemsCount = cartData.items_count;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to update item';
      }
    },

    async removeItem(cartItemId) {
      try {
        const response = await api.delete(`/cart/items/${cartItemId}`);
        const cartData = response.data.data;
        this.items = cartData.items;
        this.subtotal = cartData.subtotal;
        this.shippingFee = cartData.shipping_fee;
        this.total = cartData.total;
        this.itemsCount = cartData.items_count;
      } catch (err) {
        console.error(err);
      }
    },

    async checkout(checkoutPayload) {
      try {
        const response = await api.post('/orders', checkoutPayload);
        // Clear local cart state upon successful order placement
        this.items = [];
        this.subtotal = 0;
        this.shippingFee = 0;
        this.total = 0;
        this.itemsCount = 0;
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Checkout failed';
      }
    }
  }
});

import { defineStore } from 'pinia';
import api from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    featuredProducts: [],
    categories: [],
    currentProduct: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true;
      try {
        const response = await api.get('/products', { params });
        this.products = response.data.data;
        if (response.data.meta) {
          this.pagination = {
            currentPage: response.data.meta.current_page,
            lastPage: response.data.meta.last_page,
            total: response.data.meta.total,
          };
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedProducts() {
      try {
        const response = await api.get('/products/featured');
        this.featuredProducts = response.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories');
        this.categories = response.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchProductDetail(idOrSlug) {
      this.loading = true;
      try {
        const response = await api.get(`/products/${idOrSlug}`);
        this.currentProduct = response.data.data;
        return this.currentProduct;
      } catch (err) {
        this.error = err.response?.data?.message || 'Product not found';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});

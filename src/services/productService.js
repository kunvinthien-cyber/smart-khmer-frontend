import api from './api'
import { fallbackCategories, fallbackProducts } from '../data/catalog'

const normalizeProduct = (product) => ({
  ...product,
  title: product.title || product.name,
  price: Number(product.final_price ?? product.price ?? 0),
  discountPercentage: product.discount_price && product.price
    ? ((product.price - product.discount_price) / product.price) * 100
    : 0,
  category: typeof product.category === 'object'
    ? product.category?.name
    : product.category,
})

const toProductResponse = (products, params = {}) => {
  const skip = Number(params.skip || 0)
  const limit = Number(params.limit || products.length)
  const paginatedProducts = products.slice(skip, skip + limit)

  return {
    products: paginatedProducts,
    total: products.length,
    skip,
    limit,
  }
}

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params: {
      ...params,
      page: params.page || 1,
      per_page: params.per_page || params.limit || 12,
    } })
    return {
      ...response.data,
      products: response.data.data.map(normalizeProduct),
    }
  } catch (error) {
    console.warn('Product API unavailable; using local catalog.', error.message)
    return toProductResponse(fallbackProducts, params)
  }
}

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return normalizeProduct(response.data.data)
  } catch (error) {
    const product = fallbackProducts.find((item) => String(item.id) === String(id))
    if (product) return normalizeProduct(product)
    throw error
  }
}

export const searchProducts = async (query, params = {}) => {
  try {
    return await getProducts({ ...params, search: query })
  } catch {
    const keyword = query.toLowerCase().trim()
    return toProductResponse(fallbackProducts.filter((product) => (
      product.title.toLowerCase().includes(keyword) ||
      product.category.includes(keyword)
    )), params)
  }
}

export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data
  } catch {
    console.warn('Category API unavailable; using local catalog.')
    return fallbackCategories
  }
}

export const getProductsByCategory = async (category, params = {}) => {
  try {
    return await getProducts({ ...params, category })
  } catch {
    return toProductResponse(
      fallbackProducts.filter((product) => product.category === category),
      params
    )
  }
}
// export const getCategories = async () => {
//   const response = await fetch(
//     'https://dummyjson.com/products/categories'
//   )

//   if (!response.ok) {
//     throw new Error('Failed to fetch categories')
//   }

//   return await response.json()
// }

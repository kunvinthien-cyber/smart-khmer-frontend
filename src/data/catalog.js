const thumbnail = '/IMG/image.png'

export const fallbackProducts = [
  ['Cambodian Jasmine Rice', 'groceries', 12.5, 4.8, 45],
  ['Kampot Black Pepper', 'groceries', 8.9, 4.9, 38],
  ['Handwoven Rattan Tote', 'home-decoration', 24.0, 4.7, 16],
  ['Khmer Silk Scarf', 'womens-accessories', 18.5, 4.8, 22],
  ['Wooden Serving Tray', 'kitchen-accessories', 19.9, 4.6, 17],
  ['Bamboo Water Bottle', 'sports-accessories', 14.5, 4.5, 30],
  ['Artisan Ceramic Bowl', 'kitchen-accessories', 11.0, 4.7, 27],
  ['Natural Lemongrass Soap', 'beauty', 6.5, 4.6, 61],
  ['Palm Sugar Gift Set', 'groceries', 15.0, 4.8, 19],
  ['Cotton Market Bag', 'womens-accessories', 9.5, 4.4, 40],
  ['Traditional Wall Art', 'home-decoration', 35.0, 4.9, 9],
  ['Cashew Nut Snack Pack', 'groceries', 7.25, 4.5, 54],
].map(([title, category, price, rating, stock], index) => ({
  id: index + 1,
  title,
  category,
  price,
  rating,
  stock,
  thumbnail,
  images: [thumbnail],
  description: `Locally sourced ${title.toLowerCase()} from Smart Khmer Marketplace.`,
}))

export const fallbackCategories = [...new Set(
  fallbackProducts.map((product) => product.category)
)].map((slug) => ({
  slug,
  name: slug.replace(/-/g, ' '),
}))

import type { Product, RetailerName } from './types'

const retailerSearchUrls: Record<RetailerName, (query: string) => string> = {
  Amazon: (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
  Walmart: (query) => `https://www.walmart.com/search?q=${encodeURIComponent(query)}`,
  Target: (query) => `https://www.target.com/s?searchTerm=${encodeURIComponent(query)}`,
  'Best Buy': (query) => `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`,
}

const offer = (retailer: RetailerName, price: number, shipping = 0, stock: 'In stock' | 'Limited stock' = 'In stock') => ({
  retailer,
  price,
  shipping,
  stock,
  url: '',
})

const searchableOffers = (query: string, offers: ReturnType<typeof offer>[]) =>
  offers.map((item) => ({ ...item, url: retailerSearchUrls[item.retailer](query) }))

export const products: Product[] = [
  {
    id: 'aurora-headphones',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    shortName: 'Sony WH-1000XM5',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: 4.7,
    reviews: 2841,
    description: 'A real Sony over-ear headphone model with wireless listening and active noise cancellation.',
    badge: 'Student favorite',
    offers: searchableOffers('Sony WH-1000XM5', [offer('Amazon', 79), offer('Walmart', 84, 0), offer('Target', 89, 0, 'Limited stock'), offer('Best Buy', 94)]),
    history: [{ date: 'Jun', price: 109 }, { date: 'Jul', price: 101 }, { date: 'Aug', price: 96 }, { date: 'Sep', price: 92 }, { date: 'Oct', price: 86 }, { date: 'Nov', price: 79 }],
  },
  {
    id: 'novabook-air',
    name: 'Apple MacBook Air 13-inch M3 (16GB / 512GB)',
    shortName: 'MacBook Air M3',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
    rating: 4.6,
    reviews: 1204,
    description: 'A real Apple laptop model configured with 16GB unified memory and 512GB storage.',
    badge: 'Biggest savings',
    offers: searchableOffers('Apple MacBook Air 13 M3 16GB 512GB', [offer('Amazon', 949), offer('Walmart', 929), offer('Target', 979), offer('Best Buy', 899)]),
    history: [{ date: 'Jun', price: 999 }, { date: 'Jul', price: 979 }, { date: 'Aug', price: 989 }, { date: 'Sep', price: 949 }, { date: 'Oct', price: 929 }, { date: 'Nov', price: 899 }],
  },
  {
    id: 'pureflow-bottle',
    name: 'Owala FreeSip Insulated Water Bottle 32oz',
    shortName: 'Owala FreeSip 32oz',
    category: 'Everyday',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
    rating: 4.7,
    reviews: 3920,
    description: 'A real Owala stainless-steel water bottle model with the FreeSip drinking spout.',
    offers: searchableOffers('Owala FreeSip 32 oz', [offer('Amazon', 31), offer('Walmart', 29), offer('Target', 27), offer('Best Buy', 33, 4.99)]),
    history: [{ date: 'Jun', price: 34 }, { date: 'Jul', price: 33 }, { date: 'Aug', price: 31 }, { date: 'Sep', price: 30 }, { date: 'Oct', price: 29 }, { date: 'Nov', price: 27 }],
  },
  {
    id: 'brew-kit',
    name: 'CHEMEX Classic 6-Cup Pour-Over Coffee Maker',
    shortName: 'CHEMEX 6-Cup',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    rating: 4.6,
    reviews: 812,
    description: 'A real CHEMEX glass pour-over coffee maker model designed for up to six cups.',
    offers: searchableOffers('CHEMEX Classic 6 Cup Coffee Maker', [offer('Amazon', 45), offer('Walmart', 49), offer('Target', 52), offer('Best Buy', 54)]),
    history: [{ date: 'Jun', price: 54 }, { date: 'Jul', price: 52 }, { date: 'Aug', price: 51 }, { date: 'Sep', price: 49 }, { date: 'Oct', price: 47 }, { date: 'Nov', price: 45 }],
  },
  {
    id: 'haloglow-lamp',
    name: 'Philips Hue Go Portable Smart Table Lamp',
    shortName: 'Philips Hue Go',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    rating: 4.5,
    reviews: 640,
    description: 'A real Philips Hue portable smart light model with app-controlled color and dimming.',
    offers: searchableOffers('Philips Hue Go Portable Smart Table Lamp', [offer('Amazon', 36), offer('Walmart', 39), offer('Target', 42), offer('Best Buy', 45)]),
    history: [{ date: 'Jun', price: 43 }, { date: 'Jul', price: 42 }, { date: 'Aug', price: 44 }, { date: 'Sep', price: 40 }, { date: 'Oct', price: 38 }, { date: 'Nov', price: 36 }],
  },
  {
    id: 'trailpro-backpack',
    name: 'The North Face Borealis Backpack',
    shortName: 'Borealis Backpack',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    rating: 4.5,
    reviews: 987,
    description: 'A real The North Face backpack model with organized storage and a padded laptop sleeve.',
    offers: searchableOffers('The North Face Borealis Backpack', [offer('Amazon', 58), offer('Walmart', 55), offer('Target', 61), offer('Best Buy', 64, 0, 'Limited stock')]),
    history: [{ date: 'Jun', price: 66 }, { date: 'Jul', price: 65 }, { date: 'Aug', price: 63 }, { date: 'Sep', price: 60 }, { date: 'Oct', price: 58 }, { date: 'Nov', price: 55 }],
  },
]

export const coupons = [
  { retailer: 'Amazon', value: '15%', title: '15% off student electronics', code: 'STUDY15', expires: 'Nov 30, 2026', color: '#f6a95f' },
  { retailer: 'Target', value: '$10', title: '$10 off orders over $50', code: 'MOVEIN10', expires: 'Dec 15, 2026', color: '#ef7777' },
  { retailer: 'Best Buy', value: '20%', title: '20% off select accessories', code: 'DESKSET20', expires: 'Nov 25, 2026', color: '#6aa0d8' },
  { retailer: 'Walmart', value: '$12', title: '$12 off kitchen orders over $60', code: 'PANTRY12', expires: 'Dec 31, 2026', color: '#67b3a3' },
]

export const getTotal = (price: number, shipping: number) => price + shipping

export const sortedOffers = (product: Product) =>
  [...product.offers].sort((a, b) => getTotal(a.price, a.shipping) - getTotal(b.price, b.shipping))

export const getSavings = (product: Product) => {
  const totals = product.offers.map((item) => getTotal(item.price, item.shipping))
  return Math.max(...totals) - Math.min(...totals)
}

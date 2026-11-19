export type RetailerName = 'Amazon' | 'Walmart' | 'Target' | 'Best Buy'

export interface RetailerOffer {
  retailer: RetailerName
  price: number
  shipping: number
  stock: 'In stock' | 'Limited stock'
  url: string
}

export interface HistoryPoint {
  date: string
  price: number
}

export interface Product {
  id: string
  name: string
  shortName: string
  category: string
  image: string
  rating: number
  reviews: number
  description: string
  badge?: string
  offers: RetailerOffer[]
  history: HistoryPoint[]
}

export interface WatchItem {
  productId: string
  targetPrice: number
  notifications: boolean
  addedAt: string
}

export type Page = 'home' | 'compare' | 'watchlist' | 'deals' | 'pricing'

import { useEffect, useState } from 'react'
import { products, sortedOffers } from './data'
import type { WatchItem } from './types'

const STORAGE_KEY = 'buywise-watchlist-v1'

const safeRead = (): WatchItem[] => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export function useBuyWise() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>(safeRead)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (productId: string) => {
    setWatchlist((current) => {
      if (current.some((item) => item.productId === productId)) return current
      const product = products.find((item) => item.id === productId)!
      const bestPrice = sortedOffers(product)[0].price
      return [...current, { productId, targetPrice: Math.max(1, Math.floor(bestPrice * 0.92)), notifications: true, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromWatchlist = (productId: string) => setWatchlist((current) => current.filter((item) => item.productId !== productId))

  const updateTarget = (productId: string, targetPrice: number) => setWatchlist((current) => current.map((item) => item.productId === productId ? { ...item, targetPrice } : item))

  const toggleNotifications = (productId: string) => setWatchlist((current) => current.map((item) => item.productId === productId ? { ...item, notifications: !item.notifications } : item))

  return { watchlist, addToWatchlist, removeFromWatchlist, updateTarget, toggleNotifications }
}

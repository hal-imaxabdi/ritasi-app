'use client'
import { useEffect } from 'react'
import { syncQueue, getQueue } from '@/lib/offlineQueue'

export default function SyncOnline() {
  useEffect(() => {
    async function handleOnline() {
      const queue = getQueue()
      if (queue.length > 0) {
        await syncQueue()
        alert(`✅ ${queue.length} data offline berhasil disinkronkan!`)
      }
    }

    window.addEventListener('online', handleOnline)
    // Also try to sync on first load if online
    if (navigator.onLine) handleOnline()

    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return null
}
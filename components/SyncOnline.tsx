'use client'
import { useEffect } from 'react'
import { syncQueue, getQueue } from '@/lib/offlineQueue'

export default function SyncOnline() {
  useEffect(() => {
    async function handleOnline() {
      const queue = getQueue()
      if (queue.length > 0) {
        await syncQueue()
      }
    }

    window.addEventListener('online', handleOnline)
    if (navigator.onLine) handleOnline()

    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return null
}

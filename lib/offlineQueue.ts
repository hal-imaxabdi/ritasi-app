export type QueuedAction = {
  id: string
  type: 'create_trip' | 'complete_trip'
  payload: Record<string, unknown>
  timestamp: number
}

const QUEUE_KEY = 'ritasi_offline_queue'

export function addToQueue(action: Omit<QueuedAction, 'id' | 'timestamp'>) {
  const queue = getQueue()
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getQueue(): QueuedAction[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(QUEUE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function removeFromQueue(id: string) {
  const queue = getQueue().filter(item => item.id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export async function syncQueue() {
  const { supabase } = await import('./supabase')
  const queue = getQueue()
  for (const action of queue) {
    try {
      if (action.type === 'create_trip') {
        await supabase.from('trips').insert(action.payload)
      } else if (action.type === 'complete_trip') {
        const { tripId, ...updates } = action.payload as { tripId: string } & Record<string, unknown>
        await supabase.from('trips').update(updates).eq('id', tripId)
      }
      removeFromQueue(action.id)
    } catch {
      // keep in queue
    }
  }
}
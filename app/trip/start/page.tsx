'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { addToQueue } from '@/lib/offlineQueue'

export default function StartTrip() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    vehicle_number: '',
    excavation_date: new Date().toISOString().split('T')[0],
    excavation_location: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({ ...form, status: 'in_transit' })
        .select()
        .single()

      if (error) throw error
      router.push(`/trip/${data.id}/finish`)
    } catch {
      const tempId = crypto.randomUUID()
      addToQueue({ type: 'create_trip', payload: { id: tempId, ...form, status: 'in_transit' } })
      alert('Offline: Data tersimpan lokal. Akan dikirim saat online kembali.')
      router.push(`/trip/${tempId}/finish?offline=true`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-6">📋 Mulai Perjalanan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">No. Polisi Kendaraan</label>
            <input required className="mt-1 w-full border rounded-xl px-4 py-3 text-lg uppercase"
              value={form.vehicle_number}
              onChange={e => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })}
              placeholder="B 1234 XYZ" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input required type="date" className="mt-1 w-full border rounded-xl px-4 py-3"
              value={form.excavation_date}
              onChange={e => setForm({ ...form, excavation_date: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi Galian</label>
            <input required className="mt-1 w-full border rounded-xl px-4 py-3"
              value={form.excavation_location}
              onChange={e => setForm({ ...form, excavation_location: e.target.value })}
              placeholder="Jl. Contoh No. 1, Jakarta" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Mulai Perjalanan →'}
          </button>
        </form>
      </div>
    </main>
  )
}
'use client'
import { useState, useRef } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { addToQueue } from '@/lib/offlineQueue'

export default function FinishTrip() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const isOffline = searchParams.get('offline') === 'true'

  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    project_name: '',
    destination_location: '',
  })

  function handlePhotoCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function captureGPS() {
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsLoading(false)
      },
      () => {
        alert('Tidak bisa mendapat lokasi GPS. Pastikan izin lokasi aktif.')
        setGpsLoading(false)
      }
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) return alert('Foto bukti bongkar wajib diisi!')
    if (!gps) return alert('GPS wajib diambil terlebih dahulu!')
    setLoading(true)

    try {
      const fileName = `${id}-${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('trip-photos')
        .upload(fileName, photo)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('trip-photos')
        .getPublicUrl(fileName)

      const updates = {
        ...form,
        unload_time: new Date().toISOString(),
        photo_url: urlData.publicUrl,
        gps_lat: gps.lat,
        gps_lng: gps.lng,
        status: 'completed',
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('trips').update(updates).eq('id', id)
      if (error) throw error

      alert('✅ Perjalanan selesai dicatat!')
      router.push('/')
    } catch {
      addToQueue({ type: 'complete_trip', payload: { tripId: id, ...form, status: 'completed' } })
      alert('Offline: Data tersimpan lokal.')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2">📦 Selesai Bongkar</h1>
        {isOffline && (
          <div className="bg-yellow-100 text-yellow-800 text-sm rounded-xl p-3 mb-4">
            ⚠️ Mode offline aktif
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Proyek</label>
            <input required className="mt-1 w-full border rounded-xl px-4 py-3"
              value={form.project_name}
              onChange={e => setForm({ ...form, project_name: e.target.value })}
              placeholder="Proyek Gedung ABC" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi Tujuan (Urugan)</label>
            <input required className="mt-1 w-full border rounded-xl px-4 py-3"
              value={form.destination_location}
              onChange={e => setForm({ ...form, destination_location: e.target.value })}
              placeholder="Jl. Tujuan No. 2" />
          </div>
          <button type="button" onClick={captureGPS} disabled={gpsLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
            {gpsLoading ? '📡 Mengambil GPS...' : gps
              ? `✅ GPS: ${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`
              : '📍 Ambil Lokasi GPS'}
          </button>
          <div>
            <input type="file" accept="image/*" capture="environment"
              ref={fileInputRef} className="hidden" onChange={handlePhotoCapture} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
              📷 {photo ? 'Ganti Foto Bukti' : 'Ambil Foto Bukti Bongkar'}
            </button>
            {photoPreview && (
              <img src={photoPreview} alt="preview"
                className="mt-2 rounded-xl w-full object-cover max-h-48" />
            )}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50">
            {loading ? 'Menyimpan...' : '✅ Konfirmasi Selesai'}
          </button>
        </form>
      </div>
    </main>
  )
}
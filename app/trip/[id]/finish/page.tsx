'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { addToQueue } from '@/lib/offlineQueue'
import { translations, Lang } from '@/lib/i18n'

export default function FinishTrip() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const [lang, setLang] = useState<Lang>('id')
  const [mounted, setMounted] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ project_name: '', destination_location: '' })

  useEffect(() => {
    setMounted(true)
    setIsOffline(searchParams.get('offline') === 'true')
    const l = searchParams.get('lang') as Lang
    if (l === 'en' || l === 'id') {
      setLang(l)
    } else {
      const saved = localStorage.getItem('ritasi_lang') as Lang
      if (saved === 'en' || saved === 'id') setLang(saved)
    }
  }, [searchParams])

  function toggleLang(l: Lang) {
    setLang(l)
    localStorage.setItem('ritasi_lang', l)
  }

  const t = translations[lang]

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
        alert(lang === 'id'
          ? 'Tidak bisa mendapat lokasi GPS. Pastikan izin lokasi aktif.'
          : 'Cannot get GPS location. Please ensure location permission is enabled.')
        setGpsLoading(false)
      }
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!photo) return alert(lang === 'id' ? 'Foto bukti wajib diisi!' : 'Proof photo is required!')
    if (!gps) return alert(lang === 'id' ? 'GPS wajib diambil terlebih dahulu!' : 'GPS location must be captured first!')
    setLoading(true)

    try {
      const fileName = `${id}-${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('trip-photos')
        .upload(fileName, photo)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('trip-photos').getPublicUrl(fileName)

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

      alert(lang === 'id' ? '✅ Perjalanan selesai dicatat!' : '✅ Trip successfully recorded!')
      router.push('/')
    } catch {
      addToQueue({ type: 'complete_trip', payload: { tripId: id, ...form, status: 'completed' } })
      alert(lang === 'id' ? 'Offline: Data tersimpan lokal.' : 'Offline: Data saved locally.')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = photo && gps && form.project_name && form.destination_location

  return (
    <div className="page" suppressHydrationWarning>
      <nav className="topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>←</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
              🚛 {mounted ? t.appName : 'Ritasi'}
            </span>
          </Link>
        </div>
        <div className="lang-toggle" style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          <button className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => toggleLang('id')}>ID</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => toggleLang('en')}>EN</button>
        </div>
      </nav>

      <div className="mobile-container" style={{ paddingTop: 28, visibility: mounted ? 'visible' : 'hidden' }}>
        <div className="animate-fade-up-1" style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--accent-glow)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 99, padding: '4px 12px', marginBottom: 14
          }}>
            <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }}></div>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
              {t.finishTripSubtitle}
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>
            {t.finishTripTitle}
          </h1>
          {isOffline && (
            <div style={{
              marginTop: 12, background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 13, color: 'var(--amber)'
            }}>
              {t.offlineNotice}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card animate-fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">{t.projectName}</label>
              <input
                required
                className="input"
                value={form.project_name}
                onChange={e => setForm({ ...form, project_name: e.target.value })}
                placeholder={t.projectPlaceholder}
              />
            </div>
            <div>
              <label className="label">{t.destinationLocation}</label>
              <input
                required
                className="input"
                value={form.destination_location}
                onChange={e => setForm({ ...form, destination_location: e.target.value })}
                placeholder={t.destinationPlaceholder}
              />
            </div>
          </div>

          <div className="card animate-fade-up-3">
            <label className="label">📍 GPS</label>
            <button type="button" onClick={captureGPS} disabled={gpsLoading}
              className="btn btn-secondary" style={{ marginTop: 4 }}>
              {gpsLoading
                ? t.capturingGPS
                : gps
                  ? `${t.gpsOk} — ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`
                  : t.captureGPS}
            </button>
            {gps && (
              <div className="gps-box" style={{ marginTop: 10 }}>
                lat: {gps.lat.toFixed(6)}<br />
                lng: {gps.lng.toFixed(6)}
              </div>
            )}
          </div>

          <div className="card animate-fade-up-3">
            <label className="label">📷 {lang === 'id' ? 'Foto Bukti' : 'Proof Photo'}</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoCapture}
            />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary" style={{ marginTop: 4 }}>
              {photo ? `✅ ${t.changePhoto}` : t.takePhoto}
            </button>
            {photoPreview && (
              <img src={photoPreview} alt="preview" className="photo-preview" />
            )}
          </div>

          <div className="animate-fade-up-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !canSubmit}
              style={{ opacity: canSubmit ? 1 : 0.4 }}
            >
              {loading
                ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> {t.saving}</>
                : t.confirmComplete}
            </button>
            {!canSubmit && (
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
                {lang === 'id'
                  ? 'Lengkapi semua field, GPS, dan foto untuk melanjutkan'
                  : 'Complete all fields, GPS and photo to continue'}
              </p>
            )}
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

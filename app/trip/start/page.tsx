'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { addToQueue } from '@/lib/offlineQueue'
import { translations, Lang } from '@/lib/i18n'

export default function StartTrip() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>('id')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    vehicle_number: '',
    excavation_date: '',
    excavation_location: '',
  })

  useEffect(() => {
    setMounted(true)
    // Set today's date only on client to avoid SSR mismatch
    setForm(f => ({ ...f, excavation_date: new Date().toISOString().split('T')[0] }))
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
      router.push(`/trip/${data.id}/finish?lang=${lang}`)
    } catch {
      const tempId = crypto.randomUUID()
      addToQueue({ type: 'create_trip', payload: { id: tempId, ...form, status: 'in_transit' } })
      alert(lang === 'id'
        ? 'Offline: Data tersimpan lokal. Akan dikirim saat online kembali.'
        : 'Offline: Data saved locally. Will sync when back online.')
      router.push(`/trip/${tempId}/finish?offline=true&lang=${lang}`)
    } finally {
      setLoading(false)
    }
  }

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
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 99, padding: '4px 12px', marginBottom: 14
          }}>
            <div style={{ width: 8, height: 8, background: 'var(--amber)', borderRadius: '50%' }}></div>
            <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>
              {t.startTripSubtitle}
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>
            {t.startTripTitle}
          </h1>
        </div>

        <div className="card animate-fade-up-2">
          <form onSubmit={handleSubmit} className="field-group">
            <div>
              <label className="label">{t.vehicleNumber}</label>
              <input
                required
                className="input"
                style={{ textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em', fontSize: 16, fontWeight: 600 }}
                value={form.vehicle_number}
                onChange={e => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })}
                placeholder={t.vehiclePlaceholder}
              />
            </div>

            <div>
              <label className="label">{t.date}</label>
              <input
                required
                type="date"
                className="input"
                value={form.excavation_date}
                onChange={e => setForm({ ...form, excavation_date: e.target.value })}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="label">{t.excavationLocation}</label>
              <input
                required
                className="input"
                value={form.excavation_location}
                onChange={e => setForm({ ...form, excavation_location: e.target.value })}
                placeholder={t.excavationPlaceholder}
              />
            </div>

            <div style={{ paddingTop: 4 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 14 }}>⟳</span> {t.saving}</>
                ) : t.startTripBtn}
              </button>
            </div>
          </form>
        </div>

        <div className="animate-fade-up-3" style={{ marginTop: 16 }}>
          <div style={{
            background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13, color: 'var(--amber)',
            lineHeight: 1.5
          }}>
            ℹ️ {lang === 'id'
              ? 'Data ini menggantikan Slip Pink (Bon Tanah). Perjalanan akan berlanjut ke fase pembongkaran.'
              : 'This data replaces the Pink Slip (Bon Tanah). Trip will continue to the unloading phase.'}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

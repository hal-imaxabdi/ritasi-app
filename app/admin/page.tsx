'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { translations, Lang } from '@/lib/i18n'

type Trip = {
  id: string
  vehicle_number: string
  excavation_date: string
  excavation_location: string
  project_name: string | null
  destination_location: string | null
  unload_time: string | null
  photo_url: string | null
  gps_lat: number | null
  gps_lng: number | null
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [lang, setLang] = useState<Lang>('id')
  const [mounted, setMounted] = useState(false)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'completed'>('all')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('ritasi_lang') as Lang
    if (saved === 'en' || saved === 'id') setLang(saved)
    fetchTrips()
  }, [])

  function toggleLang(l: Lang) {
    setLang(l)
    localStorage.setItem('ritasi_lang', l)
  }

  const t = translations[lang]

  async function fetchTrips() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      setTrips(data || [])
    } catch {
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = trips.filter(trip => {
    const matchFilter = filter === 'all' || trip.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      trip.vehicle_number?.toLowerCase().includes(q) ||
      trip.project_name?.toLowerCase().includes(q) ||
      trip.excavation_location?.toLowerCase().includes(q) ||
      trip.destination_location?.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const stats = {
    total: trips.length,
    transit: trips.filter(t => t.status === 'in_transit').length,
    done: trips.filter(t => t.status === 'completed').length,
  }

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>←</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>🚛 {t.appName}</span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => toggleLang('id')}>ID</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => toggleLang('en')}>EN</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div className="animate-fade-up-1" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div className="dot-live"></div>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{t.adminTitle}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{t.adminSubtitle}</p>
          </div>
          <button onClick={fetchTrips} className="btn btn-ghost"
            style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
            ↻ {t.refresh}
          </button>
        </div>

        <div className="animate-fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <div className="stat-card">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">{t.totalTrips}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value" style={{ color: 'var(--amber)' }}>{stats.transit}</span>
            <span className="stat-card-label">{t.inTransit}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value" style={{ color: 'var(--accent)' }}>{stats.done}</span>
            <span className="stat-card-label">{t.completed}</span>
          </div>
        </div>

        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="input"
            style={{ flex: 1, minWidth: 200, maxWidth: 360 }}
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'in_transit', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid',
                  borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                  background: filter === f ? 'var(--accent-glow)' : 'transparent',
                  color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {f === 'all' ? t.filterAll : f === 'in_transit' ? t.filterTransit : t.filterCompleted}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-up-4 card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 24, marginBottom: 12 }}>⟳</div>
              <p>{t.loading}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ fontSize: 15 }}>{t.noData}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.colVehicle}</th>
                    <th>{t.colDate}</th>
                    <th>{t.colExcavation}</th>
                    <th>{t.colProject}</th>
                    <th>{t.colDump}</th>
                    <th>{t.colUnload}</th>
                    <th>{t.colStatus}</th>
                    <th>{t.colPhoto}</th>
                    <th>{t.colGPS}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(trip => (
                    <tr key={trip.id}>
                      <td>
                        <span style={{
                          fontFamily: "'DM Mono', monospace", fontWeight: 600,
                          fontSize: 13, color: 'var(--text)',
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          padding: '2px 8px', borderRadius: 4
                        }}>
                          {trip.vehicle_number}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {trip.excavation_date}
                      </td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.excavation_location}
                      </td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: trip.project_name ? 'var(--text)' : 'var(--text-dim)' }}>
                        {trip.project_name || '—'}
                      </td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: trip.destination_location ? 'var(--text)' : 'var(--text-dim)' }}>
                        {trip.destination_location || '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {trip.unload_time
                          ? new Date(trip.unload_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                      </td>
                      <td>
                        <span className={`badge ${trip.status === 'completed' ? 'badge-done' : 'badge-transit'}`}>
                          {trip.status === 'completed' ? t.statusDone : t.statusTransit}
                        </span>
                      </td>
                      <td>
                        {trip.photo_url
                          ? <a href={trip.photo_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                            {t.viewPhoto} ↗
                          </a>
                          : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                      </td>
                      <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
                        {trip.gps_lat
                          ? `${trip.gps_lat.toFixed(3)}, ${trip.gps_lng?.toFixed(3)}`
                          : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {filtered.length} {lang === 'id' ? 'perjalanan ditampilkan' : 'trips shown'}
              </span>
              <Link href={`/?lang=${lang}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                + {lang === 'id' ? 'Tambah Perjalanan' : 'Add Trip'}
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

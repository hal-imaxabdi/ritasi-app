'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { translations, Lang } from '@/lib/i18n'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [lang, setLang] = useState<Lang>('id')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ total: 0, transit: 0, done: 0, today: 0 })

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('ritasi_lang') as Lang
    if (saved === 'en' || saved === 'id') setLang(saved)
    fetchStats()
  }, [])

  function toggleLang(l: Lang) {
    setLang(l)
    localStorage.setItem('ritasi_lang', l)
  }

  async function fetchStats() {
    try {
      const { data } = await supabase.from('trips').select('status, created_at')
      if (!data) return
      const today = new Date().toDateString()
      setStats({
        total: data.length,
        transit: data.filter(d => d.status === 'in_transit').length,
        done: data.filter(d => d.status === 'completed').length,
        today: data.filter(d => new Date(d.created_at).toDateString() === today).length,
      })
    } catch {
      // offline
    }
  }

  const t = translations[lang]

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚛</div>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--accent)',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16
          }}>🚛</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>
            {t.appName}
          </span>
        </div>
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => toggleLang('id')}>ID</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => toggleLang('en')}>EN</button>
        </div>
      </nav>

      <div className="mobile-container" style={{ paddingTop: 32 }}>
        <div className="animate-fade-up-1" style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
            v1.0 — MVP
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: 10 }}>
            {t.appTagline}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
            {t.appDesc}
          </p>
        </div>

        <div className="animate-fade-up-2" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, marginBottom: 28
        }}>
          <div className="stat-card">
            <span className="stat-card-value" style={{ color: 'var(--text)' }}>{stats.total}</span>
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
          <div className="stat-card">
            <span className="stat-card-value" style={{ color: 'var(--blue)' }}>{stats.today}</span>
            <span className="stat-card-label">{t.today}</span>
          </div>
        </div>

        <div className="animate-fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href={`/trip/start?lang=${lang}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'all 0.18s',
            }}>
              <div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>📋</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1117' }}>{t.startTrip}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 2 }}>
                  {lang === 'id' ? 'Slip Pink → Slip Hijau' : 'Pink Slip → Green Slip'}
                </div>
              </div>
              <span style={{ fontSize: 24, color: '#0f1117', opacity: 0.6 }}>→</span>
            </div>
          </Link>

          <Link href={`/admin?lang=${lang}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'all 0.18s',
            }}>
              <div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>📊</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{t.adminDashboard}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {lang === 'id' ? 'Monitor semua perjalanan' : 'Monitor all trips'}
                </div>
              </div>
              <span style={{ fontSize: 24, color: 'var(--text-muted)' }}>→</span>
            </div>
          </Link>
        </div>

        <div className="animate-fade-up-4" style={{ marginTop: 32 }}>
          <div className="card">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
              {lang === 'id' ? 'Alur Kerja' : 'Workflow'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: '🚜', label: lang === 'id' ? 'Galian' : 'Excavate' },
                { icon: '→', label: '' },
                { icon: '📋', label: lang === 'id' ? 'Catat' : 'Record' },
                { icon: '→', label: '' },
                { icon: '🚛', label: lang === 'id' ? 'Kirim' : 'Transport' },
                { icon: '→', label: '' },
                { icon: '📸', label: lang === 'id' ? 'Verifikasi' : 'Verify' },
                { icon: '→', label: '' },
                { icon: '✅', label: lang === 'id' ? 'Selesai' : 'Done' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: step.icon === '→' ? 16 : 22, color: step.icon === '→' ? 'var(--text-dim)' : 'inherit' }}>
                    {step.icon}
                  </span>
                  {step.label && (
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{step.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            {lang === 'id'
              ? '🔒 Data tersimpan aman di Supabase • PWA dengan dukungan offline'
              : '🔒 Data securely stored in Supabase • PWA with offline support'}
          </p>
        </div>
      </div>
    </div>
  )
}

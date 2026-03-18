'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUserStore()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.password) return
    setLoading(true); setError('')
    try {
      await login(form.username, form.password)
      router.push('/')
    } catch {
      setError('Credenziali non valide. Riprova.')
    } finally { setLoading(false) }
  }

  const inputClass = `w-full bg-white/5 px-4 py-3 text-sm text-txt placeholder:text-txt/40 focus:outline-none rounded-lg`

  const labelClass = (name: string) => `font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${
    focused === name ? 'text-myP' : 'text-txt/70'
  }`

  const wrapClass = (name: string) => `relative border rounded-lg transition-all duration-200 ${
    focused === name
      ? 'border-myP/60 shadow-[0_0_0_3px_rgba(0,175,107,0.08)]'
      : 'border-white/20'
  }`

  const indicator = (name: string) => (
    <div className={`absolute bottom-0 left-4 right-4 h-px bg-myP transition-all duration-300 ${
      focused === name ? 'opacity-100' : 'opacity-0'
    }`} />
  )

  return (
    <div className="min-h-screen flex" style={{ marginTop: '-7rem', marginBottom: '0rem', paddingBottom: '0rem' }}>

      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=85"
          alt="Natura"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-[#00484c]/60" />

        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-myP/60" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-myP/60" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-myP/60" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-myP/60" />

        <div className="absolute bottom-12 left-12 right-12">
          <div className="border border-myP/30 bg-black/50 backdrop-blur-sm p-5 rounded-sm"
            style={{ boxShadow: '0 0 40px rgba(0,175,107,0.08)' }}>
            <p className="font-mono text-[10px] text-myP/80 tracking-[0.3em] uppercase mb-2">
              Specimen No. 00001 — Animalia
            </p>
            <h2 className="text-2xl font-bold text-txt leading-tight mb-1">
              Esplora il regno animale
            </h2>
            <p className="text-sm text-txt/70 leading-relaxed font-mono">
              Dalle specie ai regni,<br />
              ogni essere vivente ha la sua storia.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {['Regno', 'Phylum', 'Classe', 'Ordine', 'Specie'].map((t, i) => (
                <span key={t} className="font-mono text-[10px] text-myP/60 tracking-wider">
                  {t}{i < 4 ? <span className="text-white/30 ml-3">›</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
          <p className="font-mono text-[11px] text-myP/50 tracking-[0.5em] uppercase">Browse your relatives</p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-bg relative overflow-hidden">

        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#00af6b 1px, transparent 1px), linear-gradient(90deg, #00af6b 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-myP/40 to-transparent" />

        <div className="relative w-full max-w-sm mx-auto space-y-8">

          {/* Logo + heading */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" width={75} height={40} className="logo-shadow" />
              <div className="flex flex-col leading-none">
                <span className="title text-base text-txt text-shadow">Browse</span>
                <span className="text-[9px] text-txt/60 tracking-[0.25em] uppercase">our relatives</span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-myP/80 tracking-[0.3em] uppercase mb-2">
                — Accesso ricercatori
              </p>
              <h1 className="text-3xl font-bold text-txt leading-tight">
                Bentornato<br />
                <span className="text-myP">nel catalogo.</span>
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className={labelClass('username')}>Username</label>
              <div className={wrapClass('username')}>
                <input
                  type="email" required autoComplete="email"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  className={inputClass}
                  placeholder="nome@esempio.com"
                />
                {indicator('username')}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={labelClass('password')}>Password</label>
                <button type="button" className="font-mono text-[10px] text-myP/70 hover:text-myP transition-colors tracking-wider">
                  Password dimenticata?
                </button>
              </div>
              <div className={wrapClass('password')}>
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className={`${inputClass} pr-11`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt/50 hover:text-txt transition-colors p-1">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {indicator('password')}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !form.username || !form.password}
              className="group w-full flex items-center justify-center gap-2 py-3 bg-myP text-black font-semibold rounded-lg hover:bg-[#02C77C] transition-all shadow-xs hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Accedi al catalogo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="pt-2 border-t border-white/15">
            <p className="text-sm text-txt/60 text-center">
              Nuovo ricercatore?{' '}
              <button onClick={() => router.push('/register')}
                className="text-myP hover:text-[#02C77C] font-medium transition-colors">
                Crea un account
              </button>
            </p>
          </div>

          <p className="font-mono text-[9px] text-txt/40 text-center tracking-[0.2em] uppercase">
            Reg. Animalia · Ver. 2.0 · Accesso sicuro
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react'

const PASSWORD_RULES = [
  { label: 'Almeno 6 caratteri', test: (v: string) => v.length >= 6 },
  { label: 'Una lettera maiuscola', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Un numero', test: (v: string) => /[0-9]/.test(v) },
]

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useUserStore()
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [pwFocused, setPwFocused] = useState(false)

  const passwordsMatch = form.password && form.confirm && form.password === form.confirm
  const passwordValid = PASSWORD_RULES.every(r => r.test(form.password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordValid) { setError('La password non soddisfa i requisiti.'); return }
    if (!passwordsMatch) { setError('Le password non coincidono.'); return }
    setLoading(true); setError('')
    try {
      await signUp(form.username, form.password)
      router.push('/login')
    } catch {
      setError('Registrazione fallita. Riprova.')
    } finally { setLoading(false) }
  }

  const inputClass = `w-full bg-white/5 px-4 py-3 text-sm text-txt placeholder:text-txt/40 focus:outline-none rounded-lg`
  const wrapClass = (name: string) => `relative border rounded-lg transition-all duration-200 ${
    focused === name ? 'border-myP/60 shadow-[0_0_0_3px_rgba(0,175,107,0.08)]' : 'border-white/20'
  }`
  const labelClass = (name: string) => `font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${
    focused === name ? 'text-myP' : 'text-txt/70'
  }`
  const indicator = (name: string) => (
    <div className={`absolute bottom-0 left-4 right-4 h-px bg-myP transition-all duration-300 ${focused === name ? 'opacity-100' : 'opacity-0'}`} />
  )

  return (
    <div className="min-h-screen flex" style={{ marginTop: '-7rem' }}>

      {/* ── Left panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&q=85"
          alt="Fauna"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-[#00484c]/50" />

        {/* Corner brackets */}
        {['top-8 left-8 border-t-2 border-l-2', 'top-8 right-8 border-t-2 border-r-2',
          'bottom-8 left-8 border-b-2 border-l-2', 'bottom-8 right-8 border-b-2 border-r-2'
        ].map((cls, i) => (
          <div key={i} className={`absolute w-12 h-12 border-myP/60 ${cls}`} />
        ))}

        {/* Step indicator */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 space-y-6">
          {[
            { n: '01', label: 'Crea le credenziali', active: true },
            { n: '02', label: 'Accedi al catalogo', active: false },
            { n: '03', label: 'Esplora le specie', active: false },
          ].map(({ n, label, active }) => (
            <div key={n} className={`flex items-center gap-4 transition-all ${active ? 'opacity-100' : 'opacity-40'}`}>
              <span className={`font-mono text-xs w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                active ? 'border-myP text-myP' : 'border-white/40 text-white/60'
              }`}>{n}</span>
              <span className="text-sm text-txt font-medium">{label}</span>
            </div>
          ))}
          <div className="absolute left-4 top-8 bottom-8 w-px bg-gradient-to-b from-myP/40 via-white/10 to-transparent -z-10" />
        </div>

        {/* Specimen label */}
        <div className="absolute bottom-12 left-12 right-12">
          <div className="border border-myP/30 bg-black/50 backdrop-blur-sm p-5 rounded-sm"
            style={{ boxShadow: '0 0 40px rgba(0,175,107,0.08)' }}>
            <p className="font-mono text-[10px] text-myP/80 tracking-[0.3em] uppercase mb-2">
              Nuovo ingresso — Archivio ricercatori
            </p>
            <h2 className="text-2xl font-bold text-txt leading-tight mb-1">
              Inizia il tuo viaggio
            </h2>
            <p className="text-sm text-txt/70 font-mono leading-relaxed">
              Registrati per accedere all&apos;enciclopedia<br />
              completa del regno animale.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-bg relative overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#00af6b 1px, transparent 1px), linear-gradient(90deg, #00af6b 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-myP/40 to-transparent" />

        <div className="relative w-full max-w-sm mx-auto space-y-7">

          {/* Logo + heading */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" width={40} height={40} className="logo-shadow" />
              <div className="flex flex-col leading-none">
                <span className="title text-base text-txt text-shadow">Browse</span>
                <span className="text-[9px] text-txt/60 tracking-[0.25em] uppercase">our relatives</span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-myP/80 tracking-[0.3em] uppercase mb-2">
                — Registrazione nuovo membro
              </p>
              <h1 className="text-3xl font-bold text-txt leading-tight">
                Unisciti al<br />
                <span className="text-myP">catalogo.</span>
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className={labelClass('email')}>Email</label>
              <div className={wrapClass('email')}>
                <input
                  type="email" required autoComplete="email"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className={inputClass}
                  placeholder="nome@esempio.com"
                />
                {indicator('email')}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={labelClass('password')}>Password</label>
              <div className={wrapClass('password')}>
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => { setFocused('password'); setPwFocused(true) }}
                  onBlur={() => { setFocused(null); setPwFocused(false) }}
                  className={`${inputClass} pr-11`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt/50 hover:text-txt transition-colors p-1">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {indicator('password')}
              </div>

              {/* Password rules */}
              {(pwFocused || form.password) && (
                <div className="pt-1 space-y-1">
                  {PASSWORD_RULES.map(({ label, test }) => {
                    const ok = test(form.password)
                    return (
                      <div key={label} className="flex items-center gap-2">
                        {ok
                          ? <Check className="w-3 h-3 text-myP shrink-0" />
                          : <X className="w-3 h-3 text-txt/50 shrink-0" />
                        }
                        <span className={`font-mono text-[10px] tracking-wide ${ok ? 'text-myP' : 'text-txt/60'}`}>
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className={labelClass('confirm')}>Conferma password</label>
              <div className={`relative border rounded-lg transition-all duration-200 ${
                focused === 'confirm'
                  ? form.confirm && !passwordsMatch
                    ? 'border-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
                    : 'border-myP/60 shadow-[0_0_0_3px_rgba(0,175,107,0.08)]'
                  : form.confirm && !passwordsMatch
                    ? 'border-red-500/40'
                    : passwordsMatch
                      ? 'border-myP/40'
                      : 'border-white/20'
              }`}>
                <input
                  type={showConfirm ? 'text' : 'password'} required
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  className={`${inputClass} pr-11`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt/50 hover:text-txt transition-colors p-1">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirm && (
                  <div className={`absolute bottom-0 left-4 right-4 h-px transition-all duration-300 ${
                    passwordsMatch ? 'bg-myP opacity-100' : 'bg-red-400 opacity-100'
                  }`} />
                )}
              </div>
              {form.confirm && !passwordsMatch && (
                <p className="font-mono text-[10px] text-red-400 tracking-wider">Le password non coincidono</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit"
              disabled={loading || !form.username || !passwordValid || !passwordsMatch}
              className="group w-full flex items-center justify-center gap-2 py-3 bg-myP text-black font-semibold rounded-lg hover:bg-[#02C77C] transition-all shadow-xs hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed mt-1">
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Crea il tuo profilo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="pt-2 border-t border-white/15">
            <p className="text-sm text-txt/60 text-center">
              Hai già un account?{' '}
              <button onClick={() => router.push('/login')}
                className="text-myP hover:text-[#02C77C] font-medium transition-colors">
                Accedi al catalogo
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
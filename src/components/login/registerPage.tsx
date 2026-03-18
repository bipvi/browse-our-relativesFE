'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useUserStore()
  const [me, setMe] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pwdStrong = me.password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me.username || !me.password) return
    setLoading(true)
    setError('')
    try {
      await signUp(me.username, me.password)
      router.push('/login')
    } catch {
      setError('Errore durante la registrazione. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/favicon.svg" alt="Logo" width={56} height={56} className="logo-shadow" />
          <h1 className="text-2xl font-bold text-txt text-shadow">Browse our relatives</h1>
          <p className="text-sm text-txt/50">Crea il tuo account</p>
        </div>

        {/* Card */}
        <div className={cn(
          'rounded-2xl p-8',
          'bg-white/5 backdrop-blur-md border border-myP/20',
          'shadow-[0_8px_32px_rgba(0,72,76,0.5)]'
        )}>
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt/80">Username</label>
              <input
                type="text"
                required
                value={me.username}
                onChange={e => setMe({ ...me, username: e.target.value })}
                placeholder="Scegli un username"
                className={cn(
                  'w-full rounded-xl px-4 py-2.5 text-sm',
                  'bg-white/5 border border-myP/20 text-txt placeholder:text-txt/30',
                  'focus:outline-none focus:border-myP/60 focus:ring-1 focus:ring-myP/30',
                  'transition-colors'
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt/80">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={me.password}
                  onChange={e => setMe({ ...me, password: e.target.value })}
                  placeholder="Almeno 6 caratteri"
                  className={cn(
                    'w-full rounded-xl px-4 py-2.5 pr-11 text-sm',
                    'bg-white/5 border text-txt placeholder:text-txt/30',
                    'focus:outline-none focus:ring-1 transition-colors',
                    me.password.length === 0
                      ? 'border-myP/20 focus:border-myP/60 focus:ring-myP/30'
                      : pwdStrong
                        ? 'border-myP/60 focus:border-myP focus:ring-myP/30'
                        : 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt/40 hover:text-txt/70 transition-colors"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password hint */}
              {me.password.length > 0 && (
                <div className={cn(
                  'flex items-center gap-1.5 text-xs',
                  pwdStrong ? 'text-myP' : 'text-red-400'
                )}>
                  <CheckCircle className="h-3.5 w-3.5" />
                  {pwdStrong ? 'Password valida' : 'Minimo 6 caratteri'}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !pwdStrong}
              className="w-full mt-2 bg-myP text-myS font-bold hover:bg-myP/80 rounded-xl h-11 gap-2 shadow-[0_4px_16px_rgba(0,175,107,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-myS border-t-transparent" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {loading ? 'Registrazione...' : 'Registrati'}
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-txt/50">
          Hai già un account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="cursor-pointer font-semibold text-myP hover:text-myP/70 transition-colors"
          >
            Accedi
          </span>
        </p>
      </div>
    </div>
  )
}

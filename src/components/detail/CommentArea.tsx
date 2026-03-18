'use client'
import { useState } from 'react'
import { CheckCircle, Send } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Comment {
  id: string
  contenuto: string
  user: { username: string; avatar: string; ruolo: string }
}

export default function CommentArea({
  itemId,
  commenti = [],
  onRefresh,
}: {
  itemId: string
  commenti: Comment[]
  onRefresh?: () => void
}) {
  const { token, id } = useUserStore()
  const [cont, setCont] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cont.trim()) return
    setLoading(true)
    try {
      const resp = await fetch(`${API}/commenti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contenuto: cont, user_id: id, item_id: itemId }),
      })
      if (resp.ok) {
        setStatus('success')
        setCont('')
        onRefresh?.()
      } else setStatus('error')
    } catch { setStatus('error') }
    finally {
      setLoading(false)
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div>
      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        {status === 'success' && <p className="text-xs text-myP mb-2">Commento aggiunto!</p>}
        {status === 'error' && <p className="text-xs text-red-400 mb-2">Errore. Riprova.</p>}
        <div className="flex gap-2">
          <input
            value={cont}
            onChange={e => setCont(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e as any) }}
            type="text"
            placeholder="Scrivi un commento..."
            className="flex-1 bg-white/5 border border-myP/20 rounded-xl px-4 py-2.5 text-sm text-txt placeholder:text-txt/40 focus:outline-none focus:border-myP/50 focus:ring-1 focus:ring-myP/20 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !cont.trim()}
            className="p-2.5 bg-myP/10 hover:bg-myP text-myP hover:text-myS rounded-xl transition-colors disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* List */}
      {commenti.length === 0 && (
        <p className="text-xs text-txt/30 text-center py-4">Nessun commento ancora. Sii il primo!</p>
      )}
      <div className="space-y-3">
        {commenti.map((c, i) => (
          <div key={c.id || i} className="flex gap-3 py-3 border-b border-white/5 last:border-0">
            <img
              src={c.user?.avatar || ''}
              alt={c.user?.username}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-myP/30 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-semibold text-txt">{c.user?.username}</span>
                {c.user?.ruolo === 'ADMIN' && <CheckCircle className="w-3.5 h-3.5 text-myP" />}
              </div>
              <p className="text-sm text-txt/80">{c.contenuto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

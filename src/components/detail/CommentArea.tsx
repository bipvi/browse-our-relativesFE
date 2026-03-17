'use client'
import { CheckCircle } from 'lucide-react'
import AddComment from './AddComment'

interface Comment {
  id: string
  contenuto: string
  user: { username: string; avatar: string; ruolo: string }
}

export default function CommentArea({ itemId, commenti = [] }: { itemId: string; commenti: Comment[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-myP mb-3">Commenti</h2>
      <div className="mb-5">
        <AddComment itemId={itemId} />
      </div>
      <div className="space-y-3">
        {commenti.map((c, i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-myP/10 last:border-0">
            <img
              src={c.user.avatar}
              alt={c.user.username}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-myP/30 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-semibold text-txt">{c.user.username}</span>
                {c.user.ruolo === 'ADMIN' && (
                  <CheckCircle className="w-3.5 h-3.5 text-myP" />
                )}
              </div>
              <p className="text-sm text-txt/80">{c.contenuto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { MdDone } from 'react-icons/md'
import AddComment from './AddComment'

interface Comment {
  id: string
  contenuto: string
  user: { username: string; avatar: string; ruolo: string }
}

export default function CommentArea({ itemId, commenti = [] }: { itemId: string; commenti: Comment[] }) {
  return (
    <div className="bg-transparent">
      <div className="p-2">
        <AddComment itemId={itemId} />
      </div>
      {commenti.map((c, i) => (
        <div key={i} className="flex flex-col gap-2 mx-5 py-2 border-b border-gray-700">
          <div className="flex items-center justify-start w-full gap-3">
            <img alt={c.user.username} className="w-8 h-8 ring-1 ring-txt rounded-full object-cover" src={c.user.avatar} />
            <h6 className="font-semibold text-txt">
              {c.user.username}
              {c.user.ruolo === 'ADMIN' && <MdDone className="inline ml-2" />}
            </h6>
          </div>
          <p className="self-start text-txt">{c.contenuto}</p>
        </div>
      ))}
    </div>
  )
}

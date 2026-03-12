'use client'
import { useState } from 'react'
import { Alert } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AddComment({ itemId }: { itemId: string }) {
  const { token, id } = useUserStore()
  const [cont, setCont] = useState('')
  const [isErr, setIsErr] = useState(false)
  const [load, setLoad] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const resp = await fetch(`${API}/commenti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contenuto: cont, user_id: id, item_id: itemId }),
      })
      if (resp.ok) { setLoad(true); setIsErr(false); setCont('') }
      else setIsErr(true)
    } catch { setIsErr(true) }
  }

  return (
    <>
      {isErr && <Alert color="failure" className="absolute">Errore</Alert>}
      {load && <Alert color="success" className="absolute">Commento aggiunto</Alert>}
      <input
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as any) }}
        onChange={(e) => setCont(e.target.value)}
        value={cont}
        type="text"
        placeholder="Scrivi il tuo commento"
        className="input input-bordered border-txt w-full bg-transparent placeholder:text-txt text-txt"
      />
    </>
  )
}

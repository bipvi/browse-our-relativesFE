'use client'
import { useState } from 'react'
import { Modal } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function ChangeImg({ open, close, handler }: { open: boolean; close: () => void; handler: () => void }) {
  const { token, fetchMe } = useUserStore()
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { alert("Seleziona un'immagine da caricare."); return }
    const formData = new FormData()
    formData.append('image', file)
    try {
      const resp = await fetch(`${API}/user/me/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (resp.ok) { await fetchMe(token); close() }
      else console.error('Errore caricamento:', resp.statusText)
    } catch (error) { console.error('Errore:', error) }
  }

  return (
    <Modal show={open} onClose={handler} size="sm" className="bg-myP border-2 border-bg rounded-xl">
      <Modal.Header>Cambia il tuo avatar</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex items-center justify-between">
          <input type="file" name="image" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-gray-800" />
          <button type="submit" className="btn bg-bg">Invia</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn glass text-gray-800" onClick={handler}>Chiudi</button>
      </Modal.Footer>
    </Modal>
  )
}

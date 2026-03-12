'use client'
import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function FileImg({ it }: { it: any }) {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) { alert('Seleziona un file da caricare.'); return }
    const formData = new FormData()
    formData.append('file', file)
    try {
      const resp = await fetch(`${API}/${it.tipo.toLowerCase()}`, { method: 'PATCH', body: formData })
      if (!resp.ok) throw new Error('Errore upload')
      const result = await resp.json()
      console.log('Success:', result)
    } catch (error) { console.error('Error:', error) }
  }

  return (
    <>
      <input type="file" className="file-input file-input-bordered file-input-success w-full max-w-xs"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload} className="btn bg-bg text-txt mt-2">Upload</button>
    </>
  )
}

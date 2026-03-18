'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

const field = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-txt placeholder:text-txt/30 focus:outline-none focus:border-myP/50 focus:ring-1 focus:ring-myP/20 transition-colors'
const selectField = 'w-full bg-[#01181a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-txt focus:outline-none focus:border-myP/50 transition-colors appearance-none'
const label = 'text-[10px] font-bold text-txt/35 uppercase tracking-widest mb-1.5 block'

export default function FormNew({ closeDrawer }: { closeDrawer?: () => void }) {
  const { token } = useUserStore()
  const [tipo, setTipo] = useState('')
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [storia, setStoria] = useState('')
  const [immagine, setImmagine] = useState('')
  const [nome_scientifico, setNomeScientifico] = useState('')
  const [numEsemplari, setNumEsemplari] = useState(1000)
  const [relazioni, setRelazioni] = useState<any[]>([])
  const [relazione, setRelazione] = useState<any>({})
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const handleRelationship = async () => {
    const relMap: Record<string, string> = { Phylum: 'regno', Classe: 'phylum', Ordine: 'classe', Famiglia: 'ordine', Genere: 'famiglia', Specie: 'genere' }
    const rel = relMap[tipo]
    if (!rel) return
    try {
      const resp = await fetch(`${API}/${rel}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) setRelazioni(await resp.json())
    } catch { }
  }

  useEffect(() => { if (tipo) handleRelationship() }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const relType = relazione?.tipo?.toLowerCase()
    const payload: any = { nome, descrizione, storia, img: immagine, nome_scientifico, esemplari_rimasti: numEsemplari }
    if (relType) payload[`${relType}_id`] = relazione.id
    try {
      const resp = await fetch(`${API}/${tipo.toLowerCase()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (resp.ok) { setStatus('success') } else throw new Error()
    } catch { setStatus('error') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 pt-5 space-y-4">

      {/* Tipo */}
      <div>
        <label className={label}>Tipo</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} className={selectField}>
          <option value="" disabled>Seleziona tipo...</option>
          {TIPI.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Nome */}
      <div>
        <label className={label}>{tipo ? `Nome ${tipo}` : 'Nome'}</label>
        <input
          type="text" maxLength={255} value={nome} onChange={e => setNome(e.target.value)}
          placeholder={tipo ? `Nome del ${tipo.toLowerCase()}` : "Nome dell'elemento"}
          className={field}
        />
      </div>

      {/* Specie-only fields */}
      {tipo.toLowerCase() === 'specie' && (
        <>
          <div>
            <label className={label}>Nome scientifico</label>
            <input type="text" maxLength={255} value={nome_scientifico} onChange={e => setNomeScientifico(e.target.value)}
              placeholder="Es. Homo sapiens" className={field} />
          </div>
          <div>
            <label className={label}>Esemplari rimasti</label>
            <input type="number" value={numEsemplari} onChange={e => setNumEsemplari(+e.target.value)}
              className={field} />
          </div>
        </>
      )}

      {/* Immagine */}
      <div>
        <label className={label}>Immagine (URL)</label>
        <input type="text" value={immagine} onChange={e => setImmagine(e.target.value)}
          placeholder="https://..." className={field} />
      </div>

      {/* Descrizione */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className={label} style={{ marginBottom: 0 }}>Descrizione</span>
          <span className="text-[10px] text-txt/25">{descrizione.length}/800</span>
        </div>
        <textarea maxLength={800} value={descrizione} onChange={e => setDescrizione(e.target.value)}
          placeholder="Inserisci descrizione..." rows={4}
          className={`${field} resize-none`} />
      </div>

      {/* Storia */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className={label} style={{ marginBottom: 0 }}>Storia</span>
          <span className="text-[10px] text-txt/25">{storia.length}/800</span>
        </div>
        <textarea maxLength={800} value={storia} onChange={e => setStoria(e.target.value)}
          placeholder="Inserisci storia..." rows={4}
          className={`${field} resize-none`} />
      </div>

      {/* Relazione */}
      {tipo !== 'Regno' && tipo !== '' && (
        <div>
          <label className={label}>Relazione padre</label>
          <select
            onChange={e => { const sel = relazioni.find(r => r.id === e.target.value); if (sel) setRelazione(sel) }}
            className={selectField}
          >
            <option value="">Seleziona...</option>
            {relazioni.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
          </select>
        </div>
      )}

      {/* Status */}
      {status === 'success' && (
        <div className="flex items-center gap-2 text-myP bg-myP/10 border border-myP/20 rounded-xl px-4 py-3 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Elemento aggiunto con successo
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Errore durante l&apos;aggiunta
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-2 pb-2">
        <button type="button" onClick={closeDrawer}
          className="px-4 py-2 rounded-xl text-sm text-txt/50 hover:text-txt hover:bg-white/5 transition-colors">
          Annulla
        </button>
        <button type="submit" disabled={!tipo || !nome || loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-myP text-myS text-sm font-bold hover:bg-myP/80 disabled:opacity-40 transition-colors">
          <Send className="h-3.5 w-3.5" />
          {loading ? 'Invio...' : 'Crea elemento'}
        </button>
      </div>
    </form>
  )
}

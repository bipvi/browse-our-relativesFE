'use client'
import { useEffect, useState } from 'react'
import { Alert } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [isWrong, setIsWrong] = useState(false)

  const handleRelationship = async () => {
    const relMap: Record<string, string> = { Phylum: 'regno', Classe: 'phylum', Ordine: 'classe', Famiglia: 'ordine', Genere: 'famiglia', Specie: 'genere' }
    const rel = relMap[tipo]
    if (!rel) return
    try {
      const resp = await fetch(`${API}/${rel}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) { const d = await resp.json(); setRelazioni(d) }
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (tipo) handleRelationship() }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const relType = relazione?.tipo?.toLowerCase()
    const payload: any = { nome, descrizione, storia, img: immagine, nome_scientifico, esemplari_rimasti: numEsemplari }
    if (relType) payload[`${relType}_id`] = relazione.id
    try {
      const resp = await fetch(`${API}/${tipo.toLowerCase()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (resp.ok) { setIsWrong(false); setIsLoaded(true) }
      else throw new Error()
    } catch { setIsWrong(true) }
  }

  return (
    <>
      <form className="container px-6 w-full my-3" onSubmit={handleSubmit}>
        <div className="label"><span className="label-text">Seleziona tipo</span></div>
        <select onChange={(e) => setTipo(e.target.value)} value={tipo}
          className="select-md border-gray-400 rounded-lg w-full bg-transparent mb-4">
          <option disabled value="">Seleziona tipo</option>
          {TIPI.map(t => <option key={t}>{t}</option>)}
        </select>

        <label className="form-control w-full mb-4">
          <div className="label"><span className="label-text">{tipo ? `Nome ${tipo}` : 'Nome Item'}</span></div>
          <input type="text" maxLength={255} value={nome} onChange={(e) => setNome(e.target.value)}
            placeholder={tipo ? `Scrivi qui il nome del ${tipo.toLowerCase()}` : "Scrivi qui il nome dell'item"}
            className="input input-md bg-transparent placeholder:text-gray-400 border border-gray-400" />
        </label>

        {tipo.toLowerCase() === 'specie' && (
          <>
            <label className="form-control w-full mb-4">
              <div className="label"><span className="label-text">Numero esemplari</span></div>
              <input type="number" value={numEsemplari} onChange={(e) => setNumEsemplari(+e.target.value)}
                className="input input-md bg-transparent border border-gray-400" />
            </label>
            <label className="form-control w-full mb-4">
              <div className="label"><span className="label-text">Nome scientifico</span></div>
              <input type="text" maxLength={255} value={nome_scientifico} onChange={(e) => setNomeScientifico(e.target.value)}
                className="input input-md bg-transparent placeholder:text-gray-400 border border-gray-400" />
            </label>
          </>
        )}

        <label className="form-control w-full mb-4">
          <div className="label"><span className="label-text">Immagine (URL)</span></div>
          <input type="text" value={immagine} onChange={(e) => setImmagine(e.target.value)}
            placeholder="Inserisci link immagine"
            className="input input-md bg-transparent placeholder:text-gray-400 border border-gray-400" />
        </label>

        <label className="form-control mb-4">
          <div className="label"><span className="label-text">Descrizione</span><span className="label-text-alt">max 800 caratteri</span></div>
          <textarea maxLength={800} value={descrizione} onChange={(e) => setDescrizione(e.target.value)}
            className="textarea textarea-md h-28 bg-transparent placeholder:text-gray-400 border border-gray-400"
            placeholder="Inserisci descrizione ..." />
        </label>

        <label className="form-control mb-4">
          <div className="label"><span className="label-text">Storia</span><span className="label-text-alt">max 800 caratteri</span></div>
          <textarea maxLength={800} value={storia} onChange={(e) => setStoria(e.target.value)}
            className="textarea textarea-md h-28 bg-transparent placeholder:text-gray-400 border border-gray-400"
            placeholder="Inserisci storia ..." />
        </label>

        {tipo !== 'Regno' && tipo !== '' && (
          <>
            <div className="label"><span className="label-text">Seleziona relazione</span></div>
            <select onChange={(e) => { const sel = relazioni.find(r => r.id === e.target.value); if (sel) setRelazione(sel) }}
              className="select-md border-gray-400 rounded-lg w-full bg-transparent mb-6">
              <option value="">Seleziona un'opzione</option>
              {relazioni.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
          </>
        )}

        <div className="flex justify-between items-center">
          <button type="button" className="btn btn-ghost" onClick={closeDrawer}>Annulla</button>
          <button type="submit" className="btn bg-bg hover:bg-bg hover:border hover:border-myP text-txt">Invia</button>
        </div>
      </form>
      {isLoaded && <Alert color="success">Elemento aggiunto con successo</Alert>}
      {isWrong && <Alert color="failure">Errore durante l&apos;aggiunta dell&apos;elemento</Alert>}
    </>
  )
}

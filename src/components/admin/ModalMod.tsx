'use client'
import { useEffect, useState } from 'react'
import { Modal, Alert } from 'flowbite-react'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

export default function ModalMod({ open, handleOpen, closeModal, itemPassed = null }: {
  open: boolean; handleOpen: () => void; closeModal: () => void; itemPassed?: any
}) {
  const { token } = useUserStore()
  const [tipo, setTipo] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [item, setItem] = useState<any>({})
  const [modItem, setModItem] = useState({ nome: '', desc: '', storia: '', img: '', nome_scientifico: '', numEsemplari: 1000 })
  const [relazioni, setRelazioni] = useState<any[]>([])
  const [relazione, setRelazione] = useState<any>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isWrong, setIsWrong] = useState(false)

  useEffect(() => {
    if (itemPassed) {
      setItem(itemPassed)
      setTipo(itemPassed?.tipo || '')
      setModItem({ nome: itemPassed?.nome || '', desc: itemPassed?.descrizione || '', storia: itemPassed?.storia || '', img: itemPassed?.img || '', nome_scientifico: itemPassed?.nome_scientifico || '', numEsemplari: 1000 })
    }
  }, [itemPassed])

  const handleRelationship = async () => {
    const relMap: Record<string, string> = { Phylum: 'regno', Classe: 'phylum', Ordine: 'classe', Famiglia: 'ordine', Genere: 'famiglia', Specie: 'genere' }
    const rel = relMap[tipo]
    if (!rel) return
    try {
      const [relResp, itemsResp] = await Promise.all([
        fetch(`${API}/${rel}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/${tipo.toLowerCase()}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (relResp.ok) setRelazioni(await relResp.json())
      if (itemsResp.ok) setItems(await itemsResp.json())
    } catch (e) { console.error(e) }
  }

  useEffect(() => { if (tipo) handleRelationship() }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const relType = relazione?.tipo?.toLowerCase()
    const payload: any = { nome: modItem.nome, descrizione: modItem.desc, storia: modItem.storia, img: modItem.img, nome_scientifico: modItem.nome_scientifico, esemplari_rimasti: modItem.numEsemplari }
    if (relType) payload[`${relType}_id`] = relazione.id
    try {
      const resp = await fetch(`${API}/${tipo.toLowerCase()}/${item.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (resp.ok) { setIsWrong(false); setIsLoaded(true) } else throw new Error()
    } catch { setIsWrong(true); setIsLoaded(false) }
  }

  return (
    <Modal show={open} onClose={handleOpen} size="5xl" className="bg-custom-gradient">
      <Modal.Header>Browse our relatives</Modal.Header>
      <Modal.Body className="overflow-y-auto max-h-[75vh]">
        <form className="grid grid-cols-2 gap-4 px-6 w-full" onSubmit={handleSubmit}>
          <label className="form-control w-full mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Seleziona tipo</span></div>
            <select onChange={(e) => setTipo(e.target.value)} value={tipo}
              className="select-md border-gray-400 rounded-lg w-full bg-transparent mb-4">
              <option disabled value="">Seleziona tipo</option>
              {TIPI.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label className="form-control w-full mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Item</span></div>
            <select onChange={(e) => { const sel = items.find(i => i.id === e.target.value); if (sel) { setItem(sel); setModItem({ nome: sel.nome, desc: sel.descrizione, storia: sel.storia, img: sel.img, nome_scientifico: sel.nome_scientifico || '', numEsemplari: sel.esemplari_rimasti || 1000 }) } }}
              className="select-md border-gray-400 rounded-lg w-full bg-transparent mb-4">
              <option>{items.length > 0 ? `Seleziona un ${items[0]?.tipo}` : 'Seleziona un oggetto'}</option>
              {items.map(r => <option key={r.id} value={r.id}>{r.id} - {r.nome}</option>)}
            </select>
          </label>

          <label className="form-control mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Descrizione</span><span className="label-text-alt">max 800 caratteri</span></div>
            <textarea maxLength={800} value={modItem.desc} onChange={(e) => setModItem({ ...modItem, desc: e.target.value })}
              className="textarea textarea-md h-48 bg-transparent placeholder:text-gray-400 border border-gray-400"
              placeholder="Inserisci descrizione ..." />
          </label>

          <label className="form-control mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Storia</span><span className="label-text-alt">max 800 caratteri</span></div>
            <textarea maxLength={800} value={modItem.storia} onChange={(e) => setModItem({ ...modItem, storia: e.target.value })}
              className="textarea textarea-md h-48 bg-transparent placeholder:text-gray-400 border border-gray-400"
              placeholder="Inserisci storia ..." />
          </label>

          <label className="form-control w-full mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Nome Item</span></div>
            <input type="text" value={modItem.nome} onChange={(e) => setModItem({ ...modItem, nome: e.target.value })}
              placeholder="Scrivi qui il nome dell'item"
              className="input input-md bg-transparent placeholder:text-gray-400 border border-gray-400" />
          </label>

          <label className="form-control w-full mb-4 col-span-2 md:col-span-1">
            <div className="label"><span className="label-text">Immagine Item (URL)</span></div>
            <input type="text" value={modItem.img} onChange={(e) => setModItem({ ...modItem, img: e.target.value })}
              placeholder="Inserisci link immagine"
              className="input input-md bg-transparent placeholder:text-gray-400 border border-gray-400" />
          </label>

          {tipo !== 'Regno' && tipo !== '' && (
            <label className="col-span-2">
              <div className="label"><span className="label-text">Seleziona relazione</span></div>
              <select onChange={(e) => { const sel = relazioni.find(r => r.id === e.target.value); if (sel) setRelazione(sel) }}
                className="select-md border-gray-400 rounded-lg w-full bg-transparent mb-6">
                <option value="">Seleziona un'opzione</option>
                {relazioni.map(r => <option key={r.id} value={r.id}>{r.id} - {r.nome}</option>)}
              </select>
            </label>
          )}

          <div className="col-span-2 flex justify-between items-center w-full">
            <button className="btn btn-ghost" onClick={closeModal} type="button">Annulla</button>
            <button onClick={handleSubmit} type="button" className="btn bg-bg hover:bg-bg hover:border hover:border-myP text-txt">Invia</button>
          </div>
        </form>
        {isLoaded && <Alert color="success">Elemento aggiornato con successo</Alert>}
        {isWrong && <Alert color="failure">Errore durante l&apos;aggiornamento dell&apos;elemento</Alert>}
      </Modal.Body>
    </Modal>
  )
}

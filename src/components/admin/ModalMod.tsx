'use client'
import { useEffect, useState } from 'react'
import { Dialog } from 'radix-ui'
import { X, CheckCircle, AlertCircle, Save, Plus } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

// Map: tipo figlio → tipo padre
const PARENT_MAP: Record<string, string> = {
  Phylum: 'regno', Classe: 'phylum', Ordine: 'classe',
  Famiglia: 'ordine', Genere: 'famiglia', Specie: 'genere',
}

const field = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-txt placeholder:text-txt/30 focus:outline-none focus:border-myP/50 focus:ring-1 focus:ring-myP/20 transition-colors'
const selectField = 'w-full bg-[#01181a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-txt focus:outline-none focus:border-myP/50 transition-colors appearance-none'
const lbl = 'text-[10px] font-bold text-txt/35 uppercase tracking-widest mb-1.5 block'

const emptyForm = { nome: '', desc: '', storia: '', img: '', nome_scientifico: '', numEsemplari: 1000 }

export default function ModalMod({ open, handleOpen, closeModal, itemPassed = null, mode = 'edit', defaultTipo = '', defaultParent = null }: {
  open: boolean
  handleOpen: () => void
  closeModal: () => void
  itemPassed?: any
  mode?: 'create' | 'edit'
  defaultTipo?: string
  defaultParent?: any
}) {
  const { token } = useUserStore()
  const isCreate = mode === 'create'

  const [tipo, setTipo] = useState(defaultTipo)
  const [items, setItems] = useState<any[]>([])
  const [item, setItem] = useState<any>({})
  const [modItem, setModItem] = useState(emptyForm)
  const [relazioni, setRelazioni] = useState<any[]>([])
  const [relazione, setRelazione] = useState<any>(defaultParent || {})
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  // Prefill in edit mode
  useEffect(() => {
    if (!isCreate && itemPassed) {
      setItem(itemPassed)
      setTipo(itemPassed?.tipo || '')
      setModItem({ nome: itemPassed?.nome || '', desc: itemPassed?.descrizione || '', storia: itemPassed?.storia || '', img: itemPassed?.img || '', nome_scientifico: itemPassed?.nome_scientifico || '', numEsemplari: itemPassed?.esemplari_rimasti || 1000 })
    }
  }, [itemPassed, isCreate])

  // Prefill in create mode
  useEffect(() => {
    if (isCreate) {
      setTipo(defaultTipo || '')
      setRelazione(defaultParent || {})
      setModItem(emptyForm)
      setItem({})
    }
  }, [isCreate, defaultTipo, defaultParent])

  // Fetch relazioni (parent list) and items (for edit)
  const loadData = async (tipoVal: string) => {
    const parentType = PARENT_MAP[tipoVal]
    try {
      if (parentType) {
        const r = await fetch(`${API}/${parentType}`, { headers: { Authorization: `Bearer ${token}` } })
        if (r.ok) setRelazioni(await r.json())
      } else {
        setRelazioni([])
      }
      if (!isCreate) {
        const r2 = await fetch(`${API}/${tipoVal.toLowerCase()}`, { headers: { Authorization: `Bearer ${token}` } })
        if (r2.ok) setItems(await r2.json())
      }
    } catch { }
  }

  useEffect(() => { if (tipo) loadData(tipo) }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const relType = relazione?.tipo?.toLowerCase()
    const payload: any = {
      nome: modItem.nome,
      descrizione: modItem.desc,
      storia: modItem.storia,
      img: modItem.img,
      nome_scientifico: modItem.nome_scientifico,
      esemplari_rimasti: modItem.numEsemplari,
    }
    if (relType) payload[`${relType}_id`] = relazione.id
    // In create mode se defaultParent non ha tipo (es. regno passato manualmente)
    if (!relType && relazione?.id) payload[`${PARENT_MAP[tipo]}_id`] = relazione.id

    try {
      const url = isCreate
        ? `${API}/${tipo.toLowerCase()}`
        : `${API}/${tipo.toLowerCase()}/${item.id}`
      const resp = await fetch(url, {
        method: isCreate ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (resp.ok) { setStatus('success'); if (isCreate) setModItem(emptyForm) }
      else throw new Error()
    } catch { setStatus('error') }
    finally { setLoading(false) }
  }

  const canSubmit = tipo && (isCreate ? modItem.nome.trim() : item?.id) && !loading

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleOpen() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-[95vw] max-w-3xl max-h-[90vh] flex flex-col overflow-hidden',
          'bg-[#011f22] ring-1 ring-white/8 rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.6)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        )}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                isCreate ? 'bg-myP/15' : 'bg-blue-500/15'
              )}>
                {isCreate
                  ? <Plus className="h-4 w-4 text-myP" />
                  : <Save className="h-4 w-4 text-blue-400" />
                }
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-txt">
                  {isCreate ? 'Crea nuovo elemento' : 'Modifica elemento'}
                </Dialog.Title>
                <p className="text-xs text-txt/40 mt-0.5">
                  {isCreate ? 'Aggiungi un nuovo elemento alla tassonomia' : 'Aggiorna i dati di un elemento esistente'}
                </p>
              </div>
            </div>
            <Dialog.Close className="p-2 rounded-xl bg-white/5 text-txt/40 hover:text-txt hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            {/* Tipo + (edit only) Item selectors */}
            <div className={cn('grid gap-4', isCreate ? 'grid-cols-1' : 'grid-cols-2')}>
              <div>
                <label className={lbl}>Tipo</label>
                <select
                  value={tipo}
                  onChange={e => { setTipo(e.target.value); setRelazione({}) }}
                  className={selectField}
                  disabled={isCreate && !!defaultTipo}
                >
                  <option value="" disabled>Seleziona tipo...</option>
                  {TIPI.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {!isCreate && (
                <div>
                  <label className={lbl}>Elemento da modificare</label>
                  <select
                    onChange={e => {
                      const sel = items.find(i => i.id === e.target.value)
                      if (sel) { setItem(sel); setModItem({ nome: sel.nome, desc: sel.descrizione || '', storia: sel.storia || '', img: sel.img || '', nome_scientifico: sel.nome_scientifico || '', numEsemplari: sel.esemplari_rimasti || 1000 }) }
                    }}
                    className={selectField}
                  >
                    <option value="">{items.length > 0 ? `Seleziona ${tipo.toLowerCase()}...` : 'Prima seleziona il tipo'}</option>
                    {items.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="h-px bg-white/5" />

            {/* Nome + Nome scientifico */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Nome</label>
                <input type="text" value={modItem.nome} onChange={e => setModItem({ ...modItem, nome: e.target.value })}
                  placeholder="Nome elemento" className={field} />
              </div>
              <div>
                <label className={lbl}>Nome scientifico</label>
                <input type="text" value={modItem.nome_scientifico} onChange={e => setModItem({ ...modItem, nome_scientifico: e.target.value })}
                  placeholder="es. Homo sapiens" className={field} />
              </div>
            </div>

            {/* Immagine */}
            <div>
              <label className={lbl}>Immagine (URL)</label>
              <input type="text" value={modItem.img} onChange={e => setModItem({ ...modItem, img: e.target.value })}
                placeholder="https://..." className={field} />
            </div>

            {/* Descrizione + Storia */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className={lbl} style={{ marginBottom: 0 }}>Descrizione</span>
                  <span className="text-[10px] text-txt/25">{modItem.desc.length}/800</span>
                </div>
                <textarea maxLength={800} value={modItem.desc} onChange={e => setModItem({ ...modItem, desc: e.target.value })}
                  placeholder="Descrizione..." rows={5} className={`${field} resize-none`} />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className={lbl} style={{ marginBottom: 0 }}>Storia</span>
                  <span className="text-[10px] text-txt/25">{modItem.storia.length}/800</span>
                </div>
                <textarea maxLength={800} value={modItem.storia} onChange={e => setModItem({ ...modItem, storia: e.target.value })}
                  placeholder="Storia..." rows={5} className={`${field} resize-none`} />
              </div>
            </div>

            {/* Relazione padre */}
            {tipo !== 'Regno' && tipo !== '' && (
              <div>
                <label className={lbl}>
                  Relazione padre ({PARENT_MAP[tipo] || '—'})
                  {defaultParent && isCreate && (
                    <span className="ml-2 text-myP normal-case font-normal">pre-selezionato: {defaultParent.nome}</span>
                  )}
                </label>
                <select
                  value={relazione?.id || ''}
                  onChange={e => { const sel = relazioni.find(r => r.id === e.target.value); if (sel) setRelazione(sel) }}
                  className={selectField}
                >
                  <option value="">Seleziona {PARENT_MAP[tipo]}...</option>
                  {relazioni.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select>
              </div>
            )}

            {/* Status messages */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-myP bg-myP/10 border border-myP/20 rounded-xl px-4 py-3 text-sm">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {isCreate ? 'Elemento creato con successo!' : 'Elemento aggiornato con successo'}
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {isCreate ? 'Errore durante la creazione' : 'Errore durante l\'aggiornamento'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-white/5 shrink-0">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm text-txt/50 hover:text-txt hover:bg-white/5 transition-colors">
              Annulla
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-40',
                isCreate
                  ? 'bg-myP text-myS hover:bg-myP/80'
                  : 'bg-blue-500/80 text-white hover:bg-blue-500'
              )}>
              {isCreate ? <Plus className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {loading ? (isCreate ? 'Creazione...' : 'Salvataggio...') : (isCreate ? 'Crea elemento' : 'Salva modifiche')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

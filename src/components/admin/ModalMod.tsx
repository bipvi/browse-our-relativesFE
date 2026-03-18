'use client'
import { useEffect, useState, useCallback } from 'react'
import { Dialog } from 'radix-ui'
import { X, CheckCircle, AlertCircle, Save, Plus, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Taxonomy order top → bottom
const TIPO_ORDER = ['regno', 'phylum', 'classe', 'ordine', 'famiglia', 'genere', 'specie']
const TIPI_DISPLAY = ['Regno', 'Phylum', 'Classe', 'Ordine', 'Famiglia', 'Genere', 'Specie']

// parent type of each tipo
const PARENT_OF: Record<string, string> = {
  phylum: 'regno', classe: 'phylum', ordine: 'classe',
  famiglia: 'ordine', genere: 'famiglia', specie: 'genere',
}

const TIPO_COLOR: Record<string, string> = {
  regno: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
  phylum: 'text-blue-300 bg-blue-500/15 border-blue-500/30',
  classe: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
  ordine: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
  famiglia: 'text-myP bg-myP/15 border-myP/30',
  genere: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  specie: 'text-orange-300 bg-orange-500/15 border-orange-500/30',
}

const inp = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-txt placeholder:text-txt/30 focus:outline-none focus:border-myP/50 focus:ring-1 focus:ring-myP/20 transition-colors'
const sel = 'w-full bg-[#01181a] border border-white/10 rounded-xl px-3 py-2 text-sm text-txt focus:outline-none focus:border-myP/50 transition-colors appearance-none'
const lbl = 'text-[9px] font-bold text-txt/35 uppercase tracking-widest mb-1 block'

type LevelState = {
  mode: 'select' | 'create'
  existing: any[]
  selectedId: string
  nome: string
  img: string
  open: boolean // accordion open
}

function emptyLevel(): LevelState {
  return { mode: 'select', existing: [], selectedId: '', nome: '', img: '', open: false }
}

// ─── Ancestor row ────────────────────────────────────────────────────────────
function AncestorRow({
  tipo, state, onChange, isLast
}: {
  tipo: string
  state: LevelState
  onChange: (patch: Partial<LevelState>) => void
  isLast: boolean
}) {
  const [filter, setFilter] = useState('')
  const filtered = state.existing.filter(e => e.nome?.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className={cn('rounded-xl border transition-all', state.open ? 'border-myP/30 bg-myP/5' : 'border-white/8 bg-white/3')}>
      {/* header */}
      <button
        type="button"
        onClick={() => onChange({ open: !state.open })}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', TIPO_COLOR[tipo] ?? 'text-txt/50 border-white/10')}>
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </span>
          {state.mode === 'select' && state.selectedId && (
            <span className="text-xs text-txt/60 truncate max-w-[140px]">
              {state.existing.find(e => e.id === state.selectedId)?.nome || state.selectedId}
            </span>
          )}
          {state.mode === 'create' && state.nome && (
            <span className="text-xs text-myP truncate max-w-[140px]">+ {state.nome}</span>
          )}
          {!state.selectedId && !state.nome && (
            <span className="text-xs text-txt/30 italic">non impostato</span>
          )}
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-txt/40 transition-transform', state.open && 'rotate-180')} />
      </button>

      {/* body */}
      {state.open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {/* toggle */}
          <div className="flex gap-1 p-1 bg-black/20 rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ mode: 'select', nome: '', img: '' })}
              className={cn('flex-1 py-1.5 rounded-md text-xs font-semibold transition-all', state.mode === 'select' ? 'bg-myP text-myS' : 'text-txt/50 hover:text-txt')}
            >
              Seleziona esistente
            </button>
            <button
              type="button"
              onClick={() => onChange({ mode: 'create', selectedId: '' })}
              className={cn('flex-1 py-1.5 rounded-md text-xs font-semibold transition-all', state.mode === 'create' ? 'bg-myP text-myS' : 'text-txt/50 hover:text-txt')}
            >
              <Plus className="inline h-3 w-3 mr-1" />
              Crea nuovo
            </button>
          </div>

          {state.mode === 'select' && (
            <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-txt/30" />
                <input
                  type="text"
                  placeholder={`Cerca ${tipo}...`}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className={cn(inp, 'pl-7 py-1.5 text-xs')}
                />
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {filtered.length === 0 && (
                  <p className="text-xs text-txt/30 text-center py-2">Nessun risultato</p>
                )}
                {filtered.map(e => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onChange({ selectedId: e.id })}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all',
                      state.selectedId === e.id
                        ? 'bg-myP/15 ring-1 ring-myP/40 text-txt'
                        : 'hover:bg-white/5 text-txt/70'
                    )}
                  >
                    {e.img && <img src={e.img} alt="" className="w-5 h-5 rounded object-cover shrink-0" />}
                    <span className="text-xs truncate">{e.nome}</span>
                    {state.selectedId === e.id && <CheckCircle className="h-3 w-3 text-myP ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </>
          )}

          {state.mode === 'create' && (
            <div className="space-y-2">
              <div>
                <label className={lbl}>Nome {tipo}</label>
                <input
                  type="text"
                  value={state.nome}
                  onChange={e => onChange({ nome: e.target.value })}
                  placeholder={`Nome del ${tipo}`}
                  className={cn(inp, 'text-xs py-2')}
                />
              </div>
              <div>
                <label className={lbl}>Immagine (URL)</label>
                <input
                  type="text"
                  value={state.img}
                  onChange={e => onChange({ img: e.target.value })}
                  placeholder="https://..."
                  className={cn(inp, 'text-xs py-2')}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
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

  // ── Edit state ──
  const [editTipo, setEditTipo] = useState('')
  const [editItems, setEditItems] = useState<any[]>([])
  const [editItem, setEditItem] = useState<any>({})
  const [editForm, setEditForm] = useState({ nome: '', desc: '', storia: '', img: '', nome_scientifico: '' })

  // ── Create state ──
  const [tipo, setTipo] = useState(defaultTipo)
  const [mainForm, setMainForm] = useState({ nome: '', desc: '', storia: '', img: '', nome_scientifico: '' })
  // ancestors: all levels ABOVE the chosen tipo
  const [ancestors, setAncestors] = useState<Record<string, LevelState>>({})

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  // ─── Fetch existing items for a tipo ───────────────────────────────────────
  const fetchExisting = useCallback(async (t: string) => {
    try {
      const r = await fetch(`${API}/${t.toLowerCase()}`, { headers: { Authorization: `Bearer ${token}` } })
      if (r.ok) return await r.json()
    } catch { }
    return []
  }, [token])

  // ─── Build ancestor chain when tipo changes (create mode) ──────────────────
  useEffect(() => {
    if (!isCreate || !tipo) return
    const tipoLow = tipo.toLowerCase()
    const idx = TIPO_ORDER.indexOf(tipoLow)
    if (idx <= 0) { setAncestors({}); return }

    const levels = TIPO_ORDER.slice(0, idx) // all ancestor types
    const init: Record<string, LevelState> = {}
    levels.forEach(l => { init[l] = emptyLevel() })
    setAncestors(init)

    // Fetch existing for each ancestor
    levels.forEach(async (l) => {
      const data = await fetchExisting(l)
      setAncestors(prev => ({ ...prev, [l]: { ...prev[l], existing: data } }))
    })

    // Pre-select defaultParent if provided
    if (defaultParent) {
      const parentTipo = defaultParent.tipo?.toLowerCase()
      if (parentTipo && levels.includes(parentTipo)) {
        setAncestors(prev => ({
          ...prev,
          [parentTipo]: { ...prev[parentTipo], selectedId: defaultParent.id, mode: 'select' }
        }))
      }
    }
  }, [tipo, isCreate, fetchExisting, defaultParent])

  // ─── Edit mode prefill ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCreate && itemPassed) {
      setEditTipo(itemPassed?.tipo || '')
      setEditItem(itemPassed)
      setEditForm({ nome: itemPassed?.nome || '', desc: itemPassed?.descrizione || '', storia: itemPassed?.storia || '', img: itemPassed?.img || '', nome_scientifico: itemPassed?.nome_scientifico || '' })
    }
  }, [itemPassed, isCreate])

  useEffect(() => {
    if (!isCreate && editTipo) {
      fetchExisting(editTipo).then(setEditItems)
    }
  }, [editTipo, isCreate, fetchExisting])

  // ─── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && isCreate) {
      setTipo(defaultTipo || '')
      setMainForm({ nome: '', desc: '', storia: '', img: '', nome_scientifico: '' })
      setStatus('idle')
    }
  }, [open])

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isCreate) {
        const tipoLow = tipo.toLowerCase()
        const idx = TIPO_ORDER.indexOf(tipoLow)
        let parentId: string | null = null

        // Create ancestors bottom-up (but they're top-down in array, so process in order)
        let lastCreatedByLevel: Record<string, string> = {} // tipo → id

        for (let i = 0; i < idx; i++) {
          const ancestorTipo = TIPO_ORDER[i]
          const state = ancestors[ancestorTipo]
          if (!state) continue

          if (state.mode === 'create' && state.nome) {
            // Build payload for this ancestor
            const payload: any = { nome: state.nome }
            if (state.img) payload.img = state.img
            // link to parent of this ancestor
            if (i > 0) {
              const parentTipo = TIPO_ORDER[i - 1]
              const pid = lastCreatedByLevel[parentTipo] || ancestors[parentTipo]?.selectedId
              if (pid) payload[`${parentTipo}_id`] = pid
            }
            const r = await fetch(`${API}/${ancestorTipo}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            if (r.ok) {
              const created = await r.json()
              lastCreatedByLevel[ancestorTipo] = created.id || created[ancestorTipo]?.id
            }
          } else if (state.mode === 'select' && state.selectedId) {
            lastCreatedByLevel[ancestorTipo] = state.selectedId
          }
        }

        // Get final parent id
        if (idx > 0) {
          const directParentTipo = TIPO_ORDER[idx - 1]
          parentId = lastCreatedByLevel[directParentTipo] || null
        }

        // Create the main item
        const payload: any = { nome: mainForm.nome, descrizione: mainForm.desc, storia: mainForm.storia, img: mainForm.img, nome_scientifico: mainForm.nome_scientifico }
        if (parentId && idx > 0) payload[`${TIPO_ORDER[idx - 1]}_id`] = parentId

        const r = await fetch(`${API}/${tipoLow}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (r.ok) { setStatus('success'); setMainForm({ nome: '', desc: '', storia: '', img: '', nome_scientifico: '' }) }
        else throw new Error()

      } else {
        // Edit mode
        const payload: any = { nome: editForm.nome, descrizione: editForm.desc, storia: editForm.storia, img: editForm.img, nome_scientifico: editForm.nome_scientifico }
        const r = await fetch(`${API}/${editTipo.toLowerCase()}/${editItem.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (r.ok) setStatus('success')
        else throw new Error()
      }
    } catch { setStatus('error') }
    finally { setLoading(false) }
  }

  const ancestorLevels = tipo ? TIPO_ORDER.slice(0, TIPO_ORDER.indexOf(tipo.toLowerCase())) : []
  const canSubmit = isCreate
    ? tipo && mainForm.nome.trim()
    : editTipo && editItem?.id

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleOpen() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-[480px] flex flex-col',
            'bg-[#010f11] ring-1 ring-white/8 shadow-[-32px_0_80px_rgba(0,0,0,0.6)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-300'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <div>
              <Dialog.Title className="text-base font-bold text-txt">
                {isCreate ? 'Nuovo elemento' : 'Modifica elemento'}
              </Dialog.Title>
              <p className="text-xs text-txt/40 mt-0.5">
                {isCreate ? 'Aggiungi un nuovo elemento alla tassonomia' : 'Aggiorna i dati di un elemento esistente'}
              </p>
            </div>
            <Dialog.Close className="p-2 rounded-xl bg-white/5 text-txt/40 hover:text-txt hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── TIPO selector ── */}
              <div>
                <label className={lbl}>Tipo</label>
                <select
                  value={isCreate ? tipo : editTipo}
                  onChange={e => isCreate ? setTipo(e.target.value) : setEditTipo(e.target.value)}
                  disabled={isCreate && !!defaultTipo}
                  className={sel}
                >
                  <option value="" disabled>Seleziona tipo...</option>
                  {TIPI_DISPLAY.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* ── EDIT: item selector ── */}
              {!isCreate && editTipo && (
                <div>
                  <label className={lbl}>Elemento da modificare</label>
                  <select
                    onChange={e => {
                      const found = editItems.find(i => i.id === e.target.value)
                      if (found) {
                        setEditItem(found)
                        setEditForm({ nome: found.nome || '', desc: found.descrizione || '', storia: found.storia || '', img: found.img || '', nome_scientifico: found.nome_scientifico || '' })
                      }
                    }}
                    className={sel}
                  >
                    <option value="">{editItems.length ? `Seleziona ${editTipo.toLowerCase()}...` : 'Caricamento...'}</option>
                    {editItems.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                  </select>
                </div>
              )}

              <div className="h-px bg-white/5" />

              {/* ── CREATE: ancestor chain ── */}
              {isCreate && ancestorLevels.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-txt/30 uppercase tracking-widest">
                    Gerarchia — seleziona o crea i livelli padre
                  </p>
                  {ancestorLevels.map((ancestorTipo) => (
                    <AncestorRow
                      key={ancestorTipo}
                      tipo={ancestorTipo}
                      state={ancestors[ancestorTipo] || emptyLevel()}
                      onChange={patch => setAncestors(prev => ({ ...prev, [ancestorTipo]: { ...prev[ancestorTipo], ...patch } }))}
                      isLast={ancestorTipo === ancestorLevels[ancestorLevels.length - 1]}
                    />
                  ))}
                  <div className="h-px bg-white/5" />
                </div>
              )}

              {/* ── Main item fields ── */}
              {(isCreate ? !!tipo : !!editTipo) && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>
                        Nome {isCreate ? tipo.toLowerCase() : editTipo.toLowerCase()}
                      </label>
                      <input
                        type="text"
                        value={isCreate ? mainForm.nome : editForm.nome}
                        onChange={e => isCreate ? setMainForm(f => ({ ...f, nome: e.target.value })) : setEditForm(f => ({ ...f, nome: e.target.value }))}
                        placeholder={`Nome del ${isCreate ? tipo.toLowerCase() : editTipo.toLowerCase()}`}
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Nome scientifico</label>
                      <input
                        type="text"
                        value={isCreate ? mainForm.nome_scientifico : editForm.nome_scientifico}
                        onChange={e => isCreate ? setMainForm(f => ({ ...f, nome_scientifico: e.target.value })) : setEditForm(f => ({ ...f, nome_scientifico: e.target.value }))}
                        placeholder="es. Cannabis sativa"
                        className={inp}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Immagine (URL)</label>
                    <input
                      type="text"
                      value={isCreate ? mainForm.img : editForm.img}
                      onChange={e => isCreate ? setMainForm(f => ({ ...f, img: e.target.value })) : setEditForm(f => ({ ...f, img: e.target.value }))}
                      placeholder="https://..."
                      className={inp}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={lbl} style={{ marginBottom: 0 }}>Descrizione</span>
                      <span className="text-[9px] text-txt/25">{(isCreate ? mainForm.desc : editForm.desc).length}/800</span>
                    </div>
                    <textarea
                      maxLength={800}
                      value={isCreate ? mainForm.desc : editForm.desc}
                      onChange={e => isCreate ? setMainForm(f => ({ ...f, desc: e.target.value })) : setEditForm(f => ({ ...f, desc: e.target.value }))}
                      placeholder="Inserisci descrizione..."
                      rows={3}
                      className={`${inp} resize-none`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={lbl} style={{ marginBottom: 0 }}>Storia</span>
                      <span className="text-[9px] text-txt/25">{(isCreate ? mainForm.storia : editForm.storia).length}/800</span>
                    </div>
                    <textarea
                      maxLength={800}
                      value={isCreate ? mainForm.storia : editForm.storia}
                      onChange={e => isCreate ? setMainForm(f => ({ ...f, storia: e.target.value })) : setEditForm(f => ({ ...f, storia: e.target.value }))}
                      placeholder="Inserisci storia..."
                      rows={3}
                      className={`${inp} resize-none`}
                    />
                  </div>
                </>
              )}

              {/* Status */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-myP bg-myP/10 border border-myP/20 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {isCreate ? 'Elemento creato con successo!' : 'Elemento aggiornato con successo'}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Si è verificato un errore. Riprova.
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-5 py-4 border-t border-white/5 shrink-0">
            <button type="button" onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm text-txt/50 hover:text-txt hover:bg-white/5 transition-colors">
              Annulla
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit || loading}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40',
                isCreate ? 'bg-myP text-myS hover:bg-myP/80' : 'bg-blue-500/80 text-white hover:bg-blue-500'
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

'use client'
import { useRef, useState, useEffect } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['regno', 'phylum', 'classe', 'ordine', 'famiglia', 'genere', 'specie']

const TIPO_COLOR: Record<string, string> = {
  regno:   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  phylum:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  classe:  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  ordine:  'bg-teal-500/20 text-teal-300 border-teal-500/30',
  famiglia:'bg-myP/20 text-myP border-myP/30',
  genere:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  specie:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

type Results = { nome: any[]; desc: any[]; storia: any[] }
const emptyResults = (): Results => ({ nome: [], desc: [], storia: [] })

export default function BottomQuery() {
  const router = useRouter()
  const { token } = useUserStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Results>(emptyResults())
  const [selected, setSelected] = useState({ regno: true, phylum: true, classe: true, ordine: true, famiglia: true, genere: true, specie: true })
  const [selQuery, setSelQuery] = useState({ nome: true, descrizione: true, storia: true })

  const hasResults = searchQuery.length > 1

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchQuery = async (tipo: string, campo: string, query: string) => {
    const endMap: Record<string, string> = {
      nome: `nomeQuery?nomeQuery=${query}`,
      desc: `descQuery?descQuery=${query}`,
      storia: `storiaQuery?storiaQuery=${query}`
    }
    try {
      const resp = await fetch(`${API}/${tipo}/${endMap[campo]}`, { headers: { Authorization: `Bearer ${token}` } })
      if (resp.ok) return await resp.json()
    } catch { }
    return []
  }

  const handleSearch = async () => {
    if (!searchQuery) return
    const result = emptyResults()
    for (const [tipo, active] of Object.entries(selected)) {
      if (!active) continue
      if (selQuery.nome) result.nome.push(...(await fetchQuery(tipo, 'nome', searchQuery)))
      if (selQuery.descrizione) result.desc.push(...(await fetchQuery(tipo, 'desc', searchQuery)))
      if (selQuery.storia) result.storia.push(...(await fetchQuery(tipo, 'storia', searchQuery)))
    }
    setSearchResults(result)
  }

  useEffect(() => {
    if (searchQuery.length > 1) handleSearch()
  }, [searchQuery, selected, selQuery])

  const navigate = (id: string) => { setIsOpen(false); router.push(`/${id}`) }

  const ResultItem = ({ item }: { item: any }) => {
    const t = item?.tipo?.toLowerCase()
    return (
      <div
        onClick={() => navigate(item.id)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/6 border border-transparent hover:border-myP/20 transition-all group"
      >
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-txt group-hover:text-myP transition-colors truncate leading-tight">
            {item.nome}
          </span>
          <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full border mt-0.5 ${TIPO_COLOR[t] ?? 'text-txt/40 border-white/10'}`}>
            {item.tipo}
          </span>
        </div>
        <span className="text-txt/20 group-hover:text-myP/50 transition-colors text-xs shrink-0">→</span>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isOpen ? 'bg-myP/20 text-myP' : 'text-txt/50 hover:text-txt hover:bg-white/5'}`}
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-sm rounded-2xl bg-bg/95 backdrop-blur-md border border-white/10 shadow-[0_-8px_40px_rgba(0,72,76,0.6)] z-50 overflow-hidden">

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Search className="h-4 w-4 text-txt/40 shrink-0" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Cerca..."
              className="flex-1 bg-transparent text-sm text-txt placeholder:text-txt/30 focus:outline-none"
            />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-myP/20 text-myP' : 'text-txt/40 hover:text-txt hover:bg-white/5'}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-txt/40 hover:text-txt hover:bg-white/5 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 py-3 border-b border-white/5 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-txt/30 uppercase tracking-widest mb-2">Tipo</p>
                <div className="flex flex-wrap gap-1.5">
                  {TIPI.map(tipo => {
                    const active = (selected as any)[tipo]
                    return (
                      <button
                        key={tipo}
                        onClick={() => setSelected(s => ({ ...s, [tipo]: !active }))}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize transition-all ${
                          active
                            ? TIPO_COLOR[tipo]
                            : 'bg-transparent text-txt/25 border-white/10 hover:border-white/20 hover:text-txt/40'
                        }`}
                      >
                        {tipo}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-txt/30 uppercase tracking-widest mb-2">Cerca in</p>
                <div className="flex gap-1.5">
                  {(['nome', 'descrizione', 'storia'] as const).map(campo => {
                    const active = (selQuery as any)[campo]
                    return (
                      <button
                        key={campo}
                        onClick={() => setSelQuery(s => ({ ...s, [campo]: !active }))}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize transition-all ${
                          active
                            ? 'bg-myP/20 text-myP border-myP/30'
                            : 'bg-transparent text-txt/25 border-white/10 hover:border-white/20 hover:text-txt/40'
                        }`}
                      >
                        {campo}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="max-h-80 overflow-y-auto">
              {[
                { label: 'Nome', items: searchResults.nome },
                { label: 'Descrizione', items: searchResults.desc },
                { label: 'Storia', items: searchResults.storia },
              ].map(({ label, items }) => items.length > 0 && (
                <div key={label} className="px-2 py-2">
                  <div className="flex items-center gap-2 px-2 pb-1.5">
                    <span className="text-[10px] font-bold text-txt/30 uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-bold text-myP/50 bg-myP/10 px-1.5 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item, i) => <ResultItem key={i} item={item} />)}
                  </div>
                </div>
              ))}
              {searchResults.nome.length === 0 && searchResults.desc.length === 0 && searchResults.storia.length === 0 && (
                <p className="px-4 py-5 text-sm text-txt/30 text-center">Nessun risultato trovato</p>
              )}
            </div>
          )}

          {!hasResults && !showFilters && (
            <p className="px-4 py-4 text-sm text-txt/30 text-center">Digita per cercare</p>
          )}
        </div>
      )}
    </div>
  )
}

'use client'
import { useRef, useState, useEffect } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['regno', 'phylum', 'classe', 'ordine', 'famiglia', 'genere', 'specie']
type Results = { nome: any[]; desc: any[]; storia: any[] }
const emptyResults = (): Results => ({ nome: [], desc: [], storia: [] })

export default function BottomQuery() {
  const router = useRouter()
  const { token } = useUserStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Results>(emptyResults())
  const [selected, setSelected] = useState({ regno: false, phylum: false, classe: false, ordine: false, famiglia: false, genere: false, specie: false })
  const [selQuery, setSelQuery] = useState({ nome: false, descrizione: false, storia: false })

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

  const ResultItem = ({ item }: { item: any }) => (
    <div
      onClick={() => navigate(item.id)}
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
    >
      <div className="flex flex-col items-start min-w-0">
        <span className="text-sm text-txt truncate">{item.nome}</span>
        <span className="text-xs text-txt/40">{item.tipo}</span>
      </div>
      <img src={item.img} alt={item.nome} className="w-9 h-9 rounded-full object-cover ring-1 ring-myP/30 shrink-0" />
    </div>
  )

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isOpen ? 'bg-myP/20 text-myP' : 'text-txt/50 hover:text-txt hover:bg-white/5'}`}
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm rounded-2xl bg-bg/95 backdrop-blur-md border border-white/10 shadow-[0_-8px_40px_rgba(0,72,76,0.6)] z-50 overflow-hidden">

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
            <div className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-white/5">
              <div>
                <p className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-2">Tipo</p>
                <div className="space-y-1">
                  {TIPI.map(tipo => (
                    <label key={tipo} className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-txt/70 capitalize">{tipo}</span>
                      <input type="checkbox" checked={(selected as any)[tipo]}
                        onChange={e => setSelected(s => ({ ...s, [tipo]: e.target.checked }))}
                        className="w-3.5 h-3.5 accent-myP" />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-txt/40 uppercase tracking-widest mb-2">Cerca in</p>
                <div className="space-y-1">
                  {(['nome', 'descrizione', 'storia'] as const).map(campo => (
                    <label key={campo} className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-txt/70 capitalize">{campo}</span>
                      <input type="checkbox" checked={(selQuery as any)[campo]}
                        onChange={e => setSelQuery(s => ({ ...s, [campo]: e.target.checked }))}
                        className="w-3.5 h-3.5 accent-myP" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {[
                { label: 'Nome', items: searchResults.nome },
                { label: 'Descrizione', items: searchResults.desc },
                { label: 'Storia', items: searchResults.storia },
              ].map(({ label, items }) => items.length > 0 && (
                <div key={label} className="p-2">
                  <p className="text-xs font-semibold text-txt/40 uppercase tracking-widest px-1 py-1.5">{label}</p>
                  {items.map((item, i) => <ResultItem key={i} item={item} />)}
                </div>
              ))}
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

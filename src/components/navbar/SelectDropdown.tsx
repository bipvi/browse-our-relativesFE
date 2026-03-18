'use client'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlineSearch } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const TIPI = ['regno', 'phylum', 'classe', 'ordine', 'famiglia', 'genere', 'specie']

type Results = { nome: any[]; desc: any[]; storia: any[] }
const emptyResults = (): Results => ({ nome: [], desc: [], storia: [] })

export default function SelectDropdown({ textColor }: { textColor?: string }) {
  const router = useRouter()
  const { token } = useUserStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Results>(emptyResults())
  const [selected, setSelected] = useState({ regno: false, phylum: false, classe: false, ordine: false, famiglia: false, genere: false, specie: false })
  const [selQuery, setSelQuery] = useState({ nome: false, descrizione: false, storia: false })

  const fetchQuery = async (tipo: string, campo: string, query: string) => {
    const paramMap: Record<string, string> = { nome: 'nomeQuery', desc: 'descQuery', storia: 'storiaQuery' }
    const endpointMap: Record<string, string> = { nome: 'nomeQuery', desc: 'descQuery', storia: 'storiaQuery' }
    try {
      const resp = await fetch(`${API}/${tipo}/${endpointMap[campo]}?${paramMap[campo]}=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
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

  useEffect(() => { if (searchQuery.length > 1) { setIsOpen2(true); handleSearch() } }, [searchQuery, selected, selQuery])

  const navigate = (id: string) => { setIsOpen(false); setIsOpen2(false); router.push(`/${id}`) }

  const ResultItem = ({ item }: { item: any }) => (
    <div onClick={() => navigate(item.id)} className="flex justify-between items-center hover:border gap-2 p-2 cursor-pointer">
      <div className="flex flex-col items-start">
        <span>{item.nome}</span>
        <span className="text-2xs text-gray-400">{item.tipo}</span>
      </div>
      <img src={item.img} alt={item.nome} className="w-12 h-12 rounded-full object-cover" />
    </div>
  )

  return (
    <>
      {isOpen ? (
        <div className="relative">
          <div className="absolute inset-y-0 end-2 flex items-center ps-3.5">
            <HiOutlineSearch className="text-gray-900 cursor-pointer" onClick={() => { handleSearch(); setIsOpen(false) }} />
          </div>
          <input ref={inputRef} type="text" value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value.length > 1) setIsOpen2(true) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            className="bg-transparent border border-gray-300 text-txt text-sm rounded-lg w-full pr-8 pl-2 py-1"
            placeholder="es. gatto"
          />
        </div>
      ) : (
        <p onClick={() => setIsOpen(true)} className="text-txt p-2 rounded cursor-pointer">
          <span className={`${textColor} flex h-min flex-nowrap justify-evenly hover:text-ac`}>
            Esplora {'\u00A0'}<HiOutlineSearch />
          </span>
        </p>
      )}

      {isOpen && (
        <div className={`absolute top-20 right-64 max-h-[40rem] overflow-scroll bg-bg border border-txt text-txt grid z-50 ${isOpen2 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
          {/* Filtri tipo */}
          <div className="p-2">
            {TIPI.map(tipo => (
              <label key={tipo} className="flex items-center justify-between gap-4 p-1 cursor-pointer">
                <span className="text-sm capitalize">{tipo}</span>
                <input type="checkbox" className="toggle" checked={(selected as any)[tipo]}
                  onChange={(e) => setSelected(s => ({ ...s, [tipo]: e.target.checked }))} />
              </label>
            ))}
          </div>
          {/* Filtri campo */}
          <div className="p-2">
            <div className="flex justify-end">
              <AiOutlineClose className="cursor-pointer h-4 w-4" onClick={() => { setIsOpen(false); setIsOpen2(false) }} />
            </div>
            {(['nome', 'descrizione', 'storia'] as const).map(campo => (
              <label key={campo} className="flex items-center justify-between gap-4 p-1 cursor-pointer">
                <span className="text-sm capitalize">{campo}</span>
                <input type="checkbox" className="toggle" checked={(selQuery as any)[campo]}
                  onChange={(e) => setSelQuery(s => ({ ...s, [campo]: e.target.checked }))} />
              </label>
            ))}
          </div>
          {/* Risultati */}
          {isOpen2 && (
            <div className="col-span-2 border-l border-txt overflow-scroll grid grid-cols-3">
              <div><p className="font-bold p-2">Nome</p>{searchResults.nome.map((n, i) => <ResultItem key={i} item={n} />)}</div>
              <div><p className="font-bold p-2">Descrizione</p>{searchResults.desc.map((d, i) => <ResultItem key={i} item={d} />)}</div>
              <div><p className="font-bold p-2">Storia</p>{searchResults.storia.map((s, i) => <ResultItem key={i} item={s} />)}</div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

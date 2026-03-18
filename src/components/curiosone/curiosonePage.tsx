'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, ChevronRight, AlertCircle, TreePine } from 'lucide-react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Details from '@/components/detail/Details'
import { cn } from '@/lib/utils'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Endpoint per recuperare i figli di ogni livello
const CHILDREN_ENDPOINT: Record<string, string> = {
  regno: 'getPhylums',
  phylum: 'getClassi',
  classe: 'getOrdini',
  ordine: 'getFamiglie',
  famiglia: 'getGeneri',
  genere: 'getSpecie',
}

const CHILD_LABEL: Record<string, string> = {
  regno: 'Phyla',
  phylum: 'Classi',
  classe: 'Ordini',
  ordine: 'Famiglie',
  famiglia: 'Generi',
  genere: 'Specie',
}

const TIPO_COLOR: Record<string, string> = {
  regno: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  phylum: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  classe: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  ordine: 'bg-teal-500/15 text-teal-300 border-teal-500/20',
  famiglia: 'bg-myP/15 text-myP border-myP/20',
  genere: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
  specie: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
}

// Costruisce la catena di antenati dall'oggetto annidato
function buildAncestry(item: any): any[] {
  if (!item) return []
  const tipo = item.tipo?.toLowerCase()
  const chains: Record<string, (i: any) => any[]> = {
    regno:   (i) => [i],
    phylum:  (i) => [i.regno, i],
    classe:  (i) => [i.phylum?.regno, i.phylum, i],
    ordine:  (i) => [i.classe?.phylum?.regno, i.classe?.phylum, i.classe, i],
    famiglia:(i) => [i.ordine?.classe?.phylum?.regno, i.ordine?.classe?.phylum, i.ordine?.classe, i.ordine, i],
    genere:  (i) => [i.famiglia?.ordine?.classe?.phylum?.regno, i.famiglia?.ordine?.classe?.phylum, i.famiglia?.ordine?.classe, i.famiglia?.ordine, i.famiglia, i],
    specie:  (i) => [i.genere?.famiglia?.ordine?.classe?.phylum?.regno, i.genere?.famiglia?.ordine?.classe?.phylum, i.genere?.famiglia?.ordine?.classe, i.genere?.famiglia?.ordine, i.genere?.famiglia, i.genere, i],
  }
  return (chains[tipo]?.(item) ?? []).filter(Boolean)
}

// ─── Child card ───────────────────────────────────────────────────────────────
function ChildCard({ item, onClick }: { item: any; onClick: () => void }) {
  const { favourites, addFavourite, removeFavourite } = useUserStore()
  const isFav = Array.isArray(favourites) && favourites.some(f => f?.id === item?.id)
  const [detailOpen, setDetailOpen] = useState(false)
  const tipo = item?.tipo?.toLowerCase()

  return (
    <>
      <Details open={detailOpen} handleOpen={() => setDetailOpen(v => !v)} closeModal={() => setDetailOpen(false)} item={item} />
      <div
        className={cn(
          'group rounded-2xl overflow-hidden flex flex-col cursor-pointer',
          'bg-white/5 backdrop-blur-md border border-white/8',
          'hover:border-myP/40 hover:shadow-[0_4px_24px_rgba(0,175,107,0.15)]',
          'transition-all duration-300'
        )}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-36 shrink-0">
          <img
            src={item?.img || ''}
            alt={item?.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
          <div className="absolute top-2 left-2">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm', TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20')}>
              {item?.tipo}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); isFav ? removeFavourite(item?.id) : addFavourite(item?.id) }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            {isFav ? <GoHeartFill className="w-3.5 h-3.5 text-myP" /> : <GoHeart className="w-3.5 h-3.5 text-white/70" />}
          </button>
        </div>

        {/* Content */}
        <div className="px-3 py-3 flex flex-col gap-2 flex-1">
          <h3 className="text-sm font-bold text-txt leading-tight line-clamp-1">{item?.nome}</h3>
          <p className="text-xs text-txt/45 line-clamp-2 leading-relaxed flex-1">
            {item?.descrizione || item?.storia || ''}
          </p>
          <button
            onClick={e => { e.stopPropagation(); setDetailOpen(true) }}
            className="text-xs text-myP/70 hover:text-myP transition-colors text-left"
          >
            Dettagli →
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Selected item card ───────────────────────────────────────────────────────
function SelectedCard({ item, onNavigateDown }: { item: any; onNavigateDown?: () => void }) {
  const { favourites, addFavourite, removeFavourite } = useUserStore()
  const isFav = Array.isArray(favourites) && favourites.some(f => f?.id === item?.id)
  const [detailOpen, setDetailOpen] = useState(false)
  const tipo = item?.tipo?.toLowerCase()

  return (
    <>
      <Details open={detailOpen} handleOpen={() => setDetailOpen(v => !v)} closeModal={() => setDetailOpen(false)} item={item} />
      <div className={cn(
        'rounded-2xl overflow-hidden',
        'bg-white/5 backdrop-blur-md border border-myP/20',
        'shadow-[0_8px_32px_rgba(0,72,76,0.5)]',
      )}>
        {/* Image */}
        <div className="relative h-56">
          <img src={item?.img || ''} alt={item?.nome} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md', TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20')}>
              {item?.tipo}
            </span>
          </div>
          <button
            onClick={() => isFav ? removeFavourite(item?.id) : addFavourite(item?.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            {isFav ? <GoHeartFill className="w-5 h-5 text-myP" /> : <GoHeart className="w-5 h-5 text-white/80" />}
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-2xl font-bold text-white leading-tight">{item?.nome}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-txt/60 leading-relaxed line-clamp-4">
            {item?.storia || item?.descrizione || 'Nessuna descrizione disponibile.'}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setDetailOpen(true)}
              className="flex-1 bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl h-9 text-sm"
            >
              Dettaglio completo
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CuriosonePage() {
  const router = useRouter()
  const { token, setTokenFromStorage } = useUserStore()

  const [selected, setSelected] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [ancestry, setAncestry] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [childrenLoading, setChildrenLoading] = useState(false)
  const [error, setError] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!token) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('tokenKey') : null
      if (!stored) router.push('/login')
      else setTokenFromStorage(stored)
    }
  }, [token])

  const fetchFullItem = useCallback(async (tipo: string, id: string) => {
    const resp = await fetch(`${API}/${tipo.toLowerCase()}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!resp.ok) throw new Error()
    return resp.json()
  }, [token])

  const fetchChildren = useCallback(async (item: any) => {
    const tipo = item?.tipo?.toLowerCase()
    const endpoint = CHILDREN_ENDPOINT[tipo]
    if (!endpoint) { setChildren([]); return }
    setChildrenLoading(true)
    try {
      const resp = await fetch(`${API}/${tipo}/${item.id}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setChildren(resp.ok ? await resp.json() : [])
    } catch { setChildren([]) }
    finally { setChildrenLoading(false) }
  }, [token])

  const selectItem = useCallback(async (item: any) => {
    setSelected(item)
    setAncestry(buildAncestry(item))
    await fetchChildren(item)
  }, [fetchChildren])

  const navigateTo = useCallback(async (partialItem: any) => {
    if (!partialItem?.id || !partialItem?.tipo) return
    setLoading(true)
    setError(false)
    try {
      const full = await fetchFullItem(partialItem.tipo, partialItem.id)
      await selectItem(full)
    } catch { setError(true) }
    finally { setLoading(false) }
  }, [fetchFullItem, selectItem])

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const resp = await fetch(`${API}/specie/getRandomly`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) throw new Error()
      const specie = await resp.json()
      await selectItem(specie)
    } catch { setError(true) }
    finally { setLoading(false) }
  }, [token, selectItem])

  useEffect(() => {
    if (token) fetchRandom()
  }, [token])

  const tipo = selected?.tipo?.toLowerCase()
  const childLabel = tipo ? CHILD_LABEL[tipo] : ''
  const isLeaf = tipo === 'specie'

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-8 min-h-[calc(100vh-4rem)]">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 flex-wrap min-w-0 flex-1">
          <TreePine className="h-4 w-4 text-myP/60 shrink-0 mr-1" />
          {loading ? (
            <Skeleton className="h-6 w-72 rounded-lg" />
          ) : (
            ancestry.map((anc, i) => {
              const isLast = i === ancestry.length - 1
              const ancTipo = anc?.tipo?.toLowerCase()
              return (
                <span key={anc?.id || i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-txt/20 shrink-0" />}
                  <button
                    onClick={() => !isLast && navigateTo(anc)}
                    disabled={isLast}
                    className={cn(
                      'text-sm px-2 py-0.5 rounded-lg transition-colors font-medium',
                      isLast
                        ? cn('cursor-default border', TIPO_COLOR[ancTipo] ?? 'bg-white/10 text-white border-white/20')
                        : 'text-txt/40 hover:text-txt hover:bg-white/5 cursor-pointer'
                    )}
                  >
                    {anc?.nome}
                  </button>
                </span>
              )
            })
          )}
        </div>

        <Button
          onClick={fetchRandom}
          disabled={loading}
          className="flex-shrink-0 bg-myP text-myS font-semibold hover:bg-myP/80 rounded-xl gap-2 px-5 h-10"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Casuale
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">Errore nel caricamento. Riprova.</span>
        </div>
      )}

      {/* ── Body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Selected item */}
        <div className="lg:col-span-2">
          {loading
            ? <Skeleton className="h-[26rem] rounded-2xl" />
            : <SelectedCard item={selected} />
          }
        </div>

        {/* Children */}
        <div className="lg:col-span-3">
          {!loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-txt/40 uppercase tracking-widest">
                {isLeaf ? 'Livello foglia' : childLabel}
                {!isLeaf && !childrenLoading && children.length > 0 && (
                  <span className="ml-2 text-myP/60 normal-case font-normal">({children.length})</span>
                )}
              </p>
              {!isLeaf && !childrenLoading && children.length > 0 && (
                <span className="text-xs text-txt/30">Clicca per esplorare</span>
              )}
            </div>
          )}

          {loading || childrenLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : isLeaf ? (
            <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-white/10 gap-3">
              <div className="w-12 h-12 rounded-full bg-myP/10 flex items-center justify-center">
                <TreePine className="h-6 w-6 text-myP/50" />
              </div>
              <p className="text-sm text-txt/30 text-center">
                Sei al livello più basso della gerarchia.<br />
                <button onClick={fetchRandom} className="text-myP/60 hover:text-myP transition-colors mt-1 inline-block">
                  Prova con un'altra specie →
                </button>
              </p>
            </div>
          ) : children.length === 0 ? (
            <div className="flex items-center justify-center h-52 rounded-2xl border border-dashed border-white/10">
              <p className="text-sm text-txt/30">Nessun elemento trovato</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {children.map((child, i) => (
                <ChildCard
                  key={child?.id || i}
                  item={child}
                  onClick={() => navigateTo(child)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

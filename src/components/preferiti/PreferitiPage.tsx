'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Trash2, AlertCircle, TreePine } from 'lucide-react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useUserStore } from '@/store/userStore'
import { Skeleton } from '@/components/ui/skeleton'
import Details from '@/components/detail/Details'
import { cn } from '@/lib/utils'

const TIPO_COLOR: Record<string, string> = {
  regno:   'bg-purple-500/15 text-purple-300 border-purple-500/20',
  phylum:  'bg-blue-500/15 text-blue-300 border-blue-500/20',
  classe:  'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  ordine:  'bg-teal-500/15 text-teal-300 border-teal-500/20',
  famiglia:'bg-myP/15 text-myP border-myP/20',
  genere:  'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
  specie:  'bg-orange-500/15 text-orange-300 border-orange-500/20',
}

function FavCard({ item }: { item: any }) {
  const { removeFavourite } = useUserStore()
  const router = useRouter()
  const [detailOpen, setDetailOpen] = useState(false)
  const tipo = item?.tipo?.toLowerCase()

  return (
    <>
      <Details open={detailOpen} handleOpen={() => setDetailOpen(v => !v)} closeModal={() => setDetailOpen(false)} item={item} />
      <div className={cn(
        'group relative rounded-2xl overflow-hidden cursor-pointer',
        'ring-1 ring-transparent hover:ring-myP/40',
        'hover:shadow-[0_8px_32px_rgba(0,175,107,0.2)]',
        'transition-all duration-300'
      )}>
        {/* Full image */}
        <div className="relative h-56" onClick={() => router.push(`/${item.id}`)}>
          <img
            src={item?.img || ''}
            alt={item?.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* strong gradient so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          {/* Tipo badge top-left */}
          <div className="absolute top-2.5 left-2.5">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm', TIPO_COLOR[tipo] ?? 'bg-white/10 text-white border-white/20')}>
              {item?.tipo}
            </span>
          </div>

          {/* Remove heart top-right */}
          <button
            onClick={e => { e.stopPropagation(); removeFavourite(item.id) }}
            title="Rimuovi dai preferiti"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-red-500/50 text-myP hover:text-red-300 transition-all"
          >
            <GoHeartFill className="w-3.5 h-3.5" />
          </button>

          {/* Name + actions overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 mb-2">
              {item?.nome}
            </h3>
            <div className="flex items-center justify-between">
              <button
                onClick={e => { e.stopPropagation(); setDetailOpen(true) }}
                className="text-xs text-myP/80 hover:text-myP transition-colors font-medium"
              >
                Dettagli →
              </button>
              <button
                onClick={e => { e.stopPropagation(); removeFavourite(item.id) }}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Rimuovi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PreferitiPage() {
  const router = useRouter()
  const { token, favourites, fetchFavourites, setTokenFromStorage } = useUserStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('tokenKey') : null
      if (!stored) router.push('/login')
      else setTokenFromStorage(stored)
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchFavourites()
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  const count = Array.isArray(favourites) ? favourites.length : 0

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-8 min-h-[calc(100vh-4rem)]">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-myP/15 border border-myP/20 flex items-center justify-center shrink-0">
          <Heart className="h-5 w-5 text-myP" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-txt">Preferiti</h1>
          {!loading && (
            <p className="text-sm text-txt/40">
              {count === 0 ? 'Nessun elemento salvato' : `${count} element${count === 1 ? 'o' : 'i'} salvat${count === 1 ? 'o' : 'i'}`}
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">Errore nel caricamento dei preferiti.</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : count === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-white/10 gap-4">
          <div className="w-14 h-14 rounded-full bg-myP/10 flex items-center justify-center">
            <GoHeart className="w-7 h-7 text-myP/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-txt/50">Nessun preferito ancora</p>
            <p className="text-xs text-txt/30 mt-1">
              Clicca il{' '}
              <GoHeartFill className="inline w-3 h-3 text-myP" />{' '}
              su qualsiasi elemento per salvarlo qui
            </p>
          </div>
          <button
            onClick={() => router.push('/curiosone')}
            className="text-sm text-myP/70 hover:text-myP transition-colors mt-1"
          >
            Vai al Curiosone →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favourites.map((item: any) => (
            <FavCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
